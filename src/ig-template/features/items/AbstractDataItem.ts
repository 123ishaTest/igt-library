import {ItemId} from "@/ig-template/features/items/ItemId";
import {AbstractItem} from "@/ig-template/features/items/AbstractItem";
import {ItemType} from "@/ig-template/features/items/ItemType";

/**
 * This item can store custom data that is also saved.
 */
export class AbstractDataItem extends AbstractItem {
    customData: Record<string, unknown>;

    constructor(name: string, description: string, id: ItemId, type: ItemType, maxStack: number, customData: Record<string, unknown>) {
        super(name, description, id, type, maxStack);
        this.customData = customData;
    }

    save(): Record<string, unknown> {
        return {
            customData: this.customData
        }
    }

    load(data: Record<string, unknown>): void {
        this.customData = data.customData as Record<string, unknown> ?? this.customData;
    }
}
