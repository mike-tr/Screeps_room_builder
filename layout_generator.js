class room_map {
    constructor(args){
        if(args.map){
            this.map = args.map;
            this.size = args.size;
            this.max_contact = args.max_contact;
            this.buildings = args.buildings;
        }else{
            let size = args.size;
            this.size = size;
            this.max_contact = args.max_contact;
            this.map = [];
            this.buildings = 0;
            for(let y = 0; y < size; y++){
                for(let x = 0; x < size; x++){
                    this.map.push({
                        x : x,
                        y : y,
                        type : 0,
                        contacts : 0,
                    })
                }
            }
        }
    }

    add_building(){
        let tile = this.empty_inRange();
        console.log(tile);
        if(tile){
            tile.type = 1;
        
            let tiles = this.get_inRange(tile.x, tile.y);
            for(let i in tiles){
                tiles[i].contacts++;
            }
            this.buildings++;
            console.log('added building in ', JSON.stringify(tile), this.buildings);
        }else{
            console.log('no valid tiles');
        }

    }

    get_inRange(x, y, range = 1){
        let r = [];
        for(let _y = -range; _y < range + 1; _y++){
            for(let _x = -range; _x < range + 1; _x++){
                let x1 = x + _x;
                let y1 = y + _y;         
                let tile = this.get_tile(x1, y1);
                if(tile)
                    r.push(tile);
            }
        }
        return r;
    }

    get_tile(x, y){
        x = Math.floor(x);
        y = Math.floor(y);
        if(x > this.size || y > this.size || y < 0 || x < 0)
            return null;
        return this.map[y * this.size + x];
    }

    check_valid(x ,y){
        let tile =this.get_tile(x, y);
        if(tile && tile.type == 0 && tile.contacts < this.max_contact){
            return tile;
        }
        return null;
    }

    empty_inRange(range = 0){
        let _c = Math.floor(this.size / 2);
        let border1 = _c - range;
        let border2 = _c + range;
        if(range > this.size)
            return null;
        for(let i = -range; i < range; i++){
            let c = _c + i;
            let tile = this.check_valid(c, border1);
            if(tile)
                return tile;
            tile = this.check_valid(c, border2);
            if(tile)
                return tile;
            tile = this.check_valid(border1, c);
            if(tile)
                return tile;
            tile = this.check_valid(border2, c);
            if(tile)
                return tile;
        }
        let tile = this.check_valid(border2, border2);
        if(tile)
                return tile;
        return this.empty_inRange(range + 1);
    }
}

const print = (obj)=>{
    console.log(JSON.stringify(obj));
}

const create_l = function(size, max, build){
    let map = new room_map({ size : size, max_contact : max });
    for(let i = 0; i < build; i++){
        map.add_building();
    }
    return map;
}


module.exports = {
    test : create_l,
}