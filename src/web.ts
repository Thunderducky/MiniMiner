// Let's start by importing PIXI and making an application and just drawing some text
import * as PIXI from 'pixi.js'
window.onload = function(){
    const app = new PIXI.Application({ backgroundColor: 0x002233 });
    app.renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(app.view);

    const basicText = new PIXI.Text('asteroid:\n ', { fontFamily: "monospace", fill: "#ddeeff"});
    basicText.x = 10;
    basicText.y = 10;

    // Let's use the loader and get all the assets we need
    app.loader.baseUrl = "assets";
    app.loader
        .add("asteroid", "images/Asteroid1.png")
        .add("background", "images/bg5.jpg", {})
        .add("playerShip", "images/orangeship.png")
        .add("station", "images/SS1.png");

    app.loader.load(function(){
        const { resources } = app.loader;

        const background = new PIXI.Sprite(resources["background"].texture);
        console.log(background);
        background.anchor.x = 0.5;
        background.anchor.y = 0.5;
        background.position.x = app.view.width/2;
        background.position.y = app.view.height/2;
        app.stage.addChild(background);
        (window as any).background = background;
        const asteroids = [];
        function makeAsteroid(x:number,y:number){
            const asteroid = new PIXI.Sprite(resources["asteroid"].texture);
            asteroid.anchor.x = 0.5;
            asteroid.anchor.y = 0.5;
            asteroid.position.x = x;
            asteroid.position.y = y;
            asteroids.push(asteroid);
            app.stage.addChild(asteroid);
        }
        makeAsteroid(100, 100);
        makeAsteroid(200, 300);
        makeAsteroid(300, 150);

        const ship = new PIXI.Sprite(resources["playerShip"].texture);
        // the ship has now been scaled appropriately
        ship.scale.set(0.2, 0.2);
        ship.anchor.x = 0.5;
        ship.anchor.y = 0.5;
        ship.position.x = 200;
        ship.position.y = 200;
        app.stage.addChild(ship);
        (window as any).ship = ship;

        const station = new PIXI.Sprite(resources["station"].texture);
        // the ship has now been scaled appropriately
        station.scale.set(0.4, 0.4);
        station.anchor.x = 0.5;
        station.anchor.y = 0.5;
        station.position.x = 1000;
        station.position.y = 800;
        app.stage.addChild(station);
        (window as any).station = station;

        // let's have the station slowly rotate

        animate();
        function animate() {
            requestAnimationFrame(animate);

            station.rotation += 0.0005;

            // render the container
            app.renderer.render(app.stage);
        }
        // console.log(loader);
        // console.log(resources);
        // const asteroid = new PIXI.Sprite(resources.get("asteroid")
    })

}
// Todo, handle scaling
// Todo, make sure everything renders properly
// Listen for events
// More gross UI stuff