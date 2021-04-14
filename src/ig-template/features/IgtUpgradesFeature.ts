import {IgtAbstractUpgrade} from "@/ig-template/tools/upgrades/IgtAbstractUpgrade";
import {IgtWallet} from "@/ig-template/features/wallet/IgtWallet";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {IgtFeature} from "@/ig-template/features/IgtFeature";
import {IgtFeatures} from "@/ig-template/IgtFeatures";
import {UpgradesFeatureSaveData} from "@/ig-template/tools/saving/UpgradesFeatureSaveData";

/**
 * An abstract class for all features that need to buy Upgrades
 */
export abstract class IgtUpgradesFeature extends IgtFeature {

    _wallet: IgtWallet = null as unknown as IgtWallet;
    upgrades: IgtAbstractUpgrade[];

    protected constructor(saveKey: string, upgrades: IgtAbstractUpgrade[] = []) {
        super(saveKey);
        this.upgrades = upgrades;
    }

    /**
     * When overriding, make sure to call super.initialize() or you won't have access to the _wallet
     */
    initialize(features: IgtFeatures): void {
        if (!features.wallet) {
            throw new Error("The IgtUpgradeFeature (or subclasses), make sure it's instantiated and added to IgtFeatures")
        }
        this._wallet = features.wallet;
    }

    getUpgrade(id: UpgradeId): IgtAbstractUpgrade | undefined {
        return this.upgrades.find(upgrade => {
            return upgrade.id === id;
        });
    }

    buyUpgrade(upgrade: IgtAbstractUpgrade): boolean {
        if (!this._wallet) {
            console.warn("IgtWallet not found, are you sure it is initialized?")
            return false;
        }
        if (!upgrade.canBuy(this._wallet)) {
            return false;
        }
        return upgrade.buy(this._wallet);
    }

    canAfford(upgrade: IgtAbstractUpgrade): boolean {
        return upgrade.canAfford(this._wallet);
    }

    /**
     * IMPORTANT: Make sure to call super().load(data) when overriding to also load upgrades.
     */
    load(data: UpgradesFeatureSaveData): void {
        data.upgrades?.forEach(upgradeSaveData => {
            this.getUpgrade(upgradeSaveData.id)?.load(upgradeSaveData);
        });
    }

    /**
     * IMPORTANT: Make sure to call super().save() when overriding to also save upgrades.
     */
    save(): UpgradesFeatureSaveData {
        return {
            upgrades: this.upgrades.map(upgrade => {
                return upgrade.save();
            })
        }
    }
}
