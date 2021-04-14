import {SaveData} from "@/ig-template/tools/saving/SaveData";
import {CurrencySaveData} from "@/ig-template/features/wallet/CurrencySaveData";

export interface WalletSaveData extends SaveData {
    currencies: CurrencySaveData[]
}
