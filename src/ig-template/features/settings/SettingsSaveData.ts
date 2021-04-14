import {SaveData} from "@/ig-template/tools/saving/SaveData";
import {SettingSaveData} from "@/ig-template/features/settings/SettingSaveData";

export interface SettingsSaveData extends SaveData {
    list: SettingSaveData[];
}
