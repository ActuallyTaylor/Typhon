export const FightOption = {
    Fight: 'fight',
    Reload: 'reload',
    Attack: 'attack',
    Pass: 'pass'
  };

export class FightController {
    
    constructor(monsterOne, monsterTwo) {
        this.self = monsterOne
        this.opponent = monsterTwo
        this.personalFightOption = FightOption.Pass
        this.opponentFightOption = FightOption.Pass
        
        this.opponentEnergyLevel = 1 + this.opponent.ability.energyStartIncrease
        this.personalEnergyLevel = 1 + this.self.ability.energyStartIncrease
    }

    selectFightOption(option) {
        this.personalFightOption = option
        this.aiSelectFightOption()
    }

    // Uses a BASIC AF ai to select fight options
    aiSelectFightOption() { 
        blockCounter = 0
        attackCounter = 0
        reloadCounter = 0

        // MARK: Increasing Reload Counter
        if (this.opponentEnergyLevel <= 0) {
            reloadCounter += 10
        } else if (this.opponentEnergyLevel <= 1) {
            reloadCount += 5
        } else if (this.opponentEnergyLevel <= 5) {
            reloadCounter + 1
        }

        if (this.personalEnergyLevel > 2) {
            reloadCounter -= 3
        }

        // MARK: Increasing Attack Counter
        if (this.opponentEnergyLevel <= 0) {
            attackCounter -= 10
        }

        // Check to see if the main characters energy level is low, if so we want to attack because they will reload 
        if(this.personalEnergyLevel <= 0) {
            attackCounter += 10
        } else if (this.personalEnergyLevel <= 2) {
            attackCounter += 5
        } else {
            attackCounter += 3
        }

        // MARK: Increasing Block Counter
        if(this.opponent.health < 25) {
            blockCounter += 8
        } else {
            this.blockCounter += 2
        }

        if (attackCounter >= blockCounter && attackCounter >= reloadCounter) {
            this.opponentFightOption = FightOption.Attack
        } else if (blockCounter > attackCounter && blockCounter > reloadCounter) {
            this.opponentFightOption = FightOption.Block
        } else if (reloadCounter > attackCounter && reloadCounter > blockCounter) {
            this.opponentFightOption = FightOption.Reload
        }
    }

    advanceFight() {
        if(this.personalFightOption == FightOption.Attack && (this.opponentFightOption != FightOption.Block || this.self.ability.hasPiercing())) {
            console.log("Attack Opponent")
            if (this.personalEnergyLevel >= 1) {
                this.opponent.health -= this.opponent.attack
            }
        } else if(this.personalFightOption == FightOption.Reload) {
            this.personalEnergyLevel += this.self.ability.energyIncreaseChange
        }
        if (this.opponentFightOption == FightOption.Attack && (this.personalEnergyLevel != FightOption.Block || this.opponent.ability.hasPiercing())) {
            console.log("Opponent Attacks")
            if (this.opponentEnergyLevel >= 1) {
                this.opponent.health -= this.self.attack
            }
        } else if(this.opponentFightOption == FightOption.Reload) {
            this.opponentEnergyLevel += this.opponent.ability.energyIncreaseChange
        }
    
        this.opponentEnergyLevel -= 1
        this.personalEnergyLevel -= 1
    
        this.clampEnergy()

        console.log(this.self.health, this.opponent.health)
    }

    clampEnergy() {
        if (this.opponentEnergyLevel < 0) {
            this.opponentEnergyLevel = 0
        }
        
        if (this.personalEnergyLevel < 0) {
            this.personalEnergyLevel = 0
        }
    }
}
