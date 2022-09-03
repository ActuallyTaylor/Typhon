export class Ability {

    constructor() {
        this.defenseChange = 0
        this.attackChange = 0
        this.speedChange = 0

        this.energyStartIncrease = 0
        this.energyIncreaseChange = 0

        this.piercingChance = 0.25
    }

    hasPiercing() {
        return Math.random() < this.piercingChance
    }

    effectMonster(monster) {
        monster.attack += this.attackChange
        monster.speed += this.speedChange
        monster.defense += this.defenseChange
    }

    removeFromMonster(monster) {
        monster.attack -= this.attackChange
        monster.speed -= this.speedChange
        monster.defense -= this.defenseChange
    }
}

export class HarpyAbility extends Ability {
    constructor() {
        super()
        this.energyStartIncrease = 5
    }
}