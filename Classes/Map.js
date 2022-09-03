const background = {
    Dirt: 0,
    Stone: 1
}

export class Map {
    constructor() {
        this.rooms = []
    }
    generateMap(x, y, startx, starty) {
        // get end room
        let rooms = []
        for (let i = 0; i < x; i++) {
            let col = []
            for (let z = 0; z < y; z++) {
                col.push(null);
            }
            rooms.push(col)
        }
        let nextCons = this.getRandomConnections(rooms, startx, starty)
        rooms[startx][starty] = new RoomGen(nextCons.nesw.N, nextCons.nesw.E, nextCons.nesw.S, nextCons.nesw.W);
        for (let ix = 0; ix < x; ix++) {
            for (let iy = 0; iy < y; iy++) {
                if (ix == startx && iy == starty) {
                    continue;
                }
                nextCons = this.getRandomConnections(rooms, ix, iy);
                rooms[ix][iy] = new RoomGen(nextCons.nesw.N, nextCons.nesw.E, nextCons.nesw.S, nextCons.nesw.W);
            }
        }
        this.rooms = rooms;
    }
    getRandomConnections(rooms, x, y) {
        let possibles = []
        if (x != 0 && (rooms[x-1][y] == null || rooms[x-1][y].E == true)) {
            possibles.push([x-1, y]);
        }
        if (x != rooms.length-1 && (rooms[x+1][y] == null || rooms[x+1][y].W == true)) {
            possibles.push([x+1, y]);
        }
        if (y != 0 && (rooms[x][y-1] == null || rooms[x][y-1].S == true)) {
            possibles.push([x, y-1]);
        }
        if (y != rooms[0].length-1 && (rooms[x][y+1] == null || rooms[x][y+1].N == true)) {
            possibles.push([x, y+1]);
        }
        let numChoices = this.getRandomInt(1,possibles.length+1);
        let shuffled = possibles.sort(() => 0.5 - Math.random());
        shuffled = shuffled.slice(0, numChoices);
        let nesw = {N: false, E: false, S: false, W: false};
        if (shuffled.includes([x-1, y])) {
            nesw.W = true;
        }
        if (shuffled.includes([x+1, y])) {
            nesw.E = true;
        }
        if (shuffled.includes([x, y+1])) {
            nesw.N = true;
        }
        if (shuffled.includes([x, y-1])) {
            nesw.S = true;
        }
        return {coords: shuffled, nesw: nesw};
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }
}

class Room {
    constructor(enemy, bg) {
        this.enemy = enemy;
        this.bg = bg;
    }
}

class RoomGen {
    constructor(N, E, S, W) {
        this.N = N;
        this.E = E;
        this.S = S;
        this.W = W;
    }
}