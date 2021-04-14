import {IgtLoot} from "@/ig-template/tools/loot-tables/rewards/IgtLoot";
import {IgtInventory} from "@/ig-template/features/inventory/IgtInventory";
import {AbstractItem} from "@/ig-template/features/items/AbstractItem";

export class InventoryItemLoot extends IgtLoot {
    loot: AbstractItem;
    _inventory: IgtInventory;


    constructor(loot: AbstractItem, amount: number, inventory: IgtInventory) {
        super(amount);
        this.loot = loot;
        this._inventory = inventory;
    }

    apply(): void {
        this._inventory.gainItem(this.loot, this.amount);
    }

    equals(other: IgtLoot): boolean {
        return other instanceof InventoryItemLoot && other.loot.id === this.loot.id;
    }

}
