import { Monster } from './Classes/Monster.js';
import { Sprite } from './Classes/Sprite.js'
import { Map } from './Classes/Map.js'
import { FightController, FightOption } from './Classes/FightController.js'
import { Room } from './Classes/Room.js'

let myMonster = new Monster();
let myEnemy = new Monster();

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

let primaryWindowWidth
let primaryWindowHeight

let characterHeight = 400
let characterWidth = 400

let myEnemyPosX
let myEnemyPosY
let myMonsterPosX
let myMonsterPosY
let fightSprites

let scene = 0; // 0: Main Menu, 1: Between Battles, 2: In Battle

function preload() {
    primaryWindowWidth = windowWidth
    primaryWindowHeight = windowHeight
    myEnemyPosX = windowWidth - characterWidth - 100
    myEnemyPosY = windowHeight / 2 - characterHeight

    myMonsterPosX =  100
    myMonsterPosY = windowHeight / 2 - characterHeight

    myMonster.sprite = new Sprite("./assets/character.png", myMonsterPosX, myMonsterPosY, characterHeight, characterWidth, false)
    myEnemy.sprite = new Sprite("./assets/character.png", myEnemyPosX, myEnemyPosY, characterHeight, characterWidth, true)
    
    fightSprites = [new Sprite("./assets/AttackButton.png", 0, 0, 100, 100), new Sprite("./assets/ReloadButton.png", 0, 0, 100, 100), new Sprite("./assets/DefendButton.png", 0, 0, 100, 100)]
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    myMap.generateMap(4, 4, 0, 0);
    startIntro()
}

let introKeyOne = false
let introKeyTwo = false
let selectedMonster = 0

function startIntro() {
    textStream.push("You awake in dark room... What do you do?")
    textStream.push("1: Get up and look around\n2: Go back to bed")
}

function finishIntro() {
    textStream.push("You hear \“Take care of this creature to show your worth to the gods\” in your head")
}

function keyPressed() {
    if (scene == 0) {
        if (key == "1") {
            if(!introKeyOne) {
                textStream.push("You find a tablet made of stone sitting in the corner of the cave...")
                textStream.push("The tablet reads\n\"You are alone and can only have one strength: Wisdom, Strength, or Constitution.\"")
                textStream.push("What do you choose 1: Wisdom, 2: Strength, 3: Constitution")
                introKeyOne = true
            } else if (!introKeyTwo) {
                selectedMonster = 0
                textStream.push("You have selected Wisdom! A small mostly featherless owl appears in front of you.")
                finishIntro()
            }
        }
        if (key == "2") {
            if(!introKeyOne) {
                textStream.push("You go back to bed.")

                // Reset Page
                setTimeout(function () {
                    location.reload()
                }, 2000);            
            } else if (!introKeyTwo) {
                selectedMonster = 1
                textStream.push("You have selected Wisdom! A small appears in front of you.")
                finishIntro()
            }
        }
        if (key == "3") {
            if (!introKeyTwo) {
                selectedMonster = 2
                textStream.push("You have selected Constitution! A small dog appears in front of you.")
                finishIntro()
            }
        }
    } else if (scene == 2) {
        if (key == 'r') {
            endFight();
        }
        if (canAttack && ! didAttack) {
            if (key == '1') {
                currentFightController.selectFightOption(FightOption.Attack)
                didAttack = true;
            }
            if (key == '2') {
                currentFightController.selectFightOption(FightOption.Reload)
                didAttack = true;
            }
            if (key == '3') {
                currentFightController.selectFightOption(FightOption.Block)
                didAttack = true;
            }
        }    
    }
}

function draw() {
    background(112, 112, 112);
    if (scene == 0) {
        displayStream();
    } else if (scene == 2) {
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
        displayCharacters()
        drawFightOptions();
    }
}

function drawFightOptions() {
    let spacer = 100
    let buttonWidth = (primaryWindowWidth / 4) - 45
    let buttonHeight = 60
    let startFightOptionsX = ((primaryWindowWidth - (buttonWidth  * 3)) / 2) - spacer
    
    for(let i = 0; i < 3; i++) {
        fightSprites[i].x = startFightOptionsX + (buttonWidth * i)
        fightSprites[i].y = primaryWindowHeight - 120
        fightSprites[i].width = buttonWidth
        fightSprites[i].height = buttonHeight

        fightSprites[i].draw()
        startFightOptionsX += spacer
    }
}

function displayCharacters() {
    myEnemy.draw()
    myMonster.draw()
}

function displayStream() {
    let h = 230;
    let w = primaryWindowWidth;

    let startx = 0;
    let starty = primaryWindowHeight - h - 150;

    let messageHeight = 20;
    let rev = textStream.slice().reverse();
    fill(150);
    rect(startx, starty, w, h);
    fill(0);
    textSize(messageHeight-2);
    for (let i = 0; i < Math.min(rev.length, h / messageHeight - 2); i++) {
        text(rev[i], startx, starty + h - (i+1) * messageHeight)
    }
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

function drawAttack() {
    let x = 100;
    let y = 100;
    let s = 30;
    let w = 100;
    scale = getResponseTime();

    if (attackTimer > scale * 0.75) {
        canAttack = true;
        noStroke();
        fill(0,200,0);
        rect(x, y, s, w*(attackTimer/scale-.75));
        stroke(0);
    }
    else {
        noStroke();
        fill(0,200,0);
        rect(x, y, s, w*.25);
        fill(100,0,0);
        rect(x+w*.25, y, s, w*(attackTimer/scale-.25));
        stroke(0);
    }
    
    if (attackTimer >= scale) {
        if (! didAttack) {
            currentFightController.selectFightOption(FightOption.Pass);
        }
        let newMessages = currentFightController.advanceFight();
        for (let i = 0; i < newMessages.length; i++) {
            textStream.push(newMessages[i]);
        }
        attackTimer = 0;
        canAttack = false;
        didAttack = false;
    }
}


// MARK: Logic Functions
function generateMap() {

}

function startFight(room) {
    myEnemy = room.enemy
    currentFightController = new FightController(myMonster, myEnemy)
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
    return Math.sqrt(Math.max(myMonster.speedFunc() - 2* myEnemy.speedFunc()  + 40, 1)) * 50;
}

function keyReleased() {

}

function mouseReleased() {
    mouseDown = false;
}

window.setup = setup
window.draw = draw
window.preload = preload
window.keyPressed = keyPressed
window.keyReleased = keyReleased
window.mouseReleased = mouseReleased
