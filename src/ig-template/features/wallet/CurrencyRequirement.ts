import {Requirement} from "@/ig-template/tools/requirements/Requirement";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {IgtWallet} from "@/ig-template/features/wallet/IgtWallet";

export class CurrencyRequirement extends Requirement {

    private _wallet: IgtWallet;
    amount: number;
    type: CurrencyType;


    constructor(wallet: IgtWallet, amount: number, type: CurrencyType) {
        super();
        this._wallet = wallet;
        this.amount = amount;
        this.type = type;
    }

    get actualValue(): number {
        return this._wallet.getAmount(this.type);
    }

    get targetValue(): number {
        return this.amount;
    }

    get hint(): string {
        return `Have ${this.amount} ${this.type}`;
    }

}
