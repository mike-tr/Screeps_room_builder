class buildingPlacement{
    constructor(map){
        this.map = map;
        this.buildings = {
            spawn : { tiles : [], index : 0 },
            extension : { tiles : [], index : 0 },
            lab : { tiles : [], index : 0 },
            link : { tiles : [], index : 0 },
            nuker : { tiles : [], index : 0 },
            storage : { tiles : [], index : 0 },
            terminal : { tiles : [], index : 0 }, 
            tower : { tiles : [], index : 0 }, 
            powerSpawn : { tiles : [], index : 0 },
            holder : { tiles : [], index : 0 },
            observer : { tiles : [], index : 0 },
            factory : { tiles : [], index : 0},
        };
        this.open = map.buildings.reverse();
        this.roads = map.roads.reverse();
        this.center = map.base;
    }

    set_arr(arr, arr_type){
        for(let i in arr){
            let type = arr_type[i];
            let tile = arr[i];
            tile.building = type;
            this.buildings[type].tiles.push(tile);
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
            if(t.building == itype){
                return t;
            }
        }
    }

    add_building(tile){
        this.buildings[tile.building].tiles.unshift(tile);
        this.buildings[tile.building].index++;
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
            if(tile.building){
                if(tile.building == itype){
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
            tile.building = type;
            this.remove_tile(tile);
        }
        this.buildings[type].tiles.concat(tiles);   
        return tiles;   
    }

    checkOverlaping(overlaps, skip, radius, count, type){
        for(let i in this.open){
            if(skip > 0){
                skip--;
                continue;
            }
            let tile = this.open[i];
            if(tile.building && tile.building != type)
                continue;
            let arr = this.sort(this.open, tile, radius, type);
            if(arr.length >= count){
                let v = this.check_overload(overlaps, arr, radius, count);
                if(v){
                    v = v.slice(0, count);
                    for(let i in v){
                        v[i].building = type;
                        this.remove_tile(tile);
                    }
                    this.buildings[type].tiles.concat(v); 
                    return v;
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
            let arr2 = this.sort(arr, tile, range);
            if(arr2.length >= count){
                arr2 = arr2.sort((a) => this.tile_distance(a, first));
                return arr2;
            }
        }
        return null;
    }

    sort(arr, tile, r, type){
        let ret = [];
        ret.push(tile);
        for(let i in arr){
            let t = arr[i];
            
            if(t == tile || (t.building && t.building != type)) 
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

    sdist(tilea, tileb){
        let x = Math.abs(tilea.x - tileb.x);
        let y = Math.abs(tilea.y - tileb.y);
        if(x > y)
            return x;
        return y;
    }
}


module.exports = function(open){
    return new buildingPlacement(open);
}