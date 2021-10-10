import {LootTableId} from "@/ig-template/tools/loot-tables/LootTableId";
import {IgtLootEntry} from "@/ig-template/tools/loot-tables/entries/IgtLootEntry";
import {Random} from "@/ig-template/tools/probability/Random";
import {IgtLoot} from "@/ig-template/tools/loot-tables/rewards/IgtLoot";

export class LootTable {
    id: LootTableId;

    /**
     * All loot-tables that is added on every roll
     */
    public always: IgtLootEntry[];

    /**
     * Only one of these will be selected based on their relative weight, n times
     */
    public oneOf: IgtLootEntry[];

    /**
     * Any of these have an independent chance to be added to the roll.
     */
    public anyOf: IgtLootEntry[];

    constructor(id: LootTableId, always: IgtLootEntry[], oneOf: IgtLootEntry[], anyOf: IgtLootEntry[]) {
        this.id = id;
        this.always = always;
        this.oneOf = oneOf;
        this.anyOf = anyOf
    }

    public roll(n: number = 1): IgtLoot[] {
        const loot = this.getLoot(n);
        loot.forEach(l => {
            l.apply();
        })
        return loot;
    }

    public getLoot(n: number = 1): IgtLoot[] {
        const always = this.calculateAlwaysLoot();
        const oneOf = this.calculateOneOfLoot(n);
        const anyOf = this.calculateAnyOfLoot();

        const total = always.concat(oneOf).concat(anyOf);

        return this.simplifyLoot(total);
    }

    public calculateAlwaysLoot(): IgtLoot[] {
        let alwaysLoot: IgtLoot[] = [];
        const availableLoot = LootTable.filterOnRequirements(this.always);
        for (const reward of availableLoot) {
            alwaysLoot = alwaysLoot.concat(reward.getLoot());
        }

        return alwaysLoot;
    }

    public calculateOneOfLoot(n: number): IgtLoot[] {
        const availableLoot = LootTable.filterOnRequirements(this.oneOf);
        let res: IgtLoot[] = [];
        for (let i = 0; i < n; i++) {
            res = res.concat(this.getOneFrom(availableLoot))
        }
        return res;
    }

    public getOneFrom(availableLoot: IgtLootEntry[]): IgtLoot[] {
        const sum = LootTable.calculateWeightSum(availableLoot);
        let draw = Random.floatBetween(0, sum)
        for (let i = 0; i < availableLoot.length; i++) {
            if (draw <= availableLoot[i].weight) {
                return availableLoot[i].getLoot();
            } else {
                draw -= availableLoot[i].weight;
            }
        }
        return [];
    }

    /**
     * Remove all entries that do not have their requirements met;
     * @param loot
     */
    public static filterOnRequirements(loot: IgtLootEntry[]): IgtLootEntry[] {
        return loot.filter(l => l.canGet());
    }

    public static calculateWeightSum(rewards: IgtLootEntry[]): number {
        let sum = 0;
        for (const key of rewards) {
            sum += key.weight;
        }
        return sum;
    }

    public calculateAnyOfLoot(): IgtLoot[] {
        let anyOfLoot: IgtLoot[] = [];
        const availableLoot = LootTable.filterOnRequirements(this.anyOf);

        for (const reward of availableLoot) {
            if (Random.booleanWithProbability(reward.weight)) {
                anyOfLoot = anyOfLoot.concat(reward.getLoot())
            }
        }
        return anyOfLoot;
    }

    /**
     * Merge duplicate ItemAmount together
     */
    public simplifyLoot(loots: IgtLoot[]): IgtLoot[] {
        const ret: IgtLoot[] = [];
        for (const loot of loots) {
            const index = ret.findIndex(l => l.equals(loot));
            if (index !== -1) {
                ret[index].amount += loot.amount;
            } else {
                ret.push(loot);
            }
        }
        return ret;
    }


}
