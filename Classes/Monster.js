import { Ability, HarpyAbility } from "./Ability.js"

export class Monster {
    // Holds info about the character, their upgrades, etc.
    constructor() {
        this.sprite = null;
        this.type = null;

        // MARK: Attack
        this.attack = 10 ;

        // MARK: Defense
        this.defense = 0;

        // MARK: Speed
        this.speed = 0;

        // MARK: Health
        this.health = 100;

        // MARK: Level
        this.lvl = 0;

        // MARK: Abilities
        this.ability = new HarpyAbility()
    }

    draw() {
        // this.sprite.draw()
    }

    checkLevelUp() {
        // just got a stat buff, check if you need to evolve
        if (this.lvl == 0) {
            // if (this.attack >= 5 || )
        }
    }

    getAttackDamage() {
        return 10 + 2 * this.attack;
    }

    getDefenseAmount() {
        return 5 + 2 * this.defense;
    }
}



export class MonsterType {
    // Class structure for all the different monster types
}
