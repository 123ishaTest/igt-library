/* eslint-disable @typescript-eslint/no-unused-vars */
import {Saveable} from "@/ig-template/tools/saving/Saveable";
import {SaveData} from "@/ig-template/tools/saving/SaveData";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {IgtFeatures} from "@/ig-template/IgtFeatures";
import {AbstractField} from "@/ig-template/developer-panel/fields/AbstractField";

/**
 * An abstract class that all features should extend from.
 */
export abstract class IgtFeature implements Saveable {

    /**
     * Initialize all feature attributes.
     * Note that you should not assume other features exist already here
     * @param saveKey
     */
    public constructor(saveKey: string) {
        this.saveKey = saveKey;
    }

    /**
     * Called in dev mode, decides which fields to show in the developer panel.
     */
    getDeveloperPanelFields(): AbstractField[] {
        return []
    }

    /**
     * Called after all features are created.
     * This is where your main configuration takes place.
     */
    initialize(features: IgtFeatures): void {
        // This method intentionally left blank
    }

    /**
     * Runs when the game gets started. Can be run multiple times if the player can stop the game
     */
    start(): void {
        // This method intentionally left blank
    }

    /**
     * Runs when the game gets stopped. NOT when the game closes
     */
    stop(): void {
        // This method intentionally left blank
    }

    /**
     * Default false to avoid not implementing the proper restrictions
     */
    canAccess(): boolean {
        return false;
    }

    /**
     * Override in features if specified
     * IMPORTANT: Make sure to always return 1 as the default
     */
    getTotalCurrencyMultiplier(type: CurrencyType): number {
        return 1;
    }

    /**
     * Gets called every Game.TICK_DURATION
     * @param delta time since last update
     */
    update(delta: number): void {
        // Override in subclass if needed
    }

    // Saving logic
    saveKey: string;

    abstract load(data: SaveData): void;

    abstract save(): SaveData;


}
