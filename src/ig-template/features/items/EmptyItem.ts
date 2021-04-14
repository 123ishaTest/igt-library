import {AbstractItem} from "@/ig-template/features/items/AbstractItem";

/**
 * Empty item that is used to fill up empty inventory slots
 */
export class EmptyItem extends AbstractItem {

    constructor() {
        super('Empty', '', 'empty', 'empty', 0);
    }
}
