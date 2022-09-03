import { Monster } from './Classes/Monster.js';
import { Sprite } from './Classes/Sprite.js'
import { Map } from './Classes/Map.js'
import { FightController, FightOption } from './Classes/FightController.js'
import { Room } from './Classes/Room.js'

let bg

let myMonster = new Monster(0,0,0, 100);
let myEnemy = new Monster(0,0,0, 100);
let rooms = [
    new Room("Welcome to the room of the python... The snake is a fierce and strong. Be careful as you fight it"), 
    new Room("Welcome to the room of the owl, the owl is smart and cunning. Be sure to watch your opponent."), 
    new Room("Welcome to the room of the dog, the dog, the dogs defense is high, be sure to attack smartly.")
]
let playerMonsters = [
    new Monster(3, 2, 1, 100),
    new Monster(2, 3, 1, 100),
    new Monster(2, 1, 3, 100),
]

let logo

let rewardsSprites = [ ]

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

let characterHeight = 320
let characterWidth = 320

let myEnemyPosX
let myEnemyPosY
let myMonsterPosX
let myMonsterPosY
let fightSprites
let fightSpritesHighlighted
let energySprite

let introKeyOne = false
let introKeyTwo = false
let introKeyThree = false
let selectedMonster = 0

let didEnd = false;

let selectedType = FightOption.Pass;

let scene = 0; // 0: Main Menu, 1: Between Battles, 2: In Battle
let currentRoom = 0;

function preload() {
    primaryWindowWidth = windowWidth
    primaryWindowHeight = windowHeight
    myEnemyPosX = windowWidth - characterWidth - 100
    myEnemyPosY = windowHeight / 2 - characterHeight

    bg = loadImage('assets/background.png');

    myMonsterPosX =  100
    myMonsterPosY = windowHeight / 2 - characterHeight
    
    energySprite = new Sprite("./assets/Energy_Icon.png", 0, 0, 100, 100);
    
    fightSprites = [new Sprite("./assets/AttackButton.png", 0, 0, 100, 100), new Sprite("./assets/ReloadButton.png", 0, 0, 100, 100), new Sprite("./assets/DefendButton.png", 0, 0, 100, 100)]
    rewardsSprites = [
        new Sprite("./assets/Speedicon.png", 0, 0, 100, 100), 
        new Sprite("./assets/Attackicon.png", 0, 0, 100, 100), 
        new Sprite("./assets/Defendicon.png", 0, 0, 100, 100)
    ]
    fightSpritesHighlighted = [new Sprite("./assets/Highlight_Attack.png", 0, 0, 100, 100), new Sprite("./assets/Highlight_Reload.png", 0, 0, 100, 100), new Sprite("./assets/Highlight_Defend.png", 0, 0, 100, 100)]
    
    logo = new Sprite("./assets/Typhon Logo.png", 0, 0, 1103, 231)

    rooms[0].enemy = new Monster(2,3,1,50)
    rooms[0].enemy.sprite = new Sprite("./assets/Snake.png", myEnemyPosX, myEnemyPosY, characterHeight, characterWidth, true)
    rooms[1].enemy = new Monster(3,2,1,50)
    rooms[1].enemy.sprite = new Sprite("./assets/Owl.png", myEnemyPosX, myEnemyPosY, characterHeight, characterWidth, true)
    rooms[2].enemy = new Monster(2,1,3,50)
    rooms[2].enemy.sprite = new Sprite("./assets/Dog.png", myEnemyPosX, myEnemyPosY, characterHeight, characterWidth, true)

    playerMonsters[0].sprite = new Sprite("./assets/Snake.png", myMonsterPosX, myMonsterPosY, characterHeight, characterWidth, false)
    playerMonsters[1].sprite = new Sprite("./assets/Owl.png", myMonsterPosX, myMonsterPosY, characterHeight, characterWidth, false)
    playerMonsters[2].sprite = new Sprite("./assets/Dog.png", myMonsterPosX, myMonsterPosY, characterHeight, characterWidth, false)
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noSmooth()
    myMap.generateMap(4, 4, 0, 0);
    startIntro()
}

function startIntro() {
    textStream.push("You awake in dark room... What do you do?")
    textStream.push("1: Get up and look around")
    textStream.push("2: Go back to bed")
    textStream.push("")
    textStream.push("")
    textStream.push("")
}

function finishIntro() {
    introKeyTwo = true
    textStream.push("")
    textStream.push("You hear \“Take care of this creature to show your worth to the gods\” in your head")
    textStream.push("")

    myMonster = playerMonsters[selectedMonster]

    textStream.push("You see a door in front of you open, you hear in your head \"Please enter\"")
    textStream.push("")
    textStream.push("Do you enter? 1: Yes")
    textStream.push("")
    textStream.push("")
}

function keyPressed() {
    if (scene == 0) {
        if (key == "1") {
            if(!introKeyOne) {
                textStream.push("You find a tablet made of stone sitting in the corner of the cave...")
                textStream.push("")
                textStream.push("The tablet reads: \"You are alone and can only have one strength: Wisdom, Strength, or Constitution.\"")
                textStream.push("")
                textStream.push("What do you choose 1: Wisdom, 2: Strength, 3: Constitution")
                textStream.push("")
                textStream.push("")
                introKeyOne = true
            } else if (!introKeyTwo) {
                selectedMonster = 0
                textStream.push("You have selected Wisdom! A small mostly featherless owl appears in front of you.")
                finishIntro()
            } else if (!introKeyThree) {
                textStream = []
                scene = 2
                startFight(rooms[0])
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
                textStream.push("You have selected Strength! A small snake appears in front of you.")
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
        if (canAttack && ! didAttack) {
            if (key == '1') {
                currentFightController.selectFightOption(FightOption.Attack)
                selectedType = FightOption.Attack;
                didAttack = true;
            }
            if (key == '2') {
                currentFightController.selectFightOption(FightOption.Reload)
                selectedType = FightOption.Reload;
                didAttack = true;
            }
            if (key == '3') {
                currentFightController.selectFightOption(FightOption.Block)
                selectedType = FightOption.Block;
                didAttack = true;
            }
        }    
    } else if (scene == 1) {
        if(key == "1") {
            getRewards(drawingRewards[0])
            console.log("Selected reward number 1")
            currentRoom += 1
            startFight(rooms[currentRoom])
            scene = 2
        } else if (key == "2") {
            getRewards(drawingRewards[1])
            console.log("Selected reward number 2")
            currentRoom += 1
            startFight(rooms[currentRoom])
            scene = 2
        }
    }
}

function draw() {
    background(bg);
    if (scene == 0) {
        logo.y = 100
        logo.x = primaryWindowWidth / 2 - logo.width / 2
        logo.draw()
        displayStream();
    } else if (scene == 1) {
        if (drawingRewards != null) {
            drawRewards();
        }
    } else if (scene == 2) {
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
        let useList = fightSprites;
        if ((i == 0 && selectedType == FightOption.Attack) || (i == 1 && selectedType == FightOption.Reload) || (i == 2 && selectedType == FightOption.Defend)){
            useList = fightSpritesHighlighted;
        }
        useList[i].x = startFightOptionsX + (buttonWidth * i)
        useList[i].y = primaryWindowHeight - 120
        useList[i].width = buttonWidth
        useList[i].height = buttonHeight

        useList[i].draw()
        startFightOptionsX += spacer
    }
}

function displayCharacters() {
    myEnemy.draw()
    myMonster.draw()

    let startx = 100 + characterWidth - 30;
    let startx2 = primaryWindowWidth - 100 - characterWidth;
    let starty = 300;
    let s = 30;

    energySprite.x = startx;
    energySprite.width = s;
    energySprite.height = s;
    
    for (let i = 0; i < myMonster.energy; i++) {
        energySprite.y = starty - s * i;
        energySprite.draw();
    }
    energySprite.x = startx2;
    for (let i = 0; i < myEnemy.energy; i++) {
        energySprite.y = starty - s * i;
        energySprite.draw();
    }

    startx = 100;
    startx2 = primaryWindowWidth - 100 - characterWidth;
    starty = 350;
    s = 30;
    let w = characterWidth;

    noStroke();
    fill(0,200,0);
    rect(startx, starty, w*(myMonster.health/myMonster.maxhp), s);
    console.log(w*(myMonster.health/myMonster.maxhp));
    stroke(0);
    noFill();
    strokeWeight(5);
    rect(startx-2, starty-2, w+4, s+4, s/4);
    strokeWeight(0);

    noStroke();
    fill(0,200,0);
    rect(startx2, starty, w*(myEnemy.health/myEnemy.maxhp), s);
    console.log(w*(myEnemy.health/myEnemy.maxhp));
    stroke(0);
    noFill();
    strokeWeight(5);
    rect(startx2-2, starty-2, w+4, s+4, s/4);
    strokeWeight(0);
}

function displayStream() {
    let h = 230;
    let w = primaryWindowWidth;

    let startx = 0;
    let starty = primaryWindowHeight - h - 150;

    let messageHeight = 20;
    let rev = textStream.slice().reverse();
    noStroke()
    fill(50, 50, 50, 190);
    rect(startx, starty, w, h);
    stroke(0);
    fill(0);
    textSize(messageHeight-2);
    for (let i = 0; i < Math.min(rev.length, h / messageHeight - 2); i++) {
        fill(256)
        text(rev[i], startx, starty + h - (i+1) * messageHeight)
        fill(0)
    }
}

function drawRewards() {
    fill(255)
    text("Choose a reward (1 or 2):", 200, 600);
    let spacer = 100
    let buttonWidth = (primaryWindowWidth / 4) - 45
    let startFightOptionsX = ((primaryWindowWidth - (buttonWidth  * 3)) / 2) - spacer
    
    for(let i = 0; i < 2; i++) {
        if (drawingRewards[i] == 'ATK') {

            rewardsSprites[1].x = startFightOptionsX + (buttonWidth * i)
            rewardsSprites[1].y = primaryWindowHeight - 120
            rewardsSprites[1].draw()
        } else if (drawingRewards[i] == 'DEF') {
            rewardsSprites[2].x = startFightOptionsX + (buttonWidth * i)
            rewardsSprites[2].y = primaryWindowHeight - 120
            rewardsSprites[2].draw()
        } else if (drawingRewards[i] == 'SPD') {
            rewardsSprites[0].x = startFightOptionsX + (buttonWidth * i)
            rewardsSprites[0].y = primaryWindowHeight - 120
            rewardsSprites[0].draw()
        }
            
        //startFightOptionsX += spacer
    }
}

// function drawMap() {
//     let startx = 10;
//     let starty = 10;
//     let s = 20;
//     let rooms = myMap.rooms;
//     fill(0,255,0);
//     rect(startx, starty, rooms.length * s, rooms[0].length * s);
//     fill(255,0,0);
//     for (let c = 0; c < rooms.length; c++) {
//         for (let r = 0; r < rooms[c].length; r++) {
//             if (rooms[c][r] == null) {
//                 continue;
//             }
//             rect(startx + s * c + 3, starty + s * r + 3, s - 6, s - 6);
//             if (rooms[c][r].N) {
//                 rect(startx + s * c + s / 2 - 3, starty + s * r, 6, 3);
//             }
//             if (rooms[c][r].E) {
//                 rect(startx + s * (c+1) - 3, starty + s * r + r / 2 - 3, 3, 6);
//             }
//             if (rooms[c][r].S) {
//                 rect(startx + s * c + s / 2 - 3, starty + s * (r+1) - 3, 6, 3);
//             }
//             if (rooms[c][r].W) {
//                 rect(startx + s * c, starty + s * r + r / 2 - 3, 3, 6);
//             }
//         }
//     }
// }

function drawAttack() {
    let x = primaryWindowWidth/2 - 300;
    let y = 60;
    let s = 40;
    let w = 600;
    scale = getResponseTime();

    if (attackTimer > scale * 0.75) {
        canAttack = true;
        noStroke();
        fill(0,200,0);
        rect(x, y, w*(1-attackTimer/scale), s, s/4, 0, 0, s/4);
        stroke(0);
    }
    else {
        noStroke();
        fill(0,200,0);
        rect(x, y, w*.25, s, s/4, 0, 0, s/4);
        fill(100,0,0);
        rect(x+w*.25, y, w*(.75-attackTimer/scale), s);
        stroke(0);
    }
    
    if (attackTimer >= scale) {
        if (! didAttack) {
            currentFightController.selectFightOption(FightOption.Pass);
        }
        let newMessages = currentFightController.advanceFight();
        if (newMessages == "selfDeath") {
            didEnd = true;
            textStream.push("Your monster died, the gods look down against you.")
        } else if(newMessages == "opponentDeath") {
            didEnd = true;
            textStream.push("You killed your opponent! Congratulations.")
            endFight()
        } else {
            for (let i = 0; i < newMessages.length; i++) {
                textStream.push(newMessages[i]);
            }
            selectedType = FightOption.Pass;
            attackTimer = 0;
            canAttack = false;
            didAttack = false;    
        }

    }
    noFill();
    strokeWeight(5);
    rect(x-2, y-2, w+4, s+4, s/4);
    strokeWeight(0);
}


// MARK: Logic Functions
function startFight(room) {
    myMonster.health = myMonster.maxhp;
    textStream = []
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
        if (ignoreRandom == 1 && ! showList.includes('DEF')) {
            showList.push('DEF')
        }
        if (ignoreRandom == 2 && ! showList.includes('SPD')) {
            showList.push('SPD')
        }
        if (i == 1 && showList.length != 2) {
            i --;
        }
    }

    drawingRewards = showList
    attackTimer = 0
    scene = 1
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getResponseTime() {
    return Math.sqrt(Math.max(myMonster.speedFunc() - 2* myEnemy.speedFunc()  + 40, 1)) * 30;
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
