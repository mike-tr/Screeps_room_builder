// const CONTROLLER_STRUCTURES = {
//     "spawn": {0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3},
//     "extension": {0: 0, 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60},
//     "link": {1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 3, 7: 4, 8: 6},
//     "road": {0: 2500, 1: 2500, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
//     "constructedWall": {1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
//     "rampart": {1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500},
//     "storage": {1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1},
//     "tower": {1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 6},
//     "observer": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
//     "powerSpawn": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
//     "extractor": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1},
//     "terminal": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1},
//     "lab": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 3, 7: 6, 8: 10},
//     "container": {0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5},
//     "nuker": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1},
// };

const under_c = [ STRUCTURE_EXTENSION, STRUCTURE_LAB, STRUCTURE_LINK, STRUCTURE_OBSERVER, 
    STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_NUKER, STRUCTURE_TERMINAL, STRUCTURE_TOWER, "factory"];


var base = require('./roomBuilder');

/** @param {Room} room **/
const constract = function(room, type, skip){
    let sk = skip;
    let planner = room.memory.planner;

    for(let i of planner.indexes[type].ids){
        if(skip > 0){
            skip--;
        }
        sk++;
        let tile = planner.buildings[i];
        if(Game.getObjectById(tile.id))
            continue;
        let response = room.lookForAt(LOOK_STRUCTURES, tile.x, tile.y);
        if(response.length == 0){
            response = room.lookForAt(LOOK_CONSTRUCTION_SITES, tile.x, tile.y);
            if(response.length == 0){
                planner.in_process[tile.index] = tile;
                room.createConstructionSite(tile.x, tile.y, type);
                console.log(JSON.stringify(tile));
                return sk;
            }else{
                tile.id = response[0].id;
            }
        }else{
            tile.id = response[0].id;
        }
    }
    return ERR_INVALID_TARGET;
}

const update_ongoing = function(room){
    let queue = room.memory.planner.in_process;
    if(Object.keys(queue).length > 0){
        for(let index in queue){
            let tile = queue[index];
            let find = Game.getObjectById(tile.id);
            console.log(find);
            if(!find){
                let response = room.lookForAt(LOOK_STRUCTURES, tile.x, tile.y);
                if(response.length > 0){
                    tile.id = response[0].id;
                    delete queue[index];
                }else{
                    response = room.lookForAt(LOOK_CONSTRUCTION_SITES, tile.x, tile.y);
                    if(response.length > 0){
                        tile.id = response[0].id;
                    }else{
                        delete queue[index];
                    }
                }
            }
        }
        return false;
    }
    return true;
}

module.exports = {
    /** @param {Room} room **/
    init : function(room, reset){
        if(!room.memory.planner){
            console.log("initialized room planner!");
            let spawns = room.find(FIND_MY_SPAWNS);
            if(spawns.length > 0){
                let spawn = spawns[0];
                base.createBase(room, spawn.pos.x + 1, spawn.pos.y);
                room.memory.clevel = 0;
                room.memory.planner.in_process = {};
            }
        }
    },

    /** @param {Room} room **/
    loop : function(room){    
        if(Game.time % 2 != 0)
            return;

        if(room.controller.level != room.memory.clevel){
            let co = room.find(FIND_MY_CONSTRUCTION_SITES).length;
            if(co > 8){
                return;
            }
            let planner = room.memory.planner;
            let response = update_ongoing(room);

            if(!planner.nvalidate){
                let done = true;
                let structures = room.find(FIND_MY_STRUCTURES);
                structures = structures.concat(room.find(FIND_MY_CONSTRUCTION_SITES));
                for(let type in room.memory.planner.indexes){
                    if(type == 'factory' || type == 'holder')
                        continue;
                    let os = _.sum(structures, st => st.structureType == type)
                    let n = CONTROLLER_STRUCTURES[type][room.controller.level] - os;
                    let skip = 0;
                    for(let i = 0; i < n; i++){
                        //skip = constract(room, s, skip);
                        console.log(type);
                        skip = constract(room, type, skip);
                        if(skip != ERR_INVALID_TARGET)
                            done = false;
                    }
                }

                if(done){
                    planner.nvalidate = true;
                }
            }else if(response){
                planner.nvalidate = false;
                room.memory.clevel = room.controller.level;
            }
        }else if(room.find(FIND_MY_CONSTRUCTION_SITES).length < 5){
            for(let tile of room.memory.planner.roads){
                if(!Game.getObjectById(tile.id)){
                    let response = room.lookForAt(LOOK_STRUCTURES, tile.x, tile.y);
                    if(response.length > 0){
                        tile.id = response[0].id;
                    }else{
                        response = room.lookForAt(LOOK_CONSTRUCTION_SITES, tile.x, tile.y);
                        if(response.length > 0){
                            tile.id = response[0].id;
                        }else{
                            room.createConstructionSite(tile.x, tile.y, "road");
                            return;
                        }
                    }
                }
            }
        }
    }
}
