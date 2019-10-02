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
    const tests = 2;
    let time = new Date().getTime();
    for(let i = 0; i < tests; i++){
        reset();
        base.init(room);
    }
    console.log((new Date().getTime() - time) / tests, 'avg_' + tests + ' initialization time!');
    base.loop(room);

    drawLayout(room);
    drawRoads(room);
    console.log('---------------------------------------');
}


