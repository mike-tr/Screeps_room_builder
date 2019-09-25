class get_freeSpace {
    /** @param {Room} room **/
    constructor(room, size, x_offset, y_offset, x, y){
        this.size = size;
        this.center = (size - 1) / 2;
        this.x_offset = x_offset;
        this.y_offset = y_offset;

        this.base = { x : x, y : y };
        this.buildings = [];
        this.roads = [];
        this.corners = [];

        this.base_arr = [];

        this.room = room;
        this.contacts = 3;
        this.map = [];
        this.init = false;
        const map = [];
        for(let gridY = 0; gridY < size; gridY++){
            for(let gridX = 0; gridX < size; gridX++){
                map.push({
                    gridX : gridX,
                    gridY : gridY,
                    x : gridX + x_offset,
                    y : gridY + y_offset,
                    id : gridY * size + gridX,
                    contacts : 0,
                    range : -1,
                    type : 0,
                })
            }
        }
        this.map = map;
        this.set_center(x, y,  room);
        this.init = true;
    }

    get_map_object(){
        let obj = {}
        let arr = [];
        for(let i of this.buildings){
            arr.push(this.map[i]);
        }
        obj.buildings = arr;
        return obj;
    }

    set_center(x, y, room){
        let tile = this.get_tile_word(x, y);
        if(tile){
            tile.type = 1;
            tile.range = 0;
        }

        let rmap = room.getTerrain();
        for(let gridY = 0; gridY < this.size; gridY++){
            for(let gridX = 0; gridX < this.size; gridX++){
                let type = rmap.get(gridX + this.x_offset, gridY + this.y_offset);
                let tile = this.map[gridY * this.size + gridX];
                //let type = Math.random() > 0.98 ? 1 : 0;
                if(type == 1){
                    tile.type = -1;
                    tile.range = -1;
                }else if(this.distance(x, y, gridX + this.x_offset, gridY + this.y_offset) <= 0){
                    tile.type = 0;
                    tile.range = 0;
                    this.base_arr.push(tile.id);
                }else if(gridX == 0 || gridY == 0 || gridX == this.size - 1 || gridY == this.size - 1){
                    tile.type = -3;
                    this.range = -1;
                    this.corners.push(tile.id);
                }else{
                    tile.type = 0;
                    tile.range -1;
                }
            }
        }

        this.possible = [];
        for(let i in this.base_arr){
            if(this.map[this.base_arr[i]].type == 0){
                this.possible.push(this.base_arr[i]);
            }
        }
        this.add_buildings();
        this.calculateMap(); 
        let corners = [];
        for(let i of this.corners){
            if(this.map[i].range > 0){
                corners.push(i);
            }
        }
        this.corners = corners;
    }

    add_buildings(){
        let buildings = this.room.find(FIND_MY_STRUCTURES, {
            filter : (s) => s.structureType != STRUCTURE_ROAD && s.structureType != STRUCTURE_RAMPART, 
        });
        for(let i in buildings){
            let pos = buildings[i].pos;
            let tile = this.get_tile_word(pos.x, pos.y);
            if(tile){
                console.log("?", pos);
                tile.type = -2;
                tile.building = buildings[i].structureType;
                this.buildings.push(tile.id);

                print(tile, 'nani?')
            }
        }
        console.log(this.buildings.length);
    }

    resetMap(){
        for(let gridY = 0; gridY < this.size; gridY++){
            for(let gridX = 0; gridX < this.size; gridX++){
                let tile = this.map[gridY * this.size + gridX];
                if(tile.range > 0){
                    tile.range = -1;
                }
                tile.contacts = 0;
            }
        }
    }

    calculateMap(){
        var currentArr = this.base_arr;

        let nextArr = [];
        let index = 0;
        let run = currentArr.length > 0;
        while(run){
            let tile = this.map[currentArr[index]];
            const value = tile.range + 1;
            if(value > 0){
                this.rangeRun(nextArr, value, tile);
            }
     
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
        //this.center = [];
        //console.log('calc1');
        //while(this.center)
    }

    add_build_place(){
        // let id = Math.floor(Math.random()*this.possible.length);
        // let key = this.possible[id];
        // this.possible.splice(id, 1);
        let key = this.possible.pop();
        if(key){
            let tile = this.map[key];
            if(tile.range > 0 && tile.contacts > this.contacts){
                if(this.try_addBuilding(tile)){
                    return key;
                }
            }
            this.resetMap();
            this.calculateMap();
            return this.add_build_place();
        }
        return null;
    }

    try_addBuilding(tile){
        if(tile && tile.type == 0){
            tile.type = -2;
            if(tile.range == 0){
                let id = this.base_arr.indexOf(tile.id);
                this.base_arr.splice(id, 1);
            }
            this.resetMap();
            this.calculateMap();
            this.buildings.push(tile.id);
            if(this.check_legit()){
                return true;
            }
            tile.type = 1;
            this.buildings.pop();
            if(tile.range == 0){
                this.base_arr.push(tile.id);
            }
        }
        return false;
    }

    check_legit(){
        for(let i of this.buildings){
            let tile = this.map[i];
            if(tile.range < 0 || tile.range > this.size * 0.6){
                return false;
            }
        }

        for(let i of this.corners){
            let tile = this.map[i];
            if(tile.range < 0 || tile.range > this.size * 0.55){
                return false;
            }
        }
        return true;
    }

    add_tile_world(x, y){
        let tile = this.get_tile(x - this.x_offset, y - this.y_offset);
        this.try_addBuilding(tile);
    }

    set_buildings_count(max){
        let c = this.buildings.length - max;
        for(let i = 0; i < c; i++){
            let b = this.buildings.shift();
            let tile = this.map[b];
            if(!tile.building){
                this.map[b].type = 0;
                this.possible.push(b);
            }else{
                this.buildings.push(b);
                c++;
            }
        }
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
                    target.contacts++;
                    if(target.range < 0 || target.range > value){
                        target.range = value;
                        if(target.type >= 0){
                            if(!this.init && target.type == 0){
                                this.possible.push(target.id);
                                //console.log(tile.gridX, tile.gridY)
                            }
                            arr.push(target.id);
                        }
                    }
                }
            }
        }
    }

    add_inRange(arr,gridX, gridY){
        for(let _gridY = -1; _gridY < 2; _gridY++){
            for(let _gridX = -1; _gridX < 2; _gridX++){
                let x1 = _gridX + gridX;
                let y1 = _gridY + gridY;      
                let tile = this.get_tile(x1, y1);
                if(tile){
                    arr.push(tile);
                }
            }
        }
    }

    get_tile(gridX, gridY){
        //gridX = Math.floor(gridX);
        //gridY = Math.floor(gridY);
        if(gridX >= this.size || gridY >= this.size || gridY < 0 || gridX < 0)
            return null;
        return this.map[gridY * this.size + gridX];
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

const print = (obj, text)=>{
    console.log(JSON.stringify(obj), text);
}

const create_l = function(room ,size, range, build, x_offset, y_offset , x_center, y_center){
    let map = new get_freeSpace(room, size, x_offset, y_offset, x_center, y_center);
    return map;
}


module.exports = {
    test : create_l,
}