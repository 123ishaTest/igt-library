import {IgtInventory} from "@/ig-template/features/inventory/IgtInventory";
import {AbstractItem} from "@/ig-template/features/items/AbstractItem";
import {ItemId} from "@/ig-template/features/items/ItemId";
import {ItemType} from "@/ig-template/features/items/ItemType";
import {AbstractConsumable} from "@/ig-template/features/items/AbstractConsumable";
import {InventorySlot} from "@/ig-template/features/inventory/InventorySlot";
import { IgtItemList } from "@/ig-template/features/items/IgtItemList";
import { IgtFeatures } from "@/index";
import _ from "lodash";

jest.spyOn(console, 'warn').mockImplementation(() => { });

export class ExampleItem extends AbstractItem {
    constructor(id: ItemId, maxStack: number) {
        super('', '', id, '' as ItemType, maxStack);
    }
}

class ExampleConsumable extends AbstractConsumable {
    consumeLabel = 'consume';
    isConsumed = false;

    constructor(id: ItemId, maxStack: number) {
        super('', '', id, '' as ItemType, maxStack);
    }

    canConsume(): boolean {
        return true;
    }

    consume(): void {
        this.isConsumed = true;
    }
}

class ExampleItemList extends IgtItemList {

    _itemList = new Map<ItemId, AbstractItem>();
    length: number

    constructor(items: AbstractItem[]) {
        super('item-list');
        items.forEach(item => {
            this._itemList.set(item.id, item);
        })
        this.length = items.length;
    }

    getItem(id: ItemId): AbstractItem {
        return this._itemList.get(id) as AbstractItem;
    }
}

describe('Inventory', () => {
    const maxExampleStack = 5;
    const item1 = new ExampleItem('item-1' as ItemId, maxExampleStack);
    const item2 = new ExampleItem('item-2' as ItemId, maxExampleStack);
    let consumable: ExampleConsumable;

    beforeEach(() => {
        consumable = new ExampleConsumable('consumable' as ItemId, maxExampleStack);
        jest.resetAllMocks();
    })

    test('Inventory is empty after creation', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);

        // Act

        // Assert
        expect(inventory.isEmpty()).toBe(true);
        expect(inventory.getEmptySlotCount()).toBe(2);
    });

    test('Inventory is not empty after item is added', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(1);


        // Act
        inventory.gainItem(item1);

        // Assert
        expect(inventory.isEmpty()).toBe(false);
        expect(inventory.hasEmptySlot()).toBe(false);
        expect(inventory.getTotalAmount(item1.id)).toBe(1);
    });

    test('We can add more of the same item to a stack', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(1);

        // Act
        inventory.gainItem(item1);

        // Assert
        expect(inventory.hasNonFullStack(item1.id)).toBe(true);

    });

    test('Add to existing stacks', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(1);

        // Act
        inventory.gainItem(item1, 2);
        inventory.gainItem(item1, 3);

        // Assert
        expect(inventory.hasNonFullStack(item1.id)).toBe(false);

    });

    test('Add more than 1 stack can handle', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);

        // Act
        inventory.gainItem(item1, 1);
        inventory.gainItem(item1, maxExampleStack * 2 - 1);

        // Assert
        expect(inventory.getTotalAmount(item1.id)).toBe(10);
        expect(inventory.getAmount(0)).toBe(5);
        expect(inventory.getAmount(1)).toBe(5);
    });

    test('Drop stack', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);

        // Act
        inventory.gainItem(item1, maxExampleStack * 2);
        expect(inventory.getTotalAmount(item1.id)).toBe(10);
        expect(inventory.getAmount(0)).toBe(5);
        expect(inventory.getAmount(1)).toBe(5);
        inventory.dropStack(1);

        // Assert
        expect(inventory.getTotalAmount(item1.id)).toBe(5);
        expect(inventory.getAmount(0)).toBe(5);
        expect(inventory.getAmount(1)).toBe(0);
    });

    test('Lose items', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);

        // Act
        inventory.gainItem(item1, maxExampleStack * 2);
        inventory.loseItemAmount(item1.id, 3);

        // Assert
        expect(inventory.getTotalAmount(item1.id)).toBe(7);
        expect(inventory.getAmount(0)).toBe(2);
        expect(inventory.getAmount(1)).toBe(5);
        // TODO: Add getIndexesWithItem() method and add it to loseItemAmount so that it can pull from the end of the list
    });

    test('Adding items does not exceed max stack count', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(1);

        // Act
        inventory.gainItem(item1, maxExampleStack + 1);

        // Assert
        expect(inventory.getTotalAmount(item1.id)).toBe(maxExampleStack);

    });

    test('Adding items overflows into the next stack', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);

        // Act
        inventory.gainItem(item1, maxExampleStack + 1);

        // Assert
        expect(inventory.getTotalAmount(item1.id)).toBe(maxExampleStack + 1);

    });

    test('Correct spots left', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);
        expect(inventory.getSpotsLeftForItem(item1)).toBe(2 * maxExampleStack);

        // Act
        inventory.gainItem(item1, maxExampleStack + 1);

        // Assert
        expect(inventory.getSpotsLeftForItem(item1)).toBe(maxExampleStack - 1);
        expect(inventory.canTakeItem(item1, maxExampleStack - 1)).toBe(true);
        expect(inventory.canTakeItem(item1, maxExampleStack)).toBe(false);
    });

    test('Correct spots left with multiple items', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);

        // Act
        inventory.gainItem(item1);
        inventory.gainItem(item2);

        // Assert
        expect(inventory.getSpotsLeftForItem(item1)).toBe(maxExampleStack - 1);
        expect(inventory.getSpotsLeftForItem(item2)).toBe(maxExampleStack - 1);
    });

    test('Inventory interactions swap', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);

        // Act
        inventory.gainItem(item1);
        inventory.gainItem(item2);

        // Assert
        expect(inventory.getIndexOfItem(item1.id)).toBe(0);
        expect(inventory.getIndexOfItem(item2.id)).toBe(1);

        inventory.interactIndices(0, 1);
        expect(inventory.getIndexOfItem(item1.id)).toBe(1);
        expect(inventory.getIndexOfItem(item2.id)).toBe(0);
    });

    test('Inventory interactions merge', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);
        inventory.slots[0] = new InventorySlot(item1, 1)
        inventory.slots[1] = new InventorySlot(item1, 2)

        // Act
        inventory.interactIndices(0, 1);

        // Assert
        expect(inventory.getAmount(0)).toBe(0);
        expect(inventory.getAmount(1)).toBe(3);
        expect(inventory.getTotalAmount(item1.id)).toBe(3);
    });

    test('Consumables', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(1);
        inventory.gainItem(consumable);

        // Act
        inventory.consumeItem(0);
        // Assert
        expect(inventory.isEmpty()).toBe(true);
        expect(consumable.isConsumed).toBe(true);
    });

    test('IgtInventory initializes with the correct itemList', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory();
        const listOfItems = [item1, item2];
        const testFeature = new ExampleItemList(listOfItems);
        const features: IgtFeatures = { itemList: testFeature };
        // Act
        inventory.initialize(features);

        // Assert
        listOfItems.forEach(item => {
            expect(inventory._itemList.getItem(item.id)).toBe(item);
        });
        const listAsExampleList = inventory._itemList as ExampleItemList;
        expect(listAsExampleList).toHaveLength(listOfItems.length);
    });

    test('IgtInventory fails to initialize without itemList', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory();
        const features: IgtFeatures = {};
        // Act
        const initialize = () => inventory.initialize(features);

        // Assert
        expect(initialize).toThrow("IgtInventory depends on IgtItemList, make sure it's instantiated and added to IgtFeatures");
    });

    test('interactIndeces does nothing if indices are the same', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);
        inventory.gainItem(item1);
        inventory.gainItem(item2);

        // Act
        inventory.interactIndices(0, 0);

        // Assert
        expect(inventory.getIndexOfItem(item1.id)).toBe(0);
        expect(inventory.getIndexOfItem(item2.id)).toBe(1);
    });

    test('interactIndeces does nothing if itemFrom is empty', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);
        inventory.gainItem(item1);

        // Act
        inventory.interactIndices(1, 0);

        // Assert
        expect(console.warn).toHaveBeenCalledWith("Cannot interact with empty item");
        expect(inventory.getIndexOfItem(item1.id)).toBe(0);
    });

    test('mergeItems throws error if items are not the same', () => {
        // Arrange
        const inventory: IgtInventory = new IgtInventory(2);
        inventory.gainItem(item1);
        inventory.gainItem(item2);
        const slots = inventory.slots;

        // Act
        const merge = () => inventory.mergeItems(slots[0], slots[1]);

        // Assert
        expect(merge).toThrow(`Cannot merge items of types ${slots[0].item.id} and ${slots[1].item.id}`);
    });
});
