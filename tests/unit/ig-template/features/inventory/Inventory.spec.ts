import { beforeEach, describe, expect, test } from 'vitest';

import { IgtInventory } from '@/ig-template/features/inventory/IgtInventory';
import { AbstractItem } from '@/ig-template/features/items/AbstractItem';
import { ItemId } from '@/ig-template/features/items/ItemId';
import { ItemType } from '@/ig-template/features/items/ItemType';
import { AbstractConsumable } from '@/ig-template/features/items/AbstractConsumable';
import { InventorySlot } from '@/ig-template/features/inventory/InventorySlot';
import { ItemAmount } from '@/ig-template/features/items/ItemAmount';
import { DummyGame } from '@tests/smoke/Game.spec';
import { IgtItemList } from '@/ig-template/features/items/IgtItemList';

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

describe('Inventory', () => {
  const maxExampleStack = 5;
  const item1 = new ExampleItem('item-1' as ItemId, maxExampleStack);
  const item2 = new ExampleItem('item-2' as ItemId, maxExampleStack);
  let consumable: ExampleConsumable;

  beforeEach(() => {
    consumable = new ExampleConsumable('consumable' as ItemId, maxExampleStack);
  });

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
  });

  test('Drop stack', () => {
    // Arrange
    const inventory: IgtInventory = new IgtInventory(2);

    // Act
    inventory.gainItem(item1, maxExampleStack * 2);
    inventory.dropStack(1);

    // Assert
    expect(inventory.getTotalAmount(item1.id)).toBe(5);
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
    inventory.slots[0] = new InventorySlot(item1, 1);
    inventory.slots[1] = new InventorySlot(item1, 2);

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

  describe('canTakeItemAmounts', () => {
    class TestItemList extends IgtItemList {
      _itemList = new Map<ItemId, AbstractItem>();

      constructor(items: AbstractItem[]) {
        super('item-list');
        items.forEach((item) => {
          this._itemList.set(item.id, item);
        });
      }

      getItem(id: ItemId): AbstractItem {
        return this._itemList.get(id) as AbstractItem;
      }
    }

    let inventory: IgtInventory;
    const aSingleItem = (id: string) => new ItemAmount(id, 1);
    const fiveItems = (id: string) => new ItemAmount(id, 5);
    const itemWithHigherStack = (id: string) => new ExampleItem(id, 6);
    let testGame: DummyGame;

    beforeEach(() => {
      inventory = new IgtInventory(1);
      testGame = new DummyGame({
        itemList: new TestItemList([item1]),
        inventory: inventory,
      });
      testGame.initialize();
    });

    test('returns true if there are enough items', () => {
      // Act
      inventory.gainItem(item1, 4);
      const canTake = inventory.canTakeItemAmounts([aSingleItem(item1.id)]);

      // Assert
      expect(canTake).toBe(true);
    });

    test('returns false if there are not enough items', () => {
      // Act
      inventory.gainItem(item1, 4);
      const canTake = inventory.canTakeItemAmounts([fiveItems(item1.id)]);

      // Assert
      expect(canTake).toBe(false);
    });

    test('returns true if there are exactly enough items', () => {
      // Act
      inventory.gainItem(item1, 5);
      const canTake = inventory.canTakeItemAmounts([fiveItems(item1.id)]);

      // Assert
      expect(canTake).toBe(true);
    });

    test('returns false if there are no items to start with', () => {
      expect(inventory.isEmpty()).toBe(true);

      // Act
      const canTake = inventory.canTakeItemAmounts([aSingleItem(item1.id)]);

      // Assert
      expect(canTake).toBe(false);
    });

    test('returns false if there are no items to take passed in', () => {
      // Act
      inventory.gainItem(item1, 4);
      const emptyItemAmounts: ItemAmount[] = [];
      const canTake = inventory.canTakeItemAmounts(emptyItemAmounts);

      // Assert
      expect(canTake).toBe(false);
    });

    describe('handles multiple items', () => {
      beforeEach(() => {
        inventory = new IgtInventory(2);
        testGame = new DummyGame({
          itemList: new TestItemList([item1]),
          inventory: inventory,
        });
        testGame.initialize();
      });

      test('that are the same, returning true if there are enough items', () => {
        // Act
        inventory.gainItem(item1, 4);
        const item = aSingleItem(item1.id);
        const canTake = inventory.canTakeItemAmounts([item, item]);

        // Assert
        expect(canTake).toBe(true);
      });

      test('that are the same, returning false if there are not enough items', () => {
        // Act
        inventory.gainItem(item1, 4);
        const canTake = inventory.canTakeItemAmounts([aSingleItem(item1.id), fiveItems(item1.id)]);

        // Assert
        expect(canTake).toBe(false);
      });

      test('that are the same, returning true if there are exactly enough items', () => {
        // Act
        const id = item1.id;
        inventory.gainItem(itemWithHigherStack(id), 6);
        const canTake = inventory.canTakeItemAmounts([aSingleItem(id), fiveItems(id)]);

        // Assert
        expect(canTake).toBe(true);
      });

      test('that are different, returning true if there are enough items', () => {
        // Act
        inventory.gainItem(item1, 4);
        inventory.gainItem(item2, 2);
        const canTake = inventory.canTakeItemAmounts([aSingleItem(item1.id), aSingleItem(item2.id)]);

        // Assert
        expect(canTake).toBe(true);
      });

      test('that are different, returning false if there are not enough items', () => {
        // Act
        inventory.gainItem(item1, 4);
        inventory.gainItem(item2, 2);
        const canTake = inventory.canTakeItemAmounts([aSingleItem(item1.id), fiveItems(item2.id)]);

        // Assert
        expect(canTake).toBe(false);
      });

      test('that are different, returning true if there are exactly enough items', () => {
        // Act
        inventory.gainItem(item1, 5);
        inventory.gainItem(item2, 2);
        const item = aSingleItem(item2.id);
        const canTake = inventory.canTakeItemAmounts([fiveItems(item1.id), item, item]);

        // Assert
        expect(canTake).toBe(true);
      });
    });
  });
});
