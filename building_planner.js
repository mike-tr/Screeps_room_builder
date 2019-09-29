class buildingPlacement{
    constructor(map){
        this.map = map;
        this.buildings = {
            spawn : { ids : [] },
            extension : { ids : [] },
            lab : { ids : [] },
            link : { ids : [] },
            nuker : { ids : [] },
            storage : { ids : [] },
            terminal : { ids : [] }, 
            tower : { ids : [] }, 
            powerSpawn : { ids : [] },
            observer : { ids : [] },
            factory : { ids : [] },
        };
        
        this.all = [];
        let start = 0;
        for(let i in map.buildings){
            let tile = map.buildings[i];
            tile.index = start;
            this.all.push(tile);
            start++;
        }

        this.open = map.buildings;
        this.roads = map.roads;
        this.center = map.base;
    }

    set_arr(arr, arr_type){
        for(let i in arr){
            let type = arr_type[i];
            let tile = arr[i];
            tile.type = type;
            this.buildings[type].ids.push(tile.index);
            this.remove_tile(tile);
        }
    }

    get_road_inrange(x, y, r){
        let arr = [];
        for(let i in this.roads){
            let road = this.roads[i];
            if(this.distance(x, y, road.x, road.y) <= r){
                arr.push(road);
            }
        }
        return arr;
    }

    get_type(itype){
        for(let i in this.open){
            let t = this.open[i];
            if(t.type == itype){
                return t;
            }
        }
    }

    remove_tile(tile){
        let id = this.open.indexOf(tile);
        this.open.splice(id, 1);
    }

    get_closest(count, max_range, itype, set, in_list){
        if(!in_list)
            in_list = this.roads;
        for(let i in in_list){
            let r = in_list[i];
            let get = this.get_closest_to(r.x, r.y, count, itype);
            if(get.ranges && get.ranges[count - 1].d <= max_range){
                if(set && itype){
                    return this.set_tiles(get.obj, itype);
                }
                return get.obj;
            }
        }
        return null;
    }

    get_closest_to(x, y, count, itype, set){
        let arr = [];
        let ex = [];
        for(let i in this.open){
            let tile = this.open[i];
            if(tile.type){
                if(tile.type == itype){
                    arr.push({ id : i, d : 0 });
                }
                continue;
            }
            let dist = this.distance(x, y, tile.x, tile.y);
            arr.push({ id : i, d : dist });
        }
        arr.sort((a, b) => a.d - b.d);
        arr = arr.slice(0, count);
        arr = arr.concat(ex);

        let ret= [];
        for(let i in arr){
            ret.push(this.open[arr[i].id]);
        }
        if(set && itype)
            return this.set_tiles(ret, itype);
        return { ranges : arr, obj : ret };
    }

    set_tiles(tiles, type){
        if(!type)   
            return;
        for(let i in tiles){
            let tile = tiles[i];
            tile.type = type;
            this.buildings[type].ids.push(tile.index);
            this.remove_tile(tile);
        }
        return tiles;   
    }

    checkOverlaping(overlaps, skip, radius, count, type){
        for(let i in this.open){
            if(skip > 0){
                skip--;
                continue;
            }
            let tile = this.open[i];
            if(tile.type && tile.type != type)
                continue;
            let arr = this.get_withinRange(this.open, tile, radius, type);
            if(arr.length >= count){
                let v = this.check_overload(overlaps, arr, radius, count);
                if(v){
                    v = v.slice(0, count);
                    return this.set_tiles(v, type);
                }
                //console.log('found one!', JSON.stringify(tile));
            }
        }
        console.log('didnt find anything :(');
        return null;
    }

    check_overload(times, arr, radius, count){
        for(let i = 0; i < times; i++){
            if(arr){
                arr = this.check_more_connections(times, arr, radius, count);
            }
        }
        return arr;
    }

    check_more_connections(skip, arr, range, count){
        let first = arr[0];
        for(let i in arr){
            if(skip > 0){
                skip--;
                continue;
            }
            let tile = arr[i];
            let arr2 = this.get_withinRange(arr, tile, range);
            if(arr2.length >= count){
                arr2 = arr2.sort((a) => this.tile_distance(a, first));
                return arr2;
            }
        }
        return null;
    }

    get_withinRange(arr, tile, r, type){
        let ret = [];
        ret.push(tile);
        for(let i in arr){
            let t = arr[i];
            
            if(t == tile || (t.type && t.type != type)) 
                continue;
            let d = this.tile_distance(t, tile);
            if(d <= r){
                t.range = d;
                ret.push(t);
            }
        }
        //console.log(ret.length);
        return ret;
    }

    tile_distance(tileA, tileB){
        return (tileA.x - tileB.x) ** 2 + (tileA.y - tileB.y) ** 2;
    }

    distance(x1, y1, x2, y2){
        return (x1 - x2) ** 2 + (y1 - y2) ** 2;
    }
}


module.exports = function(open){
    return new buildingPlacement(open);
}