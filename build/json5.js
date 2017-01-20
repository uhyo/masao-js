#! /usr/bin/env node
"use strict";

// watch script for compiling JSON5
const fs = require('fs');
const path = require('path');

const glob = require('glob');
const watch = require('watch');
const JSON5 = require('json5');


const base = path.resolve(process.argv[2]);
const dist = path.resolve(process.argv[3]);
const opt = process.argv[4];

// initial compilation
glob(path.join(base, '**', '*.json5'), {}, (err, matches)=>{
    if (err){
        console.error(err);
        return;
    }
    for (let f of matches){
        const filename = path.resolve(process.cwd(), f);
        cmp(filename);
    }

    if (opt === '--watch'){
        // watch mode
        watch.createMonitor(base, monitor=>{
            monitor.on('created', f=>{
                cmp(f);
            });
            monitor.on('changed', f=>{
                cmp(f);
            });
        });
    }
});

function cmp(filename){
    const ext = path.extname(filename);
    if (ext !== '.json5'){
        return;
    }
    console.log('JSON5 compiling', filename);
    const p = path.resolve(process.cwd(), filename);
    const bname = path.basename(filename, ext);
    const dir = path.dirname(filename);
    const rel = path.relative(base, dir);

    const tname = path.join(dist, rel, `${bname}.json`);

    const data = fs.readFileSync(p, 'utf8');
    try {
        const obj = JSON5.parse(data);
        const json = JSON.stringify(obj, null, 2);

        fs.writeFileSync(tname, json, 'utf8');
    } catch(e){
        console.error(e);
        return;
    }
}
