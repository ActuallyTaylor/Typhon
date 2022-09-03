export class Ability {

    constructor() {
        this.defenseChange = 0
        this.attackChange = 0
        this.speedChange = 0

        this.energyStartIncrease = 0
        this.energyIncreaseChange = 0

        this.piercingChance = 0.05
    }

    hasPiercing() {
        return Math.random() < this.piercingChance
    }
}

export class StrixAbiltiy extends Ability {
    constructor() {
        super()
        this.speedChange += 1
    }
}

export class PythonAbiltiy extends Ability {
    constructor() {
        super()
        this.attackChange += 1
    }
}

export class WolfAbiltiy extends Ability {
    constructor() {
        super()
        this.defenseChange += 1
    }
}