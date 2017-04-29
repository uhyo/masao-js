import {
    AdvancedMap,
    MasaoJSONFormatVersion,
    LayerObject,
    formatVersionToNumber,
} from './data';

export function checkAdvancedMap(map: AdvancedMap): void{
    // advanced-mapが変だったらthrowする
    let {
        customParts,
    } = map;
    if (customParts == null){
        customParts = {};
    }
    for (const {size, layers} of map.stages){
        // 各ステージ
        let main_flg = false;
        for (const {type, map} of layers){
            if (type === 'main'){
                // メインレイヤーは1つだけ
                if (main_flg === true){
                    throw new Error('More than one main layer is included');
                }
                main_flg = true;
            }
            if (map.length !== size.y){
                throw new Error('Invalid map size');
            }
            for (const row of map){
                if (row.length !== size.x){
                    throw new Error('Invalid map size');
                }
                if (type === 'mapchip'){
                    for (const chip of row){
                        if ('number' !== typeof chip){
                            throw new Error('Invalid map chip');
                        }
                    }
                }else{
                    for (const chip of row){
                        if ('string' === typeof chip && customParts[chip] == null){
                            throw new Error('Undefined custom parts');
                        }
                    }
                }
            }
        }
    }
}

export interface SanitizeAdvancedMapOptions{
    /**
     * stage number.
     */
    stageNumber: number;
    /**
     * number of 'mapchip' layers.
     * defaults to 1.
     */
    layerNumber?: number;
    /**
     * Maximum string length.
     * defaults to 1000.
     */
    maxStringLength?: number;
}
/**
 * advanced-mapをsanitizeする
 * validなadvanced-mapであることは前提
 */
export function sanitizeAdvancedMap(versionstring: MasaoJSONFormatVersion, obj: AdvancedMap, options: SanitizeAdvancedMapOptions): AdvancedMap | undefined{
    const stageNumber = options.stageNumber;
    const layerNumber = options.layerNumber || 1;
    const maxStringLength = options.maxStringLength || 1000;

    const version = formatVersionToNumber(versionstring);
    if (version < 4){
        // Advanced Mapに対応していないバージョン
        return void 0;
    }
    // いらないものは消していく
    const stages = obj.stages.slice(0, stageNumber).map(stage=>{
        const size = {
            x: stage.size.x,
            y: stage.size.y,
        };
        const layers: Array<LayerObject> = [];
        let layer_count = 0;
        for (const {id, type, src, map} of stage.layers){
            if (type === 'mapchip'){
                if (++layer_count > layerNumber){
                    // レイヤーが複数あるので飛ばす
                    continue;
                }
            }
            const src2 = 'string' === typeof src ? src.slice(0, maxStringLength) : '';
            layers.push({
                id,
                type,
                src: src2,
                map,
            });
        }
        return {
            size,
            layers,
        };
    });
    // まだ何もない
    const customParts = void 0;
    return {
        stages,
        customParts,
    };
}
