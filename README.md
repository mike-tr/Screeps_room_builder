# Screeps_room_builder
Screeps_room_builder

main.js example.

create spawn, would automatically create a base layout around it,

room_constractor.js - create all the functionality to auto build,
init - generate the layout,
loop - checks for controller update, and create constructions when needed.

layout_planner.js - generate the initial layout, just building placements and such.
building_planner.js - a class that can use generated data from above, and place buildings and such.
_planner.js - the settings for the base layout, building priority - A.k.a what is toward the center and what is more outward.


working with already built bases might have issues regardig the storate/terminal locations.
recommended use for new bases

examples -

simulation!
![alt text](https://i.gyazo.com/548e3b7b0bc0d241e1c12d3d4e2f07c7.png)

room with some constructions before
![alt text](https://i.gyazo.com/54b0a4095365215b2fbbca7d3ce6094e.png)

room with spawn only
![alt text](https://i.gyazo.com/cf05a315d83d6d2388a7088efd500bdd.png)

