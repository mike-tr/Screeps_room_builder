var layout_class = require('./layout_planner');
var buildings_buildings = require('./building_planner');

//create a ghost for storage + spawn + link + terminal
const add_sslt = function(buildings, types, rem_arr = []){
    let existing = buildings.get_types(types);
    let roads = buildings.get_roads_from(existing);
    let response = buildings.get_closest(types.length + rem_arr.length, 3, 'holder', false, roads);
    if(response){
        buildings.set_arr(response, rem_arr.concat(types));
        buildings.update_tiles(existing);
        return true;
    }else if(rem_arr.length == 0){
        if(!add_sslt(buildings, [STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_TERMINAL], ['link'])){
            if(!add_sslt(buildings, [STRUCTURE_LINK, STRUCTURE_STORAGE, STRUCTURE_TERMINAL], ['spawn'])){
                if(!add_sslt(buildings, [STRUCTURE_STORAGE, STRUCTURE_TERMINAL], ['link', 'spawn'])){
                    response = buildings.get_closest(4, 3, "holder", false);
                    buildings.set_arr(response, ['spawn', 'link', 'storage', 'terminal']);
                }
            }
        }
    }
    return false;   
}

module.exports = {
    
    /** @param {Room} room **/
    createBase : function(room, x, y){
        const size = 25;
        const offset  = Math.floor(size / 2);
        let layout = layout_class.test(room, size, x - offset, y - offset, x, y);
        while(layout.add_build_place()){}
        //layout.set_buildings_count(86);
        let buildings = new buildings_buildings(layout.get_map_object(), room);
        let center = buildings.center;

        add_sslt(buildings, [STRUCTURE_SPAWN, STRUCTURE_STORAGE, STRUCTURE_TERMINAL, STRUCTURE_LINK]);

        let arr = buildings.get_type("lab", false);
        buildings.checkOverlaping_v2(buildings.open, arr, 2, 5, 10, "lab");
        
        buildings.get_closest_to(center.x, center.y, 1, STRUCTURE_POWER_SPAWN, true);
        buildings.get_closest_to(center.x, center.y, 1, 'factory', true);
        buildings.get_closest_to(center.x, center.y, 1, STRUCTURE_NUKER, true);
        buildings.get_closest_to(center.x, center.y, 1, STRUCTURE_OBSERVER, true);
        buildings.get_closest_to(center.x, center.y, 2, STRUCTURE_SPAWN, true);
        buildings.get_closest_to(center.x, center.y, 6, STRUCTURE_TOWER, true);
        //buildings.checkOverlaping(arr, 1, skip, 5, 10, STRUCTURE_LAB);
        buildings.get_closest_to(center.x, center.y, 60, STRUCTURE_EXTENSION, true);
        buildings.close_data();

        room.memory.planner = { indexes : buildings.buildings, buildings : buildings.final, roads : buildings.roads };
        return { map : layout.map, bclass : buildings, b_list : buildings.buildings };
    }
}