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


var base = require('./room_constractor');
require('./RoomVisual')

module.exports.loop = function () {
    let spawn = Game.spawns['Spawn1'];

    //let pos = new RoomPosition(20, 20);

    let room = spawn.room;

    let time = 0;
    let cycles = 200;
    for(let i = 0; i < cycles; i++){
        let t = new Date().getTime();
        //base.init(room);
        time += new Date().getTime() - t;
    }
    console.log(time / cycles);

    time = new Date().getTime();
    base.init(room);
    base.loop(room);
    console.log(new Date().getTime() - time, 'time');
 
    
    let test = room.memory.planner;
    for(let j in test.indexes){
        for(let i of test.indexes[j].ids){
            let p = test.buildings[i];
            let t = p.type;
            if(p.contacts > 0 && t > 0){
                t = 7
            }
            let d = new wpos(p.x, p.y, 3);
            if(p.type){
                if(p.id){
                   // console.log(JSON.stringify(p));
                }
                room.visual.structure(p.x, p.y, p.type);
            }
            //d.draw(room);
        }
    }
    console.log('---------------------------------------');
}


