"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Asteroid_1 = __importDefault(require("./GameWorld/GameEntities/Asteroid"));
const Ship_1 = __importDefault(require("./GameWorld/GameEntities/Ship"));
const chalk_1 = __importDefault(require("chalk"));
class GameWorldData {
    constructor() {
        this.asteroids = [];
        this.asteroids.push(new Asteroid_1.default("A", 2, 4, 10));
        this.asteroids.push(new Asteroid_1.default("B", -1, 4, 20));
        this.asteroids.push(new Asteroid_1.default("C", 1, 1, 4));
        this.ship = new Ship_1.default("playerShip", 2, 2, 2, 2);
    }
}
// We might keep these as debug flags and this will allow us to dynamically insert strings, but then treat it as enums
const SIMULATE = "physics.simulate.step";
// physicsReducer
// step the simulation
// update new value, including moving all the asteroids
class GameWorldStore {
    constructor() {
        this._worldData = new GameWorldData();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new GameWorldStore();
        }
        return this._instance;
    }
    get worldData() {
        return this._worldData;
    }
    dispatch(action) {
        const message = action.type;
        // handle things in a reducer here, and allow us to build pipes of reducers, these can affect certain parts of the gameworld, so we can more precisely control
        // mutations
        // they can also access any other part of the world that they need in a readonly fashion if necessary
        console.log("This is where we submit actions that happen to the game world", message);
        if (message === SIMULATE) {
            // we run the physics simulation, which will be the following
            this._worldData.asteroids.forEach((asteroid) => {
                asteroid.x += asteroid.dx;
                asteroid.y += asteroid.dy;
            });
            const { ship } = this._worldData;
            ship.x += ship.dx;
            ship.y += ship.dy;
        }
    }
}
const { asteroids, ship } = GameWorldStore.instance.worldData;
const displayAsteroids = (asteroids) => {
    asteroids.forEach(asteroid => console.log(`
Designation: ${asteroid.designation} 
Position: (${asteroid.x}, ${asteroid.y})
Velocity: (${asteroid.dx}, ${asteroid.dy})
Value: $${asteroid.value}m
`));
};
displayAsteroids(asteroids);
GameWorldStore.instance.dispatch({ type: SIMULATE });
// GameWorldStore.instance.dispatch(SIMULATE);
displayAsteroids(asteroids);
// Let's try and draw this
// Let's draw a grid so we can see what is happening over time, we'll divide it up into grid areas and then we'll be able to see
class Camera {
    constructor(left, top, width, height) {
        this._width = width;
        this._height = height;
        this._halfWidth = width / 2;
        this._halfHeight = height / 2;
        this._top = top;
        this._left = left;
        this._right = left + width;
        this._bottom = top - height;
    }
    get center() {
        return { x: this._left + this._halfWidth, y: this._top - this._halfHeight };
    }
    set center(p) {
        this._top = p.y + this._halfHeight;
        this._left = p.x - this._halfWidth;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get left() {
        return this._left;
    }
    get right() {
        return this._right;
    }
    get top() {
        return this._top;
    }
    get bottom() {
        return this._bottom;
    }
    contains(p) {
        const { _top: top, _left: left, _right: right, _bottom: bottom } = this;
        const { x, y } = p;
        return left <= x && x <= right
            && bottom <= y && y <= top;
    }
}
const camera = new Camera(-10, 10, 20, 20);
const visibleAsteroids = asteroids.filter(asteroid => camera.contains(asteroid));
const gridPositionedAsteroids = asteroids.map(asteroid => {
    return Object.assign(Object.assign({}, asteroid), { x: Math.floor(asteroid.x - camera.center.x), y: Math.floor(asteroid.y - camera.center.y) });
});
const adjustedShip = Object.assign(Object.assign({}, ship), { x: ship.x - camera.center.x, y: ship.y - camera.center.y });
// TODO: we gotta optimize this
// let's draw them on the screen
// console.log(gridPositionedAsteroids);
// console.log(camera);
console.log(gridPositionedAsteroids);
// This is just a small test program
for (let y = camera.top; y >= camera.bottom; y--) {
    let colorStr = "";
    for (let x = camera.left; x <= camera.right; x++) {
        const matchingAsteroids = gridPositionedAsteroids.filter(a => a.x === x && a.y === y);
        const squareValue = matchingAsteroids.reduce((value, a) => value + a.value, 0);
        let text = "";
        if (x === 0 && y === 0) {
            text = "+-";
        }
        else if (x === 0) {
            text = "| ";
        }
        else if (y === 0) {
            text = "--";
        }
        else {
            text = "  ";
        }
        if (adjustedShip.x === x && adjustedShip.y === y) {
            text = "<>";
        }
        colorStr += chalk_1.default.bgHex(matchingAsteroids.length ? "#77AA77" : "#000000")(text);
    }
    console.log(colorStr);
}
