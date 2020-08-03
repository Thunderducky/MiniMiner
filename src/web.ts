// Let's start by importing PIXI and making an application and just drawing some text
import * as PIXI from 'pixi.js'
window.onload = function () {
    let goForward = false;
    let goBackward = false;
    let rotatingLeft = false;
    let rotatingRight = false;
    const velocity = {x: 0, y: 0}
    let isBraking = false;
    const app = new PIXI.Application({ backgroundColor: 0x002233 });
    app.renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(app.view);

    const basicText = new PIXI.Text('asteroid:\n ', { fontFamily: "monospace", fill: "#ddeeff" });
    basicText.x = 10;
    basicText.y = 10;

    // Two seperate ones, rather than others
    const backgroundContainer = new PIXI.Container();
    const foregroundContainer = new PIXI.Container();
    app.stage.addChild(backgroundContainer);
    app.stage.addChild(foregroundContainer);
    // Let's use the loader and get all the assets we need
    app.loader.baseUrl = "assets";
    app.loader
        .add("asteroid", "images/Asteroid1.png")
        .add("background", "images/bg5.jpg", {})
        .add("playerShip", "images/orangeship.png")
        .add("station", "images/SS1.png");

    app.loader.load(function () {
        const { resources } = app.loader;

        const background = new PIXI.Sprite(resources["background"].texture);
        console.log(background);
        background.anchor.x = 0.5;
        background.anchor.y = 0.5;
        background.position.x = app.view.width / 2;
        background.position.y = app.view.height / 2;
        backgroundContainer.addChild(background);
        (window as any).background = background;

        const station = new PIXI.Sprite(resources["station"].texture);
        // the ship has now been scaled appropriately
        station.scale.set(0.4, 0.4);
        station.anchor.x = 0.5;
        station.anchor.y = 0.5;
        station.position.x = 1000;
        station.position.y = 800;
        foregroundContainer.addChild(station);
        (window as any).station = station;

        const asteroids = [];
        function makeAsteroid(x: number, y: number) {
            const asteroid = new PIXI.Sprite(resources["asteroid"].texture);
            asteroid.anchor.x = 0.5;
            asteroid.anchor.y = 0.5;
            asteroid.position.x = x;
            asteroid.position.y = y;
            asteroids.push(asteroid);
            foregroundContainer.addChild(asteroid);
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
        foregroundContainer.addChild(ship);
        (window as any).ship = ship;

        
        // let's have the station slowly rotate
        foregroundContainer.x = foregroundContainer.width / 2;
        foregroundContainer.pivot.x = foregroundContainer.width / 2;
        foregroundContainer.y = foregroundContainer.height / 2;
        foregroundContainer.pivot.y = foregroundContainer.height / 2;
        animate();
        
        function animate() {
            requestAnimationFrame(animate);
            const shipRotation = 0.05;
            if(rotatingLeft){
                ship.rotation -= shipRotation;
            } else if(rotatingRight){
                ship.rotation += shipRotation;
            }
            const shipSpeed = 0.2;
            if(goForward){
                velocity.x += Math.cos(ship.rotation - Math.PI/2) * shipSpeed
                velocity.y += Math.sin(ship.rotation - Math.PI/2) * shipSpeed
            } else if(goBackward){
                velocity.x -= Math.cos(ship.rotation - Math.PI/2) * shipSpeed * 0.2;
                velocity.y -= Math.sin(ship.rotation - Math.PI/2) * shipSpeed * 0.2;
            }
            if(isBraking){
                velocity.x *= 0.8;
                if(velocity.x > -0.5 && velocity.x < 0.5){
                    velocity.x = 0;
                }
                velocity.y *= 0.8;
                if(velocity.y > -0.5 && velocity.y < 0.5){
                    velocity.y = 0;
                }
            }
            ship.x += velocity.x;
            ship.y += velocity.y;
            station.rotation += 0.0005;
            //foregroundContainer.rotation += 0.005;
            // render the container
            foregroundContainer.position.set(app.screen.width/2, app.screen.height/2);
            //backgroundContainer.pivot = ship.position;
            foregroundContainer.pivot = ship.position;
            backgroundContainer.position.set(-ship.position.x/100, -ship.position.y/100);
            app.renderer.render(app.stage);
        }
        // console.log(loader);
        // console.log(resources);
        // const asteroid = new PIXI.Sprite(resources.get("asteroid")
        
        window.document.addEventListener("keydown", function (event) {
            event.preventDefault();
            console.log(event.key);
            if (event.key === "ArrowLeft") {
                rotatingLeft = true;
            }
            else if (event.key === "ArrowRight") {
                rotatingRight = true;
            }
            else if (event.key === "ArrowUp") {
                goForward = true;
            }
            else if (event.key === "ArrowDown") {
                goBackward = true;
            }
            else if (event.key === " ") {
                isBraking = true;
            }
        })
        window.document.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.key === "ArrowLeft") {
                rotatingLeft = false;
            }
            else if (event.key === "ArrowRight") {
                rotatingRight = false;
            }
            else if (event.key === "ArrowUp") {
                goForward = false;
            }
            else if (event.key === "ArrowDown") {
                goBackward = false;
            }
            else if (event.key === " ") {
                isBraking = false;
            }
        })
    });


    // Let's listen for keypress events
    // wasd moves the ship
    // arrow keys move the camera

}
// Todo, handle scaling
// Todo, make sure everything renders properly
// Listen for events
// More gross UI stuff