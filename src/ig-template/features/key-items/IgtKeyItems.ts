import { IgtFeature } from '@/ig-template/features/IgtFeature';
import { ISimpleEvent, SimpleEventDispatcher } from 'strongly-typed-events';
import { KeyItem } from '@/ig-template/features/key-items/KeyItem';
import { KeyItemId } from '@/ig-template/features/key-items/KeyItemId';
import { KeyItemSaveData } from '@/ig-template/features/key-items/KeyItemSaveData';

export class IgtKeyItems extends IgtFeature {
  list: Record<KeyItemId, KeyItem>;

  protected _onKeyItemGain = new SimpleEventDispatcher<KeyItem>();

  constructor(saveKey: string = 'key-items') {
    super(saveKey);
    this.list = {} as Record<KeyItemId, KeyItem>;
  }

  public registerKeyItem<T extends KeyItem>(keyItem: T): T {
    this.list[keyItem.id] = keyItem;
    return keyItem;
  }

  hasKeyItem(id: KeyItemId): boolean {
    return this.getKeyItem(id)?.isUnlocked;
  }

  getKeyItem(id: KeyItemId): KeyItem {
    return this.list[id];
  }

  gainKeyItem(id: KeyItemId): void {
    const item = this.getKeyItem(id);
    if (!item) {
      console.warn(`Key Item with id ${id} could not be found`);
      return;
    }
    const didUnlock = item.unlock();
    if (didUnlock) {
      this._onKeyItemGain.dispatch(item);
    }
  }

  /**
   * Emitted whenever a currency is gained
   */
  public get onKeyItemGain(): ISimpleEvent<KeyItem> {
    return this._onKeyItemGain.asEvent();
  }

  load(data: KeyItemSaveData): void {
    data.list?.forEach((id) => {
      const item = this.getKeyItem(id);
      if (item) {
        item.isUnlocked = true;
      }
    });
  }

  save(): KeyItemSaveData {
    const list = [];
    for (const key in this.list) {
      if (this.list[key].isUnlocked) {
        list.push(key);
      }
    }
    return {
      list: list,
    };
  }
}
