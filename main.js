import { Monster } from './Classes/Monster.js';
import { Sprite } from './Classes/Sprite.js'
import { Map } from './Classes/Map.js'
import { FightController, FightOption } from './Classes/FightController.js'

let myMonster = new Monster();

let myMap = new Map();

let attackTimer = 0;
let inBattle = true;
let canAttack = false;
let didAttack = false;
let drawingRewards = null;

let countdownResults = 0; 

let mouseDown = false;
let currentFightController

let textStream = [];

let currentRoom

function preload() {

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    myMap.generateMap(4, 4, 0, 0);
}

function draw() {
    background(112, 112, 112);
    myMonster.draw()
    if (myMap.rooms.length != 0) {
        drawMap();
    }
    if (drawingRewards != null) {
        drawRewards();
    }
    click(0,0,100000,100000);
    if (inBattle) {
        attackTimer += 1
        drawAttack();
    }
    displayStream();
}

function mouseReleased() {
    mouseDown = false;
}

function keyPressed() {
    if (key == 'r') {
        endFight();
    }
    if (canAttack && ! didAttack) {
        if (key == '1') {
            testFightController.selectFightOption(FightOption.Attack)
        }
        if (key == '2') {
            testFightController.selectFightOption(FightOption.Reload)
        }
        if (key == '3') {
            testFightController.selectFightOption(FightOption.Block)
        }
        if (key == '1' || key == '2' || key == '3') {
            didAttack = true;
            testFightController.advanceFight();
        }
    }
    
}

function displayStream() {
    let startx = 200;
    let starty = 10;
    let h = 100;
    let w = 100;
    let messageHeight = 10;
    let rev = textStream.reverse();
    textSize(messageHeight-2);
    for (let i = 0; i < Math.min(rev.length, h / messageHeight); i++) {
        text(rev[i], startx, starty + h - (i+1) * messageHeight)
    }
}

function keyReleased() {

}

function generateMap() {

}

function drawMap() {
    let startx = 10;
    let starty = 10;
    let s = 20;
    let rooms = myMap.rooms;
    fill(0,255,0);
    rect(startx, starty, rooms.length * s, rooms[0].length * s);
    fill(255,0,0);
    for (let c = 0; c < rooms.length; c++) {
        for (let r = 0; r < rooms[c].length; r++) {
            if (rooms[c][r] == null) {
                continue;
            }
            rect(startx + s * c + 3, starty + s * r + 3, s - 6, s - 6);
            if (rooms[c][r].N) {
                rect(startx + s * c + s / 2 - 3, starty + s * r, 6, 3);
            }
            if (rooms[c][r].E) {
                rect(startx + s * (c+1) - 3, starty + s * r + r / 2 - 3, 3, 6);
            }
            if (rooms[c][r].S) {
                rect(startx + s * c + s / 2 - 3, starty + s * (r+1) - 3, 6, 3);
            }
            if (rooms[c][r].W) {
                rect(startx + s * c, starty + s * r + r / 2 - 3, 3, 6);
            }
        }
    }
}

function startFight(room) {
    currentRoom = room
    currentFightController = new FightController(myMonster, room.enemy)
    displayCharacters(myMap, room.enemy)
}

function displayCharacters() {
    
}

function endFight() {
    // get random reward
    // level up if needed
    let showList = []
    for (let i = 0; i < 2; i++){
        let ignoreRandom = getRandomInt(0,3)
        if (ignoreRandom == 0 && ! showList.includes('ATK')) {
            showList.push('ATK')
        }
        if (ignoreRandom == 1 && ! showList.includes('ATK')) {
            showList.push('DEF')
        }
        if (ignoreRandom == 2 && ! showList.includes('ATK')) {
            showList.push('SPD')
        }
    }
    drawingRewards = showList
}

function drawRewards() {
    let startx = 10;
    let starty = 100;
    let s = 20;
    let spacing = 10;
    if (drawingRewards[0] == 'ATK') {
        fill(255, 0, 0);
    }
    else if (drawingRewards[0] == 'DEF') {
        fill(0, 0, 255);
    }
    else if (drawingRewards[0] == 'SPD') {
        fill(0, 255, 0);
    }
    rect(startx, starty, s, s);
    if (click(startx, starty, s, s)) {
        getRewards(drawingRewards[0]);
    }
    if (drawingRewards[1] == 'ATK') {
        fill(255, 0, 0);
    }
    else if (drawingRewards[1] == 'DEF') {
        fill(0, 0, 255);
    }
    else if (drawingRewards[1] == 'SPD') {
        fill(0, 255, 0);
    }
    rect(startx + s + spacing, starty, s, s);
    if (click(startx + s + spacing, starty, s, s)) {
        getRewards(drawingRewards[1]);
    }
}

function getRewards(reward) {
    if (reward == 'ATK') {
        myMonster.attack ++;
    }
    else if (reward == 'DEF') {
        myMonster.defense ++;
    }
    else if (reward == 'SPD') {
        myMonster.speed ++;
    }
    myMonster.checkLevelUp();
    drawingRewards = null;
}

function click(x, y, w, h) {
    if (mouseDown) {
        return false;
    }
    console.log(mouseX, mouseY);
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
        mouseDown = true;
        return true;
    }
    return false;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getResponseTime() {
    return Math.sqrt(Math.max(myMonster.speed - 2*myEnemy.speed + 40, 1)) * 50;
}

function drawAttack() {
    let x = 100;
    let y = 100;
    let s = 30;
    scale = getResponseTime();
    if (attackTimer > scale * 0.25 && attackTimer < scale * 0.25 + 15) {
        fill(0,0,255);
        rect(x, y, s, s);
    }
    if (attackTimer > scale * 0.5 && attackTimer < scale * 0.5 + 15) {
        fill(0,0,255);
        rect(x, y, s, s);
    }
    if (attackTimer > scale * 0.75 && attackTimer < scale) {
        canAttack = true;
        fill(0,255,0);
        rect(x, y, s, s);
    }
    if (attackTimer >= scale) {
        attackTimer = 0;
        canAttack = false;
        didAttack = false;
    }
}

window.setup = setup
window.draw = draw
window.preload = preload
window.keyPressed = keyPressed
window.keyReleased = keyReleased
window.mouseReleased = mouseReleased
