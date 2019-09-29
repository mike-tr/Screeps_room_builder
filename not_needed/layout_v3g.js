class room_map {
    /** @param {Room} room **/
    constructor(room, _x, _y, args){
        if(args.map){
            this.map = args.map;
            this.size = 50;
            this.max_contact = args.max_contact;
            this.buildings = args.buildings;
            this.center = (50 - 1) / 2;
        }else{
            let size = 50;
            this.size = 50;
            this.max_contact = args.max_contact;
            this.map = [];
            this.buildings = 0;
            this.center = (size - 1) / 2;
            this.pivot = { x : _x, y : _y};
            this.room = room;

            let rmap = room.getTerrain();
            for(let gridY = 0; gridY < size; gridY++){
                for(let gridX = 0; gridX < size; gridX++){
                    this.map.push({
                        gridX : gridX,
                        gridY : gridY,
                        type : 0,
                        contacts : 0,
                    })
                }
            }
            for(let gridY = 0; gridY < size; gridY++){
                for(let gridX = 0; gridX < size; gridX++){
                    let type = rmap.get(gridX, gridY);
                    if(type == 1){
                        let tile = this.get_tile(gridX, gridY);
                        this.add_building(tile);
                        tile.type = 2;
                    }
                }
            }
        }
    }

    add_building(tile){
        //let tile = null
        if(tile == undefined)
            tile = this.empty_inRange();
        //console.log(tile);
        if(tile){
            tile.type = 1;
            tile.contacts--;
        
            let tiles = this.get_inRange(tile.gridX, tile.gridY);
            for(let i in tiles){
                tiles[i].contacts++;
            }
            this.buildings++;
            //console.log('added building in ', JSON.stringify(tile), this.buildings);
        }else{
            //console.log('no valid tiles');
        }

    }

    get_inRange(gridX, gridY, range = 1){
        let r = [];
        for(let _gridY = -range; _gridY < range + 1; _gridY++){
            for(let _gridX = -range; _gridX < range + 1; _gridX++){
                let x1 = _gridX + gridX;
                let y1 = _gridY + gridY;         
                let tile = this.get_tile(x1, y1);
                if(tile)
                    r.push(tile);
            }
        }
        return r;
    }

    get_tile(gridX, gridY){
        gridX = Math.floor(gridX);
        gridY = Math.floor(gridY);
        if(gridX > this.size || gridY > this.size || gridY < 0 || gridX < 0)
            return null;
        return this.map[gridY * this.size + gridX];
    }

    check_surroundings(gridX, gridY){
        let range = this.get_inRange(gridX, gridY);
        for(let i in range){
            let tile = range[i];
            if(tile.contacts >= this.max_contact){
                return false;
            }
        }
        return true;
    }

    add_valid(arr, gridX ,gridY){
        let tile = this.get_tile(gridX, gridY);
        if(tile && tile.type == 0 && tile.contacts < this.max_contact){
            if(this.check_surroundings(gridX, gridY))
                arr.push(tile);
        }
        return null;
    }   

    tile_distance(tileA){
        //console.log(center , tileA.gridX - center, tileA.gridY - center);   
        return (tileA.gridX - this.pivot.x) ** 2 + (tileA.gridY - this.pivot.y) ** 2;
    }

    empty_inRange(range = 1){
        //console.log(tiles);

        let r = null;
        let d = 1000;
        let rn = 0;
        while(r == null){
            let tiles = this.valid_inRange(rn, range - 1);
            rn += range;
            for(let i in tiles){
                let tile = tiles[i];
                let dist = this.tile_distance(tile);
                if(d > dist){
                    d = dist;
                    r = tile;
                }
            } 

            if(rn > this.size)
                return null;
        }
        //console.log(d, this.center, JSON.stringify(r));
        return r;
    }

    valid_inRange(range = 0, depth = 2){
        let borderx1 = Math.ceil(this.pivot.x - range);
        let borderx2 = Math.floor(this.pivot.x + range);
        let bordery1 = Math.ceil(this.pivot.y - range);
        let bordery2 = Math.floor(this.pivot.y + range);
        let r = [];
        if(range < 0){
            return r;
        }else if(range == 0){
            if(this.size % 2 == 1){
                this.add_valid(r, this.pivot.x, this.pivot.y);
            }
            return r;
        }
        
        if(range > 25){
            if(depth > 0){
                return this.valid_inRange(range - 1, depth - 1);
            }
            return null;
        }
        
        for(let gridX = borderx1; gridX <= borderx2; gridX++){
            this.add_valid(r, gridX, bordery1);
            this.add_valid(r, gridX, bordery2);
        }

        for(let gridY = bordery1 + 1; gridY <= bordery2 - 1; gridY++){
            this.add_valid(r, borderx1, gridY);
            this.add_valid(r, borderx2, gridY);
        }

        if(depth > 0){
            r = r.concat(this.valid_inRange(range - 1, depth - 1));
        }
        //r.concat(this.valid_inRange())
        
        return r;
    }
}

const print = (obj)=>{
    console.log(JSON.stringify(obj));
}

const create_l = function(room ,size, max, build, x, y){
    let map = new room_map(room, x, y, { size : size, max_contact : max });
    for(let i = 0; i < build; i++){
        map.add_building();
    }

    return map;
}


module.exports = {
    test : create_l,
}