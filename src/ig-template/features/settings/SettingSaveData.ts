import {SaveData} from "@/ig-template/tools/saving/SaveData";
import {SettingId} from "@/ig-template/features/settings/SettingId";
import {SettingsValue} from "@/ig-template/features/settings/SettingsValueType";

export interface SettingSaveData extends SaveData {
    id: SettingId;
    value: SettingsValue;
}
