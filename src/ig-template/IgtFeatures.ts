import {IgtWallet} from "@/ig-template/features/wallet/IgtWallet";
import {IgtSettings} from "@/ig-template/features/settings/IgtSettings";
import {IgtStatistics} from "@/ig-template/features/statistics/IgtStatistics";
import {IgtAchievements} from "@/ig-template/features/achievements/IgtAchievements";
import {IgtRedeemableCodes} from "@/ig-template/features/codes/IgtRedeemableCodes";
import {IgtSpecialEvents} from "@/ig-template/features/special-events/IgtSpecialEvents";
import {IgtInventory} from "@/ig-template/features/inventory/IgtInventory";
import {IgtKeyItems} from "@/ig-template/features/key-items/IgtKeyItems";
import {LootTables} from "@/ig-template/features/loot-tables/LootTables";
import {IgtItemList} from "@/ig-template/features/items/IgtItemList";

export interface IgtFeatures {
    wallet?: IgtWallet;
    settings?: IgtSettings;
    codes?: IgtRedeemableCodes;
    inventory?: IgtInventory;
    itemList?: IgtItemList;
    keyItems?: IgtKeyItems;
    lootTables?: LootTables;
    specialEvents?: IgtSpecialEvents;
    statistics?: IgtStatistics;
    achievements?: IgtAchievements;
}
