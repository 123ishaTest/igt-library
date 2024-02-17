import { ItemId } from './ItemId';
import { ItemType } from './ItemType';
import { Saveable } from '@/ig-template/tools/saving/Saveable';

/**
 * Abstract class that all inventory items will inherit from
 * TODO(@Isha) move saveable to AbstractDataItem
 */
export abstract class AbstractItem implements Saveable {
  name: string;
  id: ItemId;
  type: ItemType;
  description: string;
  maxStack: number;

  protected constructor(name: string, description: string, id: ItemId, type: ItemType, maxStack: number = Infinity) {
    this.name = name;
    this.description = description;
    this.id = id;
    this.type = type;
    this.maxStack = maxStack;

    this.saveKey = this.id;
  }

  // Save and load. Only needed if this item store additional data
  saveKey: string;

  load(_: Record<string, unknown>): void {
    // Empty
  }

  save(): Record<string, unknown> {
    return {};
  }
}
