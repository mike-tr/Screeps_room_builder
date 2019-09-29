var base = require('./room_constractor');
require('./draw_layout')
require('./RoomVisual')

module.exports.loop = function () {
    let spawn = Game.spawns['Spawn1'];
    let room = spawn.room;

    // initialize and save to memory the layout
    // set room.memory.planner = null to reset the layout!
    base.init(room);
    base.loop(room);
 
    drawLayout(room);
    console.log('---------------------------------------');
}


