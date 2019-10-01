const basic_layout = {
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
    factory : {fill: 'white', radius: 0.43, stroke: 'blue'},
    holder : {fill: 'black', radius: 0.43, stroke: 'blue'},
}

/** @param {Room} room **/
global.drawLayout = function(room, structure = true){
    let test = room.memory.planner;
    for(let j in test.indexes){
        for(let i of test.indexes[j].ids){
            let p = test.buildings[i];
            let t = p.type;
            if(p.contacts > 0 && t > 0){
                t = 7
            }
            if(p.type){
                if(structure){
                    room.visual.structure(p.x, p.y, p.type);
                }else{
                    room.visual.circle(p.x, p.y, basic_layout[p.type]);
                }
            }
        }
    }
}

global.drawRoads = function(room){
    let test = room.memory.planner;
    for(let j in test.roads){
        let p = test.roads[j];
        let t = p.type;
        room.visual.circle(p.x, p.y, {fill: 'gray', radius: 0.25, stroke: 'gray'});
    }
}
