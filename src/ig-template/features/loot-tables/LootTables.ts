import {IgtFeature} from "@/ig-template/features/IgtFeature";
import {SaveData} from "@/ig-template/tools/saving/SaveData";
import {LootTable} from "@/ig-template/tools/loot-tables/LootTable";
import {LootTableId} from "@/ig-template/tools/loot-tables/LootTableId";

export abstract class LootTables extends IgtFeature {

    protected constructor(saveKey: string = 'loot-tables') {
        super(saveKey);
    }

    abstract getTable(id: LootTableId): LootTable;

    load(): void {
        // Empty
    }

    save(): SaveData {
        return {};
    }

}
