import chalk from 'chalk';
import { GameWorldStore } from './GameWorld/GameWorldStore'
import { Camera } from './Camera'


const SIMULATE = "physics.simulate.step"


const { asteroids, ship } = GameWorldStore.instance.worldData;
type AsteroidArray = typeof asteroids;

const displayAsteroids = (asteroids: AsteroidArray) => {
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

GameWorldStore.instance.dispatch({ type: SIMULATE });

// GameWorldStore.instance.dispatch(SIMULATE);
displayAsteroids(asteroids);

// Let's try and draw this
// Let's draw a grid so we can see what is happening over time, we'll divide it up into grid areas and then we'll be able to see

const camera = new Camera(-10, 10, 20, 20);

const visibleAsteroids = asteroids.filter(asteroid => camera.contains(asteroid));

const gridPositionedAsteroids = visibleAsteroids.map(asteroid => {
    return {
        ...asteroid,
        x: Math.floor(asteroid.x - camera.center.x),
        y: Math.floor(asteroid.y - camera.center.y)
    }
})

// Let's add PIXI to our frontend

const adjustedShip = { ...ship, x: ship.x - camera.center.x, y: ship.y - camera.center.y };

for (let y = camera.top; y >= camera.bottom; y--) {
    let colorStr = "";
    for (let x = camera.left; x <= camera.right; x++) {
        const matchingAsteroids = gridPositionedAsteroids.filter(a => a.x === x && a.y === y)
        let text = "";
        if (x === 0 && y === 0) {
            text = "+-"
        } else if (x === 0) {
            text = "| "
        } else if (y === 0) {
            text = "--"
        } else {
            text = "  "
        }
        if (adjustedShip.x === x && adjustedShip.y === y) {
            text = "<>"
        }

        colorStr += chalk.bgHex(matchingAsteroids.length ? "#77AA77" : "#000000")(text);
    }
    console.log(colorStr);
}

