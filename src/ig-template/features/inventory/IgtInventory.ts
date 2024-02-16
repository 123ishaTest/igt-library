import {cloneDeep} from 'lodash-es';

import {InventorySlot} from "@/ig-template/features/inventory/InventorySlot";
import {ItemId} from "@/ig-template/features/items/ItemId";
import {IgtFeature} from "@/ig-template/features/IgtFeature";
import {IgtItemList} from "@/ig-template/features/items/IgtItemList";
import {IgtFeatures} from "@/ig-template/IgtFeatures";
import {AbstractConsumable} from "@/ig-template/features/items/AbstractConsumable";
import {AbstractItem} from "@/ig-template/features/items/AbstractItem";
import {EmptyItem} from "@/ig-template/features/items/EmptyItem";
import {InventorySaveData} from "@/ig-template/features/inventory/InventorySaveData";
import {InventorySlotSaveData} from "@/ig-template/features/inventory/InventorySlotSaveData";
import {EventDispatcher, IEvent} from "strongly-typed-events";
import {ItemAmount} from "@/ig-template/features/items/ItemAmount";

export class IgtInventory extends IgtFeature {
    slotCount: number;
    slots: InventorySlot[];

    // Overridden in initialize;
    _itemList: IgtItemList = undefined as unknown as IgtItemList;

    protected _onItemGain = new EventDispatcher<AbstractItem, number>();

    constructor(slots: number = 10, saveKey: string = 'inventory') {
        super(saveKey);
        this.slotCount = slots;
        this.slots = new Array(this.slotCount).fill(new InventorySlot(new EmptyItem(), 0)) as InventorySlot[];
    }


    initialize(features: IgtFeatures): void {
        super.initialize(features);
        if (!features.itemList) {
            throw new Error("IgtInventory depends on IgtItemList, make sure it's instantiated and added to IgtFeatures")
        }
        this._itemList = features.itemList;
    }

    interactIndices(indexFrom: number, indexTo: number): void {
        if (indexFrom === indexTo) {
            return;
        }

        const itemFrom = this.slots[indexFrom];

        if (itemFrom.isEmpty()) {
            console.warn("Cannot interact with empty item");
            return;
        }
        const itemTo = this.slots[indexTo];

        if (itemFrom.item.id === itemTo.item.id) {
            this.mergeItems(itemFrom, itemTo);
            return;
        }

        this.swapItems(indexFrom, indexTo);
        return;
    }

    mergeItems(itemFrom: InventorySlot, itemTo: InventorySlot): void {
        if (itemFrom.item.id !== itemTo.item.id) {
            throw new Error(`Cannot merge items of types ${itemFrom.item.id} and ${itemTo.item.id}`);
        }

        const amount = Math.min(itemFrom.amount, itemTo.spaceLeft());
        itemFrom.loseItems(amount);
        itemTo.gainItems(amount);
    }

    swapItems(indexFrom: number, indexTo: number): void {
        const temp = this.slots[indexFrom];
        this.slots.splice(indexFrom, 1, this.slots[indexTo]);
        this.slots.splice(indexTo, 1, temp);
    }

    consumeItem(index: number, amount: number = 1): boolean {
        const inventoryItem = this.slots[index];
        const item = inventoryItem.item;

        if (!(item instanceof AbstractConsumable)) {
            console.warn(`Item is not a consumable`, item);
            return false;
        }
        if (inventoryItem.amount < amount) {
            console.warn(`Amount of ${inventoryItem.item.id} is not greater than ${amount}`, inventoryItem);
            return false;
        }
        if (!item.canConsume()) {
            console.warn("Cannot consume item, check its restrictions for the reason");
            return false;
        }

        if (amount === 1) {
            item.consume();
        } else {
            item.consumeMultiple(amount);
        }
        this.loseItemAtIndex(index, amount);
        return true;
    }

    /**
     * Remove items from this inventory, prefer an empty stack
     * Recursively calls itself if stacks are emptying
     * Returns the number of items that still need to be removed
     * @param id
     * @param amount
     */
    loseItemAmount(id: ItemId, amount: number = 1): number {
        // While we still need to remove and have items left
        while (amount > 0 && this.getTotalAmount(id) > 0) {
            const nonFullStackIndex = this.getIndexOfNonFullStack(id)
            const indexToUse = nonFullStackIndex !== -1 ? nonFullStackIndex : this.getIndexOfItem(id);
            if (indexToUse === -1) {
                throw Error(`Index of item ${id} to lose is -1. This suggests an error in inventory management`);
            }
            const amountToRemove = Math.min(amount, this.slots[indexToUse].amount);
            amount -= amountToRemove;
            this.loseItemAtIndex(indexToUse, amountToRemove);

        }

        return amount;
    }

    public gainItem(item: AbstractItem, amount: number = 1): number {
        const amountLeft = this._gainItem(item, amount);
        this._onItemGain.dispatch(item, amount);
        return amountLeft;
    }

    /**
     * Add items to this inventory, prefer an existing stack
     * Recursively calls itself if stacks are overflowing
     * Returns the number of items that need to be added
     */
    protected _gainItem(item: AbstractItem, amount: number = 1): number {

        // Find stack and add to it or create a new one
        const nonFullStackIndex = this.getIndexOfNonFullStack(item.id);
        if (nonFullStackIndex === -1) {
            // Create a new stack
            const emptyIndex = this.getIndexOfFirstEmptySlot();
            if (emptyIndex === -1) {
                console.log(`Cannot add ${amount} of ${item.id}, no empty slots left`);
                return amount;
            }
            const amountToAdd = Math.min(amount, item.maxStack);
            this.slots.splice(emptyIndex, 1, new InventorySlot(item, amountToAdd));

            const amountLeft = amount - amountToAdd;
            if (amountLeft <= 0) {
                return 0;
            }
            return this._gainItem(item, amountLeft);
        } else {
            // Add to existing stack
            const amountToAdd = Math.min(amount, this.slots[nonFullStackIndex].spaceLeft());

            this.slots[nonFullStackIndex].gainItems(amountToAdd);
            const amountLeft = amount - amountToAdd;
            if (amountLeft <= 0) {
                return 0;
            }
            return this._gainItem(item, amountLeft);
        }
    }

    getSpotsLeftForItem(item: AbstractItem): number {
        let total = 0;
        for (const inventoryItem of this.slots) {
            if (inventoryItem.isEmpty()) {
                total += item.maxStack;
            } else if (inventoryItem.item.id === item.id) {
                total += inventoryItem.spaceLeft();
            }
        }
        return total;
    }

    /**
     * This method very inefficiently clones the inventory, and simulates adding the items see if they can be taken.
     * It's also the only reason we're using lodash...
     * TODO do this in a smart way.
     */
    canTakeItemAmounts(itemAmounts: ItemAmount[]): boolean {
        const clonedInventory = cloneDeep(this);
        for (const item of itemAmounts) {
            const amountLeft = clonedInventory.gainItem(this._itemList.getItem(item.id), item.amount);
            if (amountLeft !== 0) {
                return false;
            }
        }
        return true;
    }

    hasItemAmounts(amounts: ItemAmount[]): boolean {
        for (const amount of amounts) {
            if (!this.hasItemAmount(amount)) {
                return false;
            }
        }
        return true;
    }

    hasItemAmount(amount: ItemAmount): boolean {
        return this.getTotalAmount(amount.id) >= amount.amount;
    }

    canTakeItem(item: AbstractItem, amount: number): boolean {
        return this.getSpotsLeftForItem(item) >= amount;
    }

    getIndexOfNonFullStack(id: ItemId): number {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].item.id === id && !this.slots[i].isFull()) {
                return i;
            }
        }
        return -1;
    }

    getIndexOfItem(id: ItemId): number {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].item.id === id) {
                return i;
            }
        }
        return -1;
    }

    getIndexOfFirstEmptySlot(): number {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].isEmpty()) {
                return i;
            }
        }
        return -1;
    }

    hasEmptySlot(): boolean {
        return this.getIndexOfFirstEmptySlot() !== -1;
    }

    hasNonFullStack(id: ItemId): boolean {
        return this.getIndexOfNonFullStack(id) !== -1;
    }


    loseItemAtIndex(index: number, amount: number = 1): void {
        this.slots[index].loseItems(amount);
        if (this.slots[index].amount <= 0) {
            this.slots.splice(index, 1, new InventorySlot(new EmptyItem(), 0));
        }
    }

    dropStack(index: number): void {
        this.loseItemAtIndex(index, this.slots[index].amount);
    }

    getEmptySlotCount(): number {
        let count = 0;
        for (const inventoryItem of this.slots) {
            if (inventoryItem.isEmpty()) {
                count++;
            }
        }
        return count;
    }


    getTotalAmount(id: ItemId): number {
        let total = 0;
        for (const inventoryItem of this.slots) {
            if (inventoryItem.item.id === id) {
                total += inventoryItem.amount;
            }
        }
        return total;
    }

    getAmount(index: number): number {
        return this.slots[index].amount;
    }


    isEmpty(): boolean {
        for (const item of this.slots) {
            if (item.amount != 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Emitted whenever this inventory gains items (even if it can't take them).
     */
    public get onItemGain(): IEvent<AbstractItem, number> {
        return this._onItemGain.asEvent();
    }

    load(data: InventorySaveData): void {
        if (!data.slots) {
            return;
        }
        for (let i = 0; i < data.slots.length; i++) {
            const slotData: InventorySlotSaveData = data.slots[i];
            if (slotData.id === 'empty') {
                continue;
            }

            try {
                const item = this._itemList.getItem(slotData.id);
                item.load(slotData.data);
                this.slots[i] = new InventorySlot(item, slotData.amount);
            } catch (e) {
                console.error(`Could not load Item ${slotData.id}. Make sure it has a getter in ItemList`);
            }

        }
    }

    save(): InventorySaveData {
        const slots = this.slots.map(slot => {
            return {
                id: slot.item.id,
                amount: slot.amount,
                data: slot.item.save()
            };
        });
        return {
            slots: slots
        }
    }

}
