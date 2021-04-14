import {IgtFeature} from "@/ig-template/features/IgtFeature";
import {SaveData} from "@/ig-template/tools/saving/SaveData";
import {IgtFeatures} from "@/ig-template/IgtFeatures";
import {EmptyItem} from "@/ig-template/features/items/EmptyItem";
import {ItemId} from "@/ig-template/features/items/ItemId";
import {AbstractItem} from "@/ig-template/features/items/AbstractItem";

export abstract class IgtItemList extends IgtFeature {

    protected constructor(saveKey: string = 'item-list') {
        super(saveKey);
    }

    initialize(features: IgtFeatures): void {
        super.initialize(features);
    }

    get empty(): EmptyItem {
        return new EmptyItem();
    }

    load(): void {
        // Empty
    }

    save(): SaveData {
        return {}
    }

    abstract getItem(id: ItemId): AbstractItem;
}
