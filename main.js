const types = {
    '-10' : {fill: 'red', radius: 0.55, stroke: 'black'}, 
    '-3' : {fill: 'transparent', radius: 0.2, stroke: 'transparent'},
    '-1' : {fill: 'blue', radius: 0.2, stroke: 'black'},
    0 : {fill: 'transparent', radius: 0.2, stroke: 'transparent'},
    1 : {fill: 'transparent', radius: 0.2, stroke: 'transparent'},
    2 : {fill: 'blue', radius: 0.2, stroke: 'black'},
    3 : {fill: 'black', radius: 0.2, stroke: 'black'},
    4 : {fill: 'green', radius: 0.2, stroke: 'black'},
    5 : {fill: 'red', radius: 0.2, stroke: 'black'},
    6 : {fill: 'cyan', radius: 0.2, stroke: 'white'},
    7 : {fill: 'brown', radius: 0.2, stroke: 'green'},
    8 : {fill: 'purple', radius: 0.2, stroke: 'blue'},
    9 : {fill: 'white', radius: 0.2, stroke: 'blue'},
}

const t_t = {
    spawn : {fill: 'yellow', radius: 0.65, stroke: 'black'},
    extension : {fill: 'yellow', radius: 0.45, stroke: 'black'},
    lab : {fill: 'black', radius: 0.4, stroke: 'white'}, 
    link : {fill: 'blue', radius: 0.4, stroke: 'white'}, 
    nuker : {fill: 'green', radius: 0.55, stroke: 'white'},  
    storage : {fill: 'cyan', radius: 0.55, stroke: 'black'}, 
    terminal : {fill: 'white', radius: 0.55, stroke: 'black'}, 
    tower : {fill: 'red', radius: 0.43, stroke: 'white'}, 
    powerSpawn : {fill: 'red', radius: 0.55, stroke: 'black'},
    observer : {fill: '#a0fdff', radius: 0.45, stroke: 'white'},
    holder : {fill: 'white', radius: 0.43, stroke: 'blue'},
}


class wpos {
    constructor(x, y, type, cube = false){
        this.x = x;
        this.y = y;
        this.type = type;
        this.cube = cube;
    }

    draw_structure(room){
        room.visual.circle(this.x, this.y, t_t[this.type]);
    }

    draw(room){
        if(this.type > 0 && !this.cube){
            room.visual.circle(this.x, this.y, types[this.type]);
        }else{
            room.visual.rect(this.x - 0.35, this.y - 0.35, 0.7, 0.7, types[this.type]);
        }  
    }
}

var arr = [];

var l3 = require('./layout_v3g');
var labs = require('./lab_placment');
var labsv2 = require('./labv2_p');
var base = require('./roomBuilder');
require('./RoomVisual')

const create_l = function(){
    let l = [];

    for(let y = 0; y < 15; y++){
        for(let x = 0; x < 15; x++){
            l.push({
                x : x,
                y : y,
                v : 0,
            })
        }
    }

    let numObject = 10;
    let x = 10;
    let y = 5;
    console.log(JSON.stringify(l[y * 15 + x]));
}

const addBuilding = function(map){

}

module.exports.loop = function () {
    let spawn = Game.spawns['Spawn1'];

    //let pos = new RoomPosition(20, 20);

    let _x = 25, _y = 25;
    //for(let x = x)

    let room = spawn.room;
    //let d = new wpos(25, 25, 1);
    //d.draw(room);

    //console.log("???");
    let strctures = room.find(FIND_MY_STRUCTURES);
    for(let i in strctures){
        let s = strctures[i];
        let t = s.structureType;
        t = (_.invert(t_t))[t];
        let pos = new wpos(s.pos.x - 25, s.pos.y - 25, t);
        arr.push(pos); 
    }

    let size = 21;
    let max = 4;
    let build = 120;
    let test = null;
    
    // //create_l();
    // test = layout.test(size, max, build);
    // //console.log(JSON.stringify(arr));
    // for(let i in test.map){
    //     let p = test.map[i];
    //     let t = p.type;
    //     if(p.contacts > 0 && t > 0){
    //         t = 5;
    //     }
    //     let d = new wpos(p.x + 1, p.y + 1, p.contacts);
    //     //d.draw(room);
    //     d = new wpos(p.x + 1, p.y + 1, p.type);
    //     d.draw(room);
    // }
    let time = 0;
    let cycles = 200;
    for(let i = 0; i < cycles; i++){
        let t = new Date().getTime();
        test = base.createBase(room, 17, 17);
        time += new Date().getTime() - t;
    }
    console.log(time / cycles);

    test = base.createBase(room, 17, 17);

    //console.log(JSON.stringify(arr));
    for(let i in test.map){
        let p = test.map[i];
        let t = p.type;
        if(p.contacts > 0 && t > 0){
            t = 7
        }
        //let d = new wpos(p.x, p.y, p.contacts);

        //room.visual.structure(8, 13, STRUCTURE_TOWER);
        //d.draw(room);
        //d = new wpos(p.gridX, p.gridY, p.type);
        //d.draw(room);
    }

    //test = l3.test(room ,size, max, build, 5 , 6);
    let labs1 = true;
    if(labs1){
        
        for(let j in test.map){
            let p = test.map[j];
            let t = p.type;
            if(p.contacts > 0 && t > 0){
                t = 7
            }
            //let d = new wpos(p.x, p.y, p.type);
            //d.draw(room);
            let d = new wpos(p.x, p.y, p.building);
            if(p.building){
                room.visual.structure(p.x, p.y, p.building);
            }
            //d.draw_structure(room);
        }
    }
    
    let labs2 = true;
    if(labs2){
        test = labs.test(room , 50, max, 210, 0 , 0);
        let time = 0;
        for(let i = 0; i < cycles; i++){
            let t = new Date().getTime();
            //test = labs.test(room , 50, max, 210, 0 , 0);
            //test = labs.test(room , 50, max, 210, 0 , 0);
            //test = labs.test(room , 50, max, 210, 0 , 0);
            //test = labs.test(room , 50, max, 210, 0 , 0);
            // test = labsv2.test(room , 50, max, 210, 0 , 0);
            // test.add_tile(15, 15);
            // test.add_tile(21, 21);
            // test.get_tile(10 , 10);
            // test.get_tile_word(15, 15);
            //test.get_area(5);
            //test.get_closest_area(5, 20 , 20);
            time += new Date().getTime() - t;
        }
        //console.log(time / cycles);
        test.calculateMap();

  
        for(let j in test.map){
            let p = test.map[j];
            let t = p.type;
            if(p.contacts > 0 && t > 0){
                t = 7
            }
            let d = new wpos(p.x, p.y, p.contacts);
            //d.draw(room);
            d = new wpos(p.x, p.y, p.type);
            //d.draw(room);
        }
    }

    console.log('---------------------------------------');
}


