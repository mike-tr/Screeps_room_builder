var layout_class = require('./layout_planner');
var buildings_buildings = require('./building_planner');

module.exports = {
    
    /** @param {Room} room **/
    createBase : function(room, x, y){
        let layout = layout_class.test(room, 17,x - 8,y - 8, x, y);
        while(layout.add_build_place()){}
        //layout.set_buildings_count(86);
        let buildings = buildings_buildings(layout.get_map_object());
        let center = buildings.center;

        let spawn = buildings.get_type(STRUCTURE_SPAWN);
        if(spawn){
            let roads = buildings.get_road_inrange(spawn.x, spawn.y, 3);
            let response = buildings.get_closest(3, 3, "holder", false, roads);
            if(response){
                buildings.set_arr(response, ['link', 'storage', 'terminal']);
                buildings.update_tile(spawn);
                //buildings.add_building(spawn);
            }else{
                let response = buildings.get_closest(4, 3, "holder", false);
                buildings.set_arr(response, ['spawn', 'link', 'storage', 'terminal']);
            }
            //console.log(roads.length, JSON.stringify(roads));
        }else{
            let response = buildings.get_closest(4, 3, "holder", false);
            buildings.set_arr(response, ['spawn', 'link', 'storage', 'terminal']);
        }
        buildings.get_closest_to(center.x, center.y, 1, STRUCTURE_POWER_SPAWN, true);
        buildings.get_closest_to(center.x, center.y, 1, 'factory', true);
        buildings.get_closest_to(center.x, center.y, 1, STRUCTURE_NUKER, true);
        buildings.get_closest_to(center.x, center.y, 1, STRUCTURE_OBSERVER, true);
        buildings.get_closest_to(center.x, center.y, 2, STRUCTURE_SPAWN, true);
        buildings.get_closest_to(center.x, center.y, 6, STRUCTURE_TOWER, true);
        buildings.checkOverlaping(1, 8, 5, 10, STRUCTURE_LAB);
        buildings.get_closest_to(center.x, center.y, 60, STRUCTURE_EXTENSION, true);

        room.memory.planner = { indexes : buildings.buildings, buildings : buildings.all, roads : buildings.roads };
        return { map : layout.map, bclass : buildings, b_list : buildings.buildings };
    }
}