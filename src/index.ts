import { DeepReadonly } from 'ts-essentials';
import chalk from 'chalk';

class Asteroid {
    designation: string;
    x: number;
    y: number;
    value: number;
    dx: number;
    dy: number;
    
    constructor(designation:string, x:number, y:number, value:number){
        this.designation = designation;
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5)*2;
        this.dy = (Math.random() - 0.5)*2;
        this.value = value;
    }
}

class GameWorldData {
    asteroids: Asteroid[];
    constructor(){
        this.asteroids = [];
        this.asteroids.push(new Asteroid("A", 2,4,10));
        this.asteroids.push(new Asteroid("B", -1,4,20));
        this.asteroids.push(new Asteroid("C", 1,1,4));
    }
}

// We might keep these as debug flags and this will allow us to dynamically insert strings, but then treat it as enums
const SIMULATE = "physics.simulate.step"

// physicsReducer
// step the simulation
// update new value, including moving all the asteroids

class GameWorldStore {
    // Singleton Pieces
    private static _instance: GameWorldStore;
    public static get instance(): DeepReadonly<GameWorldStore> {
        if (!this._instance) {
            this._instance = new GameWorldStore();
        }
        return this._instance;
    }
    // Instance Pieces
    private _worldData: GameWorldData;
    private constructor() {
        this._worldData = new GameWorldData();
    }
    get worldData(): DeepReadonly<GameWorldData> {
        return this._worldData;
    }
    
    dispatch(message:string){
        // handle things in a reducer here, and allow us to build pipes of reducers, these can affect certain parts of the gameworld, so we can more precisely control
        // mutations
        // they can also access any other part of the world that they need in a readonly fashion if necessary
        console.log("This is where we submit actions that happen to the game world", message);
        if(message === SIMULATE){
            // we run the physics simulation, which will be the following
            this._worldData.asteroids.forEach(
                (asteroid) => {
                    asteroid.x += asteroid.dx; 
                    asteroid.y += asteroid.dy;
                });
        }
    }

}
const { asteroids } = GameWorldStore.instance.worldData;
type AsteroidArray = typeof asteroids;

const displayAsteroids = (asteroids: AsteroidArray) =>{
asteroids.forEach(
    asteroid => console.log(
`
Designation: ${asteroid.designation} 
Position: (${asteroid.x}, ${asteroid.y})
Velocity: (${asteroid.dx}, ${asteroid.dy})
Value: $${asteroid.value}m
`));
}

displayAsteroids(asteroids);
// GameWorldStore.instance.dispatch(SIMULATE);
// GameWorldStore.instance.dispatch(SIMULATE);
// GameWorldStore.instance.dispatch(SIMULATE);
displayAsteroids(asteroids);

// Let's try and draw this
// Let's draw a grid so we can see what is happening over time, we'll divide it up into grid areas and then we'll be able to see
class Camera {
    private _top: number;
    private _left: number;
    private _bottom: number;
    private _right: number;
    private _width: number;
    private _height: number;
    private _halfHeight: number;
    private _halfWidth: number;
    
    constructor(left:number, top:number, width:number, height:number){
        this._width = width;
        this._height = height;
        this._halfWidth = width/2;
        this._halfHeight = height/2;
        this._top = top;
        this._left = left;
        this._right = left + width;
        this._bottom = top - height;
    }
    get center(){
        return { x: this._left + this._halfWidth, y: this._top - this._halfHeight};
    }
    set center(p: {x:number, y:number}){
        this._top = p.y + this._halfHeight;
        this._left = p.x - this._halfWidth;
    }
    get width(){
        return this._width;
    }
    get height(){
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
    contains(p: {x:number, y:number}):boolean{
        const { _top:top, _left:left, _right:right, _bottom:bottom } = this;
        const {x,y} = p;

        return left <= x && x <= right 
            && bottom <= y && y <= top;
    }
}

const camera = new Camera(-10, 10, 20, 20);
const visibleAsteroids = asteroids.filter(asteroid => camera.contains(asteroid));

const gridPositionedAsteroids = asteroids.map(asteroid => {
    return {
        ...asteroid,
        x: Math.floor(asteroid.x - camera.center.x),
        y: Math.floor(asteroid.y - camera.center.y)
    }
})

// TODO: we gotta optimize this
// let's draw them on the screen
// console.log(gridPositionedAsteroids);
// console.log(camera);
console.log(gridPositionedAsteroids);
// This is just a small test program
for(let y = camera.top; y >= camera.bottom; y--){
    let colorStr = "";
    for(let x = camera.left; x <= camera.right; x++){
        const matchingAsteroids = gridPositionedAsteroids.filter(a => a.x === x && a.y === y)
        const squareValue = matchingAsteroids.reduce((value,a) => value + a.value, 0)
        colorStr += chalk.bgHex(matchingAsteroids.length ? "#77AA77" : "#000000")(
            (x === 0 && y === 0) 
                ?"+-"
                : x == 0
                    ? "| "
                    : y === 0
                        ? "--"
                        : "  ");
    }
    console.log(colorStr);
}

