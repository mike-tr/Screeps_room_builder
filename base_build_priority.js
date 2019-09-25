class buildingPlacement{
    constructor(map){
        this.buildings = {};
        this.open = nap.buildings.reverse();
    }

    check_in_radius(overlaps, skip, radius, count, type){
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
                        let id = this.open.indexOf(v[i]);
                        this.open.splice(id, 1);
                    }
                    this.buildings[type] = v;
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