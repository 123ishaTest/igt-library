import {GameState} from "./GameState";
import {LocalStorage} from "@/ig-template/tools/saving/LocalStorage";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {IgtFeatures} from "@/ig-template/IgtFeatures";
import {IgtFeature} from "@/ig-template/features/IgtFeature";
import {DeveloperPanel} from "@/ig-template/developer-panel/DeveloperPanel";
import {DeveloperPanelTab} from "@/ig-template/developer-panel/DeveloperPanelTab";
import {FunctionField} from "@/ig-template/developer-panel/fields/FunctionField";
import {DisplayField} from "@/ig-template/developer-panel/fields/DisplayField";
import {ChoiceField} from "@/ig-template/developer-panel/fields/ChoiceField";
import {IgtSaveEncoder} from "@/ig-template/tools/saving";
import {DefaultSaveEncoder} from "@/ig-template/tools/saving/DefaultSaveEncoder";

export abstract class IgtGame {
    protected _tickInterval: NodeJS.Timeout | null = null;

    /**
     * Object with registered features. If you want them as a list use this.featureList
     */
    public abstract features: IgtFeatures;

    public state: GameState;

    /**
     * The time between game ticks
     * 0.05 is usually good enough at 20 ticks/s
     */
    protected abstract readonly TICK_DURATION: number;

    /**
     * How often the game should be saved
     */
    protected readonly SAVE_INTERVAL: number = 30;
    protected _nextSave: number;
    protected saveEncoder: IgtSaveEncoder;

    protected gameSpeed: number = 1;
    protected _lastUpdate: number = 0;

    /**
     * Make sure this key is unique to your game.
     * Otherwise you might run into loading conflicts when multiple games are hosted on the same domain (such as <username.github.io/game)
     */
    protected abstract readonly SAVE_KEY: string;

    protected constructor() {
        this.state = GameState.Launching;
        this._nextSave = this.SAVE_INTERVAL;
        this.saveEncoder = new DefaultSaveEncoder();
    }

    public getDeveloperPanel(): DeveloperPanel {
        // Start with play buttons for the game
        const tabs: DeveloperPanelTab[] = [
            new DeveloperPanelTab('Game', [
                new DisplayField('state', 'State').setObject(this),
                new ChoiceField('gameSpeed', [
                    ['0.5x', 0.5],
                    ['1x', 1],
                    ['2x', 2],
                    ['4x', 4],
                ], 'Game speed').setObject(this),
                new FunctionField(() => {
                    this.start()
                }, 'Start').setCssClass('btn-green'),
                new FunctionField(() => {
                    this.pause()
                }, 'Pause').setCssClass('btn-blue'),
                new FunctionField(() => {
                    this.resume()
                }, 'Resume').setCssClass('btn-green'),
                new FunctionField(() => {
                    this.stop()
                }, 'Stop').setCssClass('btn-red'),
            ]),

        ];


        for (const feature of this.featureList) {
            const fields = feature.getDeveloperPanelFields();

            // Inject the feature into the field.
            for (const field of fields) {
                field.setObject(feature);
            }

            const tab = new DeveloperPanelTab(feature.saveKey, fields)
            if (!tab.isEmpty()) {
                tabs.push(tab)
            }
        }
        return new DeveloperPanel(tabs);
    }

    /**
     * Force update all features for testing purposes
     */
    public forceUpdate(delta: number): void {
        for (const feature of this.featureList) {
            feature.update(delta)
        }
    }

    /**
     * Update all features
     */
    public update(): void {
        const now = new Date().getTime() / 1000;
        const timeDifference = Math.max(0, now - this._lastUpdate);

        if (this.state != GameState.Playing) {
            return;
        }

        const delta = timeDifference * this.gameSpeed;
        for (const feature of this.featureList) {
            feature.update(delta)
        }

        this._lastUpdate = now;
        this._nextSave -= delta;
        if (this._nextSave <= 0) {
            this.save();
            this._nextSave = this.SAVE_INTERVAL;
        }
    }

    public getTotalCurrencyMultiplier(type: CurrencyType): number {
        let multiplier = 1;
        for (const feature of this.featureList) {
            multiplier *= feature.getTotalCurrencyMultiplier(type);
        }
        return multiplier;
    }

    /**
     * Initialize all features
     */
    public initialize(): void {
        for (const feature of this.featureList) {
            feature.initialize(this.features);
        }
    }

    /**
     * Start the main update loop
     */
    public start(): void {
        if (this.state !== GameState.Stopped && this.state !== GameState.Launching) {
            this.printStateWarning("Cannot start the game twice.");
            return;
        }

        for (const feature of this.featureList) {
            feature.start();
        }

        this._nextSave = this.SAVE_INTERVAL;
        this._lastUpdate = new Date().getTime() / 1000;
        this._tickInterval = setInterval(() => this.update(), this.TICK_DURATION * 1000);

        this.state = GameState.Playing;
        console.debug("Game Started");
    }

    public pause(): void {
        if (this.state !== GameState.Playing) {
            this.printStateWarning("Cannot pause the game if we're not playing.");
            return;
        }
        if (this._tickInterval) {
            clearInterval(this._tickInterval);
        }

        this.state = GameState.Paused;
        console.debug("Game Paused");
    }


    public resume(): void {
        if (this.state !== GameState.Paused) {
            this.printStateWarning("Cannot resume the game if we're not paused.");
            return;
        }

        this._lastUpdate = new Date().getTime() / 1000;
        this._tickInterval = setInterval(() => this.update(), this.TICK_DURATION * 1000);

        this.state = GameState.Playing;
        console.debug("Game Resumed");
    }

    /**
     * Stop the main update loop
     */
    public stop(): void {
        if (this.state === GameState.Stopped) {
            this.printStateWarning("Cannot stop the game if we're already stopped.");
            return;
        }
        if (this._tickInterval) {
            clearInterval(this._tickInterval);
        }

        for (const feature of this.featureList) {
            feature.stop();
        }

        this.state = GameState.Stopped;
        console.debug("Stopped");
    }

    /**
     * Recursively save all registered features
     */
    public save(): void {
        const res: Record<string, unknown> = {};
        for (const feature of this.featureList) {
            res[feature.saveKey] = feature.save()
        }
        LocalStorage.store(this.SAVE_KEY, res, this.saveEncoder)
    }

    /**
     * Delete the locally stored save
     */
    public deleteSave(): void {
        LocalStorage.delete(this.SAVE_KEY);
    }

    /**
     * Recursively load all registered features
     */
    public load(): void {
        const saveData = LocalStorage.get(this.SAVE_KEY, this.saveEncoder);
        if (saveData == null) {
            return;
        }
        for (const feature of this.featureList) {
            const featureSaveData: Record<string, unknown> = saveData[feature.saveKey] as Record<string, unknown>;
            if (featureSaveData == null) {
                continue;
            }
            feature.load(featureSaveData);
        }
    }

    protected printStateWarning(reason: string): void {
        console.warn(`Current state = ${this.state}.`, reason);
    }

    protected get featureList(): IgtFeature[] {
        return Object.values(this.features) as IgtFeature[];
    }

}
