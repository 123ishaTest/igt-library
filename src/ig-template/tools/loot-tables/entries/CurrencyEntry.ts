import {IgtLootEntry} from "@/ig-template/tools/loot-tables/entries/IgtLootEntry";
import {Requirement} from "@/ig-template/tools/requirements/Requirement";
import {NoRequirement} from "@/ig-template/tools/requirements/NoRequirement";
import {IntRange} from "@/ig-template/tools/probability/IntRange";
import {IgtWallet} from "@/ig-template/features/wallet/IgtWallet";
import {CurrencyLoot} from "@/ig-template/tools/loot-tables/rewards/CurrencyLoot";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";

export class CurrencyEntry extends IgtLootEntry {
    _wallet: IgtWallet;
    type: CurrencyType;

    constructor(amount: IntRange, type: CurrencyType, wallet: IgtWallet, weight: number = 1, requirement: Requirement = new NoRequirement()) {
        super(weight, amount, requirement);
        this.type = type;
        this._wallet = wallet;
    }

    getLoot(): CurrencyLoot[] {
        if (!this.canGet()) {
            return [];
        }
        return [new CurrencyLoot(this.amount.getRandomBetween(), this.type, this._wallet)];
    }

}
