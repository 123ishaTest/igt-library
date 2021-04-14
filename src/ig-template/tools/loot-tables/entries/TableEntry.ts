import {LootTableId} from "@/ig-template/tools/loot-tables/LootTableId";
import {LootTables} from "@/ig-template/features/loot-tables/LootTables";
import {IgtLootEntry} from "@/ig-template/tools/loot-tables/entries/IgtLootEntry";
import {Requirement} from "@/ig-template/tools/requirements/Requirement";
import {NoRequirement} from "@/ig-template/tools/requirements/NoRequirement";
import {IntRange} from "@/ig-template/tools/probability/IntRange";
import {IgtLoot} from "@/ig-template/tools/loot-tables/rewards/IgtLoot";

export class TableEntry extends IgtLootEntry {
    _lootTables: LootTables;
    table: LootTableId;

    constructor(table: LootTableId, lootTables: LootTables, weight: number = 1, amount: IntRange = new IntRange(1, 1), requirement: Requirement = new NoRequirement()) {
        super(weight, amount, requirement);
        this.table = table;
        this._lootTables = lootTables;
    }

    getLoot(): IgtLoot[] {
        return this._lootTables.getTable(this.table).getLoot();
    }

}
