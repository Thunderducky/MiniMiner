type Vector2d = {x:number, y:number};
type MovementState = {
    position:Vector2d;
    velocity:Vector2d;
    rotation: number;
    rotationVelocity: number;
}

type Ship = MovementState & {
    entityId: number;
    fuel: number;
    fuelPerMinute: number;
    maxFuel: number;
    oreStore: number;
    maxOreStore: number;
    miningLaserOrePerSecond: number;
    miningLaserRange: number;
}

type Station = MovementState & {
    entityId: number;
    orePrice: number;
    fuelPrice: number;
}

type Asteroid = MovementState & {
    entityId: number;
    oreCount: number;
}

// This represent the player
type Agent = {
    entityId: number;
    money: number;
    ship?:Ship;
}

const Factory = {
    _id:0,
    _generateId: function():number{
        return this._id++;
    },
    _makeDefaultMovement: function(x:number,y:number):MovementState {
        return {
            position: {x,y},
            velocity: {x: 0, y: 0},
            rotation: 0,
            rotationVelocity: 0
        };
    },
    makeAsteroid: function(x:number, y:number, oreCount: number): Asteroid {
        return {
            entityId: this._generateId(),
            ...this._makeDefaultMovement(x,y),
            oreCount
        };
    },
    makeShip: function(x:number,y:number): Ship {
        return {
            entityId: this._generateId(),
            ...this._makeDefaultMovement(x,y),
            fuel: 20,
            fuelPerMinute: 4,
            maxFuel: 20,
            oreStore: 0,
            maxOreStore: 20,
            miningLaserOrePerSecond: 0.5,
            miningLaserRange: 10
        };
    },
    makeStation: function(x: number, y: number, orePrice:number, fuelPrice: number): Station {
        return {
            entityId: this._generateId(),
            ...this._makeDefaultMovement(x,y),
            orePrice,
            fuelPrice
        }
    },
    makeAgent: function(ship?:Ship):Agent{
        return {
            entityId: this._generateId(),
            money: 0,
            ship
        };
    },
}

// We are hardcoding a time limit for each round and then you can play again if you want, the goal is to get a low enough time
const playerShip = Factory.makeShip(0, 0);
const player = Factory.makeAgent(playerShip);

const station = Factory.makeStation(5, 5, 20, 5);

const asteroid1 = Factory.makeAsteroid(-3, -2, 10);
asteroid1.velocity.x = 0.2;
asteroid1.velocity.y = 0.2;

const asteroid2 = Factory.makeAsteroid(-3, 2, 10);
asteroid2.velocity.x = 0.1;
asteroid2.velocity.y = -0.15;

const movables = [playerShip, asteroid1, asteroid2];

function processVelocity(mover:MovementState, seconds:number):MovementState {
    return {
        ...mover,
        position: {
            x: mover.position.x + mover.velocity.x * seconds,
            y: mover.position.y + mover.velocity.y * seconds,
        }
    }
}
const moved = movables.map(mover => processVelocity(mover, 1));

// Really should add some validation in here to make sure that things are in range
function mineAsteroid(ship:Ship, asteroid:Asteroid, seconds: number): [Ship, Asteroid] {
    const maxYield = ship.miningLaserOrePerSecond * seconds;
    const miningTotal = Math.min(ship.maxOreStore - ship.oreStore, maxYield, asteroid.oreCount);
    return [
        { 
            ...ship,
            oreStore: ship.oreStore + miningTotal
        },
        { 
            ...asteroid,
            oreCount: asteroid.oreCount - miningTotal
        }
    ]
}
const [s2playerShip, s2Asteroid1] = mineAsteroid(playerShip, asteroid1, 4);
const [s3playerShip, s3Asteroid1] = mineAsteroid(s2playerShip, s2Asteroid1, 20);

console.log("BEFORE");
console.log(playerShip, asteroid1);
console.log("AFTER");
console.log(s2playerShip, s2Asteroid1);
console.log("AFTER AFTER");
console.log(s3playerShip, s3Asteroid1);


