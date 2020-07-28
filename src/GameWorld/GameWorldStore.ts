import { DeepReadonly } from 'ts-essentials';

import Asteroid from './GameEntities/Asteroid'
import Ship from './GameEntities/Ship'

const SIMULATE = "physics.simulate.step"

class GameWorldData {
    asteroids: Asteroid[];
    ship: Ship;
    constructor() {
        this.asteroids = [];
        this.asteroids.push(new Asteroid("A", 2, 4, 10));
        this.asteroids.push(new Asteroid("B", -1, 4, 20));
        this.asteroids.push(new Asteroid("C", 1, 1, 4));
        this.ship = new Ship("playerShip", 2, 2, 2, 2)
    }
}

export class GameWorldStore {
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

    dispatch(action: { type: string, data?: any }) {
        const message = action.type;
        // handle things in a reducer here, and allow us to build pipes of reducers, these can affect certain parts of the gameworld, so we can more precisely control
        // mutations
        // they can also access any other part of the world that they need in a readonly fashion if necessary
        console.log("This is where we submit actions that happen to the game world", message);
        if (message === SIMULATE) {
            // we run the physics simulation, which will be the following
            this._worldData.asteroids.forEach(
                (asteroid) => {
                    asteroid.x += asteroid.dx;
                    asteroid.y += asteroid.dy;
                });
            const { ship } = this._worldData;
            ship.x += ship.dx;
            ship.y += ship.dy;
        }
    }

}

