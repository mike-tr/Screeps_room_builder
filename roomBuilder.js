var layout_class = require('./layout_single_road');
var buildings_buildings = require('./base_build_priority');

module.exports = {
    
    /** @param {Room} room **/
    createBase : function(room, x, y){
        let layout = layout_class.test(room, 15, 10 , 10, 17, 17);
        while(layout.add_build_place()){}
        layout.set_buildings_count(87);
        let buildings = buildings_buildings(layout.get_map_object());

        let center = buildings.center;
        buildings.checkOverlaping(1, 8, 5, 10, STRUCTURE_LAB);
        
        let spawn = buildings.get_type(STRUCTURE_SPAWN);
        if(spawn){
            let roads = buildings.get_road_inrange(spawn.x, spawn.y, 3);
            let response = buildings.get_closest(3, 3, "holder", false, roads);
            if(response){
                buildings.set_arr(response, ['link', 'storage', 'terminal']);
                buildings.remove_tile(spawn);
                buildings.add_building(spawn);
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
        buildings.get_closest_to(center.x, center.y, 60, STRUCTURE_EXTENSION, true);

        return layout;
    }
}