# Screeps_room_builder
Screeps_room_builder

My repositery of my screeps room planner.
should in the end be fully automatic layout of the base,
so far can create a map of potential building placements.

Very very slow so far,
layout_single_road.js - the class that create room build layout,
pass size the size of the potential base,
Around 15 is recommended.
choose x,y for the center of the base (not this tile will be empty!).

can work around walls and terain.

Also usefull
lab_placment.js

can find the area size in any place on the room.
works quite fast about 1-2 ms to get the ranges and all areas in the room
how to get the area?
returns a class with Map array.

each tile object,
has x,y.
as well as the 'type' variable.
type = range to walls.
so type - 5 would be
this tile is a center of 5x5 grid without walls. 
