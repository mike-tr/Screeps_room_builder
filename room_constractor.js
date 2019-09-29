var base = require('./_planner')

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
        let response = room.lookForAt(LOOK_STRUCTURES, tile.x, tile.y).filter((s) => s.structureType != STRUCTURE_ROAD 
            && s.structureType != STRUCTURE_RAMPART);
        console.log(JSON.stringify(tile), type);
        if(response.length == 0){
            response = room.lookForAt(LOOK_CONSTRUCTION_SITES, tile.x, tile.y);
            if(response.length == 0){
                planner.in_process[tile.index] = tile;
                room.createConstructionSite(tile.x, tile.y, type);
                console.log('creating', type, 'at', tile.x, tile.y);
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
                delete queue[index];
                room.memory.planner.nvalidate = false;
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
            console.log("initializing room planner!");
            let spawns = room.find(FIND_MY_SPAWNS);
            if(spawns.length > 0){
                let spawn = spawns[0];
                base.createBase(room, spawn.pos.x + 1, spawn.pos.y);
                room.memory.clevel = 0;
                room.memory.planner.in_process = {};
                room.memory.planner.max_buildings = 8;
            }
        }
    },

    /** @param {Room} room **/
    loop : function(room){    
        if(room.memory.clevel != room.controller.level){
            room.memory.clevel = room.controller.level;
            room.memory.planner.enabled = true;
            room.memory.planner.nvalidate = false;
        }

        if(room.memory.planner.enabled){
            let co = room.find(FIND_MY_CONSTRUCTION_SITES).length;
            let planner = room.memory.planner;
            if(co > planner.max_buildings){
                return;
            }
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
                planner.enabled = false;
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
