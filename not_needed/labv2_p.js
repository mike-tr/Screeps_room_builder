class get_freeSpace {
    /** @param {Room} room **/
    constructor(room, size, x_offset, y_offset){
        this.size = size;
        this.center = (size - 1) / 2;
        this.x_offset = x_offset;
        this.y_offset = y_offset;

        this.changeMap = [];

        let rmap = room.getTerrain();
        this.map = [];
        const map = [];
        for(let gridX = 0; gridX < size; gridX++){
            const line = [];
            for(let gridY = 0; gridY < size; gridY++){
                line.push({
                    gridX : gridX,
                    gridY : gridY,
                    x : gridX + x_offset,
                    y : gridY + y_offset,
                    type : -1,
                })
            }
            map.push(line);
        }
        this.map = map;

        for(let gridY = 0; gridY < size; gridY++){
            for(let gridX = 0; gridX < size; gridX++){
                let type = rmap.get(gridX + x_offset, gridY + y_offset);
                //let type = Math.random() > 0.98 ? 1 : 0;
                if(type == 1){
                    let tile = this.map[gridX][gridY];
                    //this.add_building(tile);
                    tile.type = 0;
                    this.changeMap.push(tile);
                    //console.log(this.changeMap);
                }else if(gridY == 0 || gridX == 0 || gridX + 1 == size || gridY +1 == size){
                    let tile = this.map[gridX][gridY];
                    //this.add_building(tile);
                    tile.type = 1;
                    this.changeMap.push(tile);
                }
            }
        }
        this.calculateMap();
    }

    calculateMap(){
        var currentArr = this.changeMap;

        let nextArr = [];
        let index = 0;
        let run = currentArr.length > 0;
        while(run){
            let tile = currentArr[index];
            const value = tile.type + 1;
            this.rangeRun(nextArr, value, tile);
     
            index++;
            if(currentArr.length <= index){
                currentArr = nextArr;
                nextArr = [];
                index = 0;
                if(currentArr.length <= 0){
                    break;
                }
            }
            //console.log(keys.length);
        }
        this.changeMap = [];
        //console.log('calc1');
        //while(this.changeMap)
    }

    get_area(range){
        for(let gridY = 0; gridY < this.size; gridY++){
            for(let gridX = 0; gridX < this.size; gridX++){
                let tile = this.map[gridX][gridY];
                if(tile.type == range){
                    return tile;
                }
            }
        }
        return null;
    }

    get_closest_area(area_size, x, y){
        let ret = null;
        let distance = 10000;
        for(let gridY = 0; gridY < this.size; gridY++){
            for(let gridX = 0; gridX < this.size; gridX++){
                let tile = this.map[gridX][gridY];
                if(tile.type >= area_size){
                    let dist = this.distance(tile.x, tile.y, x, y);
                    if(dist < distance){
                        distance = dist;
                        ret = tile;
                    }
                }
            }
        }
        return ret;
    }

    add_tile(gridX, gridY){
        let tile = this.get_tile(gridX, gridY);
        if(tile){
            tile.type = 0;
            this.changeMap.push(tile);
        }
        this.calculateMap();
    }

    add_tile_world(x, y){
        this.add_tile(x - this.x_offset, y - this.y_offset);
    }

    rangeRun(arr, value, tile){
        for(let _gridY = -1; _gridY < 2; _gridY++){
            for(let _gridX = -1; _gridX < 2; _gridX++){
                if(_gridX == 0 && _gridY == 0)
                    continue;
                let x1 = _gridX + tile.gridX;
                let y1 = _gridY + tile.gridY;      
                let target = this.get_tile(x1, y1);
                if(target){
                    if(target.type < 0 || target.type > value){
                        target.type = value;
                        arr.push(target);
                    }
                }
            }
        }
    }

    get_inRange(gridX, gridY){
        let r = [];
        for(let _gridY = -1; _gridY < 2; _gridY++){
            for(let _gridX = -1; _gridX < 2; _gridX++){
                let x1 = _gridX + gridX;
                let y1 = _gridY + gridY;      
                let tile = this.get_tile(x1, y1);
                if(tile)
                    r.push(tile);
            }
        }
        return r;
    }

    add_labs(){
        for(let gridY = 0; gridY < size - 5; gridY++){
            for(let gridX = 0; gridX < size - 5; gridX++){

            }
        }
    }

    get_tile(gridX, gridY){
        //gridX = Math.floor(gridX);
        //gridY = Math.floor(gridY);
        if(gridX >= this.size || gridY >= this.size || gridY < 0 || gridX < 0)
            return null;
        return this.map[gridX][gridY];
    }

    get_tile_word(x, y){
        return this.get_tile(x - this.x_offset, y - this.y_offset);
    }

    tile_distance(tileA, tileB){
        //console.log(center , tileA.gridX - center, tileA.gridY - center);    
        return (tileA.gridX - tileB.gridX) ** 2 + (tileA.gridY - tileB.gridY) ** 2;
    }

    distance(x1, y1, x2, y2){
        return(x1 - x2) ** 2 + (y1 - y2) **2;
    }
}

const print = (obj)=>{
    console.log(JSON.stringify(obj));
}

const create_l = function(room ,size, range, build, x, y){
    let map = new get_freeSpace(room, size, x, y);
    return map;
}


module.exports = {
    test : create_l,
}