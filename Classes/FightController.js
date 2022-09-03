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

        this.turnCount = 1;
        
        this.opponent.energy = 1 + this.opponent.ability.energyStartIncrease
        this.self.energy = 1 + this.self.ability.energyStartIncrease
    }

    selectFightOption(option) {
        this.personalFightOption = option
        this.aiSelectFightOption()
    }

    // Uses a BASIC AF ai to select fight options
    aiSelectFightOption() { 
        let blockCounter = 0
        let attackCounter = 0
        let reloadCounter = 0

        // MARK: Increasing Reload Counter
        if (this.opponent.energy <= 0) {
            reloadCounter += 10
        } else if (this.opponent.energy <= 1) {
            reloadCounter += 5
        } else if (this.opponent.energy <= 5) {
            reloadCounter + 1
        }

        if (this.self.energy > 2) {
            reloadCounter -= 3
        }

        // MARK: Increasing Attack Counter
        if (this.opponent.energy <= 0) {
            attackCounter -= 10
        }

        // Check to see if the main characters energy level is low, if so we want to attack because they will reload 
        if(this.self.energy <= 0) {
            attackCounter += 10
        } else if (this.self.energy <= 2) {
            attackCounter += 5
        } else {
            attackCounter += 3
        }

        // MARK: Increasing Block Counter
        if(this.opponent.health < 25) {
            blockCounter += 8
        } else {
            blockCounter += 2
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
        console.log(this.self, this.opponent);
        let resultStrings = [];
        resultStrings.push(`-- TURN ${this.turnCount} --`);
        if(this.personalFightOption == FightOption.Attack) {
            if (this.self.energy >= 1) {
                this.self.energy -= 1;
                resultStrings.push("Your monster attacked")
                let damage = 0;
                if (this.opponentFightOption == FightOption.Block) {
                    if (this.self.ability.hasPiercing()) {
                        resultStrings.push("Your enemy blocked, but the attack pierced");
                        damage = this.self.attackFunc();
                    }
                    else {
                        resultStrings.push("Your enemy blocked")
                        damage = Math.max(this.self.attackFunc() - this.opponent.defenseFunc(),0);
                    }
                }
                else{
                    damage = this.self.attackFunc();
                }
                this.opponent.health -= damage;
                resultStrings.push(`Your enemy took ${damage} damage`);
            }
            else {
                resultStrings.push("You tried to attack, but your monster is too exhausted")
            }
        } else if(this.personalFightOption == FightOption.Reload) {
            this.self.energy +=  1 + this.self.ability.energyIncreaseChange
            resultStrings.push(`Your monster gained ${1 + this.self.ability.energyIncreaseChange} energy`)
        }

        if (this.opponentFightOption == FightOption.Attack) {
            if (this.opponent.energy >= 1) {
                this.opponent.energy -= 1;
                resultStrings.push("Your enemy attacked")
                let damage = 0;
                if (this.personalFightOption == FightOption.Block) {
                    if (this.opponent.ability.hasPiercing()) {
                        resultStrings.push("Your monster blocked, but the attack pierced");
                        damage = this.opponent.attackFunc();
                    }
                    else {
                        resultStrings.push("Your monster blocked")
                        damage = Math.max(this.opponent.attackFunc() - this.self.defenseFunc(),0);
                    }
                }
                else{
                    damage = this.opponent.attackFunc();
                }
                this.self.health -= damage;
                resultStrings.push(`Your monster took ${damage} damage`);
            }
            else {
                resultStrings.push("The AI tried to attack without energy, but it wasn't supposed to. It has become sentient. Run.")
            }
        } else if(this.opponentFightOption == FightOption.Reload) {
            this.opponent.energy += 1 + this.opponent.ability.energyIncreaseChange
            resultStrings.push(`Your enemy gained ${1 + this.self.ability.energyIncreaseChange} energy`)
        }
    
        console.log(this.self.health, this.opponent.health)
        this.turnCount ++;
        if (resultStrings.length == 1) {
            resultStrings.push("You stare at eachother awkardly.")
        }
        return resultStrings;
    }
}
