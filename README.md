# Screeps_room_builder
Screeps_room_builder

Sadly i forgot to comment it :'(

now as to how my algorithem works, i get the map of the room, and get a base position ( the spawn ).
now i get a range from the center and start to generate "fake buildings" now each building must follow the rules,
it should not block the way to another building ( each building must have at least 3 or X number of free spaces around it )
it would calculate the shortest path to the center node from outside the range for every single node ouside (in a circle )
and make sure that from any point on that circle the path to the center node, is less then say Y ( it would be range * 2 or something )
now that makes sure there is an exist from the base from any side of the base.

and after that we basically have a list of all available sport to spawn structures, so we just have to decide with spot is with structure, mainly i follow some rules, for labs there should be at least 2 labs with range of 2 or less from any other lab.
for spawn terminal storage and 1 link, all should be within the range of 1.
then towers, within the range of say 6 from the base, and then nuker etc.... and everything that left, is extentions
and we always pick the closest empty spot from the center node.
that makes sure out base is round and good!

anyway sorry for no comments, i might rewrite it all into typescript in the future.


downsides:
  it fails to generate the same layout after structures have been placed,
  possible fix, would be to ignore any exist building, it would always genrate the same layout, but if you placed,
  a building without the  template, it wont match you'r current base. (if you use the layout it would be the same layout always,
  the algorithem is not random at all, the fact that i generate the base from outside to the inside, make buildings on the inisde,
  mess up the "path" for placing building from the outside.


the algorithem also generate the room from outside to the inside, rather then from inside out,
reason being that generating it this way create less of a bunker base, while the other way around it create quite the bunker 
( the check for short path to the center is basically easily avoided from inside out ).




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

