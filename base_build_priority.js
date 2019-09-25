class buildingPlacement{
    constructor(buildings){
        this.labs = [];
        this.buildings = buildings.reverse();
    }

    check_in_radius2(skip){
        for(let i in this.buildings){
            if(skip > 0){
                skip--;
                continue;
            }
            let tile = this.buildings[i];
            let arr = this.sort(this.buildings, tile, 2);
            if(arr.length >= 10){
                let v = this.check_2o(arr, 2);
                if(v){
                    console.log('found one!', JSON.stringify(v));
                    for(let i in arr){
                        console.log(JSON.stringify(arr[i]))
                    }
                    return arr;
                }
                //console.log('found one!', JSON.stringify(tile));
            }
        }
        console.log('didnt find anything :(');
        return null;
    }

    check_2o(arr, range){
        let first = arr.shift();
        let s2 = null;
        for(let i in arr){
            let tile = arr[i];
            let arr2 = this.sort(arr, tile, range);
            if(arr2.length >= 9){
                //console.log('found one!', JSON.stringify(tile));
                s2 = arr2[0];
            }
        }
        arr.unshift(first);
        return s2;
    }

    sort(arr, tile, r){
        let ret = [];
        ret.push(tile);
        for(let i in arr){
            let t = arr[i];
            
            if(t == tile)
                continue;
            let d = this.sdist(tile, t);
            if(d <= r){
                ret.push(t);
            }
        }
        //console.log(ret.length);
        return ret;
    }

    sdist(tilea, tileb){
        let x = Math.abs(tilea.x - tileb.x);
        let y = Math.abs(tilea.y - tileb.y);
        if(x > y)
            return x;
        return y;
    }
}


module.exports = function(buildings){
    return new buildingPlacement(buildings);
}