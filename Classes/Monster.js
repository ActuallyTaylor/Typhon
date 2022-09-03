import { Ability } from "./Ability.js"

export class Monster {
    // Holds info about the character, their upgrades, etc.
    constructor(attack, defense, speed, health) {
        this.sprite = null;
        this.type = null;

        // MARK: Attack
        this.attack = 0;

        // MARK: Defense
        this.defense = 0;

        // MARK: Speed
        this.speed = 0;

        // MARK: Health
        this.health = 100;

        // MARK: Level
        this.lvl = 0;

        // MARK: Energy
        this.energy = 0

        // MARK: Abilities
        this.ability = new Ability()
    }

    draw() {
        this.sprite.draw()
    }

    checkLevelUp() {
        // just got a stat buff, check if you need to evolve
        if (this.lvl == 0) {
            // if (this.attack >= 5 || )
        }
    }

    attackFunc() {
        return 10 + Math.round((2+Math.random()) * (this.attack + this.ability.attackChange));
    }

    defenseFunc() {
        return 10 + 2 * (this.defense + this.ability.defenseChange);
    }

    speedFunc() {
        return (this.speed + this.ability.speedChange)
    }
}



export class MonsterType {
    // Class structure for all the different monster types
}
