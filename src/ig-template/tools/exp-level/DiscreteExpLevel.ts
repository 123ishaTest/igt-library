import {IgtExpLevel} from "@/ig-template/tools/exp-level/IgtExpLevel";

/**
 * Implementation of IgtExpLevel that takes a list of exps needed for each level.
 */
export class DiscreteExpLevel extends IgtExpLevel {
    expPerLevel: number[]

    constructor(maxLevel: number, expPerLevel: number[], baseExp: number = 0) {
        super(maxLevel, baseExp);
        if (maxLevel !== expPerLevel.length) {
            throw new Error("MaxLevel is not equal to length of ExpPerLevel");
        }

        // Add infinity to avoid leveling up afterwards
        expPerLevel.push(Infinity);
        this.expPerLevel = expPerLevel;
    }

    getExpNeededForLevel(level: number): number {
        return this.expPerLevel[level - 1];
    }

}
