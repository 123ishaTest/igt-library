import {SettingId} from "@/ig-template/features/settings/SettingId";
import {Requirement} from "@/ig-template/tools/requirements/Requirement";
import {NoRequirement} from "@/ig-template/tools/requirements/NoRequirement";
import {SettingOption} from "@/ig-template/features/settings/SettingOption";
import {SettingsValue} from "@/ig-template/features/settings/SettingsValueType";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";


export abstract class Setting {
    id: SettingId;
    displayName: string;
    options: SettingOption[];
    defaultValue: SettingsValue;
    value: SettingsValue;

    requirement: Requirement;

    protected _onChange = new SimpleEventDispatcher<SettingsValue[]>();

    protected constructor(id: SettingId, displayName: string, options: SettingOption[], defaultValue: SettingsValue, requirement: Requirement = new NoRequirement()) {
        this.id = id;
        this.displayName = displayName;
        this.options = options;
        this.defaultValue = defaultValue;

        this.value = defaultValue;

        this.requirement = requirement;
    }

    /**
     * Emitted whenever the setting is changed.
     */
    public get onChange(): ISimpleEvent<SettingsValue[]> {
        return this._onChange.asEvent();
    }

    set(value: SettingsValue): void {
        if (!this.canAccess) {
            return;
        }
        if (this.validValue(value)) {
            const prevValue = this.value;
            this.value = value;
            this._onChange.dispatch([prevValue, value]);
        } else {
            console.warn(`${value} is not a valid value for setting ${this.id}. It could be that the option is not yet unlocked.`);
        }
    }

    validValue(value: SettingsValue): boolean {
        const option = this.options.find((option) => option.value === value);
        if (option == undefined || !option.canAccess) {
            return false;
        }
        return true;
    }

    isSelected(value: SettingsValue): boolean {
        return this.value === value;
    }

    get canAccess(): boolean {
        return this.requirement.isCompleted
    }

}
