import { Monster } from './Classes/Monster.js';
import { Sprite } from './Classes/Sprite.js'

let myMonster = new Monster();

function preload() {
    myMonster.sprite = new Sprite("../assets/character.png", 100, 100, 100, 100);

}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(112, 112, 112);
    myMonster.draw()
}

function keyPressed() {
    if (key == 'w') {
        
    }
    if (key == 'a') {

    }
    if (key == 's') {

    }
    if (key == 'd') {

    }
}

function generateMap() {

}

function drawMap() {
    
}

window.setup = setup
window.draw = draw
window.preload = preload
window.keyPressed = keyPressed
window.keyReleased = keyReleased