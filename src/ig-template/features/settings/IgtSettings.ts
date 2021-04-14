import {IgtFeature} from "@/ig-template/features/IgtFeature";
import {SettingsSaveData} from "@/ig-template/features/settings/SettingsSaveData";
import {Setting} from "@/ig-template/features/settings/Setting";
import {SettingId} from "@/ig-template/features/settings/SettingId";
import {SettingsValue} from "@/ig-template/features/settings/SettingsValueType";

export class IgtSettings extends IgtFeature {
    list: Setting[];

    constructor(saveKey: string = "settings") {
        super(saveKey);
        this.list = [];
    }

    registerSetting<T extends Setting>(setting: T): T {
        if (!this.getSetting(setting.id)) {
            this.list.push(setting);
        }
        return setting;
    }

    setSetting(id: SettingId, value: SettingsValue): void {
        const setting = this.getSetting(id);
        if (setting) {
            setting.set(value);
        } else {
            console.warn(`Setting ${id} does not exist`);
        }
    }

    getSetting<T extends Setting>(id: SettingId): T | null {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id == id) {
                return this.list[i] as T;
            }
        }
        return null;
    }


    load(data: SettingsSaveData): void {
        for (const settingSave of data.list) {
            this.getSetting(settingSave.id)?.set(settingSave.value);
        }
    }

    save(): SettingsSaveData {
        return {
            list: this.list.map(setting => {
                return {
                    id: setting.id,
                    value: setting.value
                }
            })
        }

    }
}
