// Load HTML (requires Browser API!)
import {
    MasaoJSONFormat,
    make,
} from './format';
import {
    sanitize,
} from './param';

export function html(source: string): Promise<MasaoJSONFormat | null>{
    return new Promise<any>((resolve, _reject)=>{
        // DOMParser
        const parser = new DOMParser();

        const htmldoc = parser.parseFromString(source, 'text/html');

        // 正男を探す(まずはapplet/object)
        const applets = Array.from<HTMLElement>(htmldoc.querySelectorAll('applet, object') as any);

        for (let a of applets){
            if (a.tagName === 'APPLET'){
                // applet!
                const code = a.getAttribute('code') || '';
                const archive = a.getAttribute('archive') || '';
                const version = getVersion(code, archive);
                if (version == null){
                    continue;
                }
                const ps = Array.from<HTMLParamElement>(a.getElementsByTagName('param'));
                const params: Record<string, string> = {};
                for (let p of ps){
                    params[p.name] = p.value;
                }
                resolve(make({
                    params,
                    version,
                }));
                return;
            }else if (a.tagName === 'OBJECT'){
                // object!
                const type = a.getAttribute('type') || '';
                if (/^application\/x-java-applet$/i.test(type)){
                    // 正男かも
                    const ps = Array.from<HTMLParamElement>(a.getElementsByTagName('param'));
                    const params: Record<string, string> = {};

                    let code;
                    let archive;
                    for (let p of ps){
                        if (/^classid$/i.test(p.name)){
                            const re = p.value.match(/^java:(.+)$/);
                            if (re == null){
                                continue;
                            }
                            code = re[1];
                        }else if (/^archive$/i.test(p.name)){
                            archive = p.value;
                        }else{
                            params[p.name] = p.value;
                        }
                    }
                    if (code == null || archive == null){
                        continue;
                    }
                    const version = getVersion(code, archive);
                    if (version == null){
                        continue;
                    }
                    resolve(make({
                        params: sanitize(params, version),
                        version,
                    }));
                    return;
                }
            }
        }

        // applet, objectは無かった
        resolve(runCanvas(htmldoc));
    });
}

function runCanvas(htmldoc: HTMLDocument): Promise<MasaoJSONFormat | null>{
    // canvas正男を動作させる
    // Web Workerを作る
    let worker = `
CanvasMasao = {
    Game: function Game(params, id, options){
        result = {
            params: params,
            'advanced-map': options['advance-map'] || options['advanced-map'],
        };
        postMessage(result);
        close();
    },
};
JSMasao = CanvasMasao;
`;
    const scripts = htmldoc.querySelectorAll('script');
    for (const s of Array.from<HTMLScriptElement>(scripts)){
        if (!s.src && (!s.type || /^(?:text|application)\/javascript$/.test(s.type))){
            // srcがないものを全部突っ込む
            worker += `;${s.textContent};`;
        }
    }
    // sandbox iframeを作る
    worker = worker.replace(/\u2028|\u2029/g, ' ');
    const inject = `
<!doctype html>
<html><head><title>sandbox</title></head>
<body>
<script>
var pa = null;
var origin = null;
var result = null;
window.addEventListener('message', function(ev){
    pa = event.source;
    origin = event.origin;

    send(pa, origin, result);
}, false);
function send(pa, origin, result){
    if (pa != null && result != null){
        pa.postMessage(result, origin);
        pa = null;
    }
}

var worker = ${JSON.stringify(worker)};
var blob = new Blob([worker], {type: 'text/javascript'});
var url = URL.createObjectURL(blob);

var worker = new Worker(url);
worker.onmessage = function(ev){
    result = ev.data;
    send(pa, origin, result);
};
setTimeout(function(){
    worker.terminate();
}, 3000);

</script>
</body>
</html>
`;

    // これをiframeで開く
    const blob = new Blob([inject], {
        type: 'text/html',
    });
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    iframe.sandbox.add('allow-scripts');

    return new Promise<MasaoJSONFormat | null>(resolve=>{

        // random
        const id = Math.random().toString(36).slice(2);
        const handler = (ev: MessageEvent)=>{
            if (ev.data != null){
                // ゲームを受け取った
                console.log('YEAH', ev.data);
                if (timeout != null){
                    clearTimeout(timeout);
                }
                timeout = null;
                window.removeEventListener('message', handler, false);

                // makeがthrowするかも
                resolve(make({
                    params: ev.data.params,
                    version: 'fx16',
                    'advanced-map': ev.data['advanced-map'],
                }));
            }
        };
        let timeout: any = setTimeout(()=>{
            window.removeEventListener('message', handler, false);
            resolve(null);
        }, 3000);

        window.addEventListener('message', handler, false);

        // 通信開始
        document.body.appendChild(iframe);
        setTimeout(()=>{
            iframe.contentWindow.postMessage('ping', '*');
        }, 250);
    }).then(result=>{
        document.body.removeChild(iframe);
        return result;
    });
}

// code, archiveからversionを推定
function getVersion(code: string, archive: string): '2.8' | 'fx16' | 'kani2' | null{
    if (/^(?:MasaoConstruction|MasaoJSS)(?:\.class)?$/i.test(code)){
        // 正男っぽい
        // バージョン判定
        if (/\.zip$/i.test(archive)){
            return '2.8';
        }else{
            return 'fx16';
        }
    }else if(/^MasaoKani2?(?:\.class)$/i.test(code)){
        return 'kani2';
    }
    return null;
}
