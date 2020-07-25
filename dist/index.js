"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Asteroid {
    constructor(designation, x, y, value) {
        this.designation = designation;
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
        this.value = value;
    }
}
class GameWorldData {
    constructor() {
        this.asteroids = [];
        this.asteroids.push(new Asteroid("A", 2, 4, 10));
        this.asteroids.push(new Asteroid("B", 20, 8, 20));
        this.asteroids.push(new Asteroid("C", 1, 1, 4));
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
    dispatch(message) {
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
        }
    }
}
const { asteroids } = GameWorldStore.instance.worldData;
const displayAsteroids = (asteroids) => {
    asteroids.forEach(asteroid => console.log(`
Designation: ${asteroid.designation} 
Position: (${asteroid.x}, ${asteroid.y})
Velocity: (${asteroid.dx}, ${asteroid.dy})
Value: $${asteroid.value}m
`));
};
displayAsteroids(asteroids);
GameWorldStore.instance.dispatch(SIMULATE);
GameWorldStore.instance.dispatch(SIMULATE);
GameWorldStore.instance.dispatch(SIMULATE);
displayAsteroids(asteroids);
// Let's try and draw this
// Let's draw a grid so we can see what is happening over time, we'll divide it up into grid areas and then we'll be able to see
class Camera {
    constructor(top, left, width, height) {
        this._width = width;
        this._height = height;
        this._halfWidth = width / 2;
        this._halfHeight = height / 2;
        this._top = top;
        this._left = left;
        this._right = left + width;
        this._bottom = top + height;
    }
    get center() {
        return { x: this._left + this._halfWidth, y: this._top + this._halfHeight };
    }
    set center(p) {
        this._top = p.y - this._halfHeight;
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
const camera = new Camera(-20, -20, 40, 40);
const visibleAsteroids = asteroids.filter(asteroid => camera.contains(asteroid));
const gridPositionedAsteroids = asteroids.map(asteroid => {
    return Object.assign(Object.assign({}, asteroid), { x: Math.floor(asteroid.x - camera.left), y: Math.floor(asteroid.y - camera.top) });
});
// TODO: we gotta optimize this
// let's draw them on the screen
console.log(gridPositionedAsteroids);
console.log(camera);
for (let y = camera.top; y <= camera.bottom; y++) {
    let colorStr = "";
    for (let x = camera.left; x <= camera.right; x++) {
        const matchingAsteroids = gridPositionedAsteroids.filter(a => a.x === x && a.y === y);
        const squareValue = matchingAsteroids.reduce((value, a) => value + a.value, 0);
        colorStr += matchingAsteroids.length;
        // pick a color based off of that and draw make it a string
        // if(squareValue < 1){
        //     colorStr += chalk.bgRgb(0,0,0)("   ");
        // } else {
        //     colorStr += chalk.bgRgb(255,255,255)("   ");
        // }
        //colorStr += squareValue.toString();
    }
    console.log(colorStr);
}
