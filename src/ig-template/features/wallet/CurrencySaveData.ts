import {SaveData} from "@/ig-template/tools/saving/SaveData";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";

export interface CurrencySaveData extends SaveData {
    type: CurrencyType;
    amount: number;
}
