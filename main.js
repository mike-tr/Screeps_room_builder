var base = require('./room_constractor');
require('./draw_layout')
require('./RoomVisual')

global.reset = function(){
    let spawn = Game.spawns['Spawn1'];
    spawn.room.memory.planner = null;
}

module.exports.loop = function () {
    let spawn = Game.spawns['Spawn1'];
    let room = spawn.room;

    // initialize and save to memory the layout
    // set room.memory.planner = null to reset the layout!
    let time = new Date().getTime();
    base.init(room);
    base.loop(room);
    console.log(new Date().getTime() - time, 'initialization time!');
 
    drawLayout(room);
    drawRoads(room);
    console.log('---------------------------------------');
}


