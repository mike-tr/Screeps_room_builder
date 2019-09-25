const test = function(map, size) {
    let todo = [];
    let newTodo = [];
    for (var x=0; x<size; x++) {
        for (var y=0; y<size; y++) {
            if(map[x][y] == 1) {
                todo.push({x,y,v: 1});
            }
        }
    }

    while(todo.length > 0 || newTodo.length > 0) {
        if (todo.length == 0) {
            todo = newTodo;
            newTodo = [];
        }
        const {x, y, v} = todo.pop();
        for (var i=x-1; i<x+1; i++) {
            for (var j=y-1; j<y+1; j++) {
                if(i >= 0 && i < size && j >= 0 && j < size && map[i][j] == 0) {
                    map[i][j] = { x : i, y : j , v : v + 1 };
                    newTodo.push({x: i, y: j, v: v+1});
                }
            }
        }
    }
    console.log(JSON.stringify(map));
}



module.exports = {
    run : function(size){
        const map = [];    
        for (var i=0; i<size; i++) {
            let line = [];
            for (var j=0; j<size; j++) {
                line.push(Math.round(Math.random() - 0.45))
            }
            map.push(line)
        }
        test(map);

        return map;
    }
}