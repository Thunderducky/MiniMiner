// Let's start by importing PIXI and making an application and just drawing some text
import * as PIXI from 'pixi.js'
const app = new PIXI.Application({ backgroundColor: 0x002233 });
document.body.appendChild(app.view);

// const basicText = new PIXI.Text('Basic text in pixi');
// basicText.x = 50;
// basicText.y = 100;

// app.stage.addChild(basicText);

// const style = new PIXI.TextStyle({
//     fontFamily: 'Arial',
//     fontSize: 36,
//     fontStyle: 'italic',
//     fontWeight: 'bold',
//     fill: ['#ffffff', '#00ff99'], // gradient
//     stroke: '#4a1850',
//     strokeThickness: 5,
//     dropShadow: true,
//     dropShadowColor: '#000000',
//     dropShadowBlur: 4,
//     dropShadowAngle: Math.PI / 6,
//     dropShadowDistance: 6,
//     wordWrap: true,
//     wordWrapWidth: 440,
// });

// const richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', style);
// richText.x = 50;
// richText.y = 250;

// app.stage.addChild(richText);
// // Draw an asteroid in aseprite
PIXI.Texture.fromURL('/assets/Asteroid1.png').then(texture => {
const asteroid = new PIXI.Sprite(texture);
asteroid.anchor.x = 0.5;
asteroid.anchor.y = 0.5;
asteroid.position.x = 100;
asteroid.position.y = 150;

const asteroid2 = new PIXI.Sprite(texture);
asteroid2.anchor.x = 0.5;
asteroid2.anchor.y = 0.5;
asteroid2.position.x = 200;
asteroid2.position.y = 170;

app.stage.addChild(asteroid);
app.stage.addChild(asteroid2);

animate();
function animate() {
    requestAnimationFrame(animate);

    // just for fun, let's rotate mr rabbit a little
    asteroid.rotation += 0.01;
    asteroid2.rotation += 0.02;

    // render the container
    app.renderer.render(app.stage);
}
});