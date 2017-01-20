

export function checkAdvancedMap(map: any): void{
    // advanced-mapが変だったらthrowする
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
                }
            }
        }
    }
}
