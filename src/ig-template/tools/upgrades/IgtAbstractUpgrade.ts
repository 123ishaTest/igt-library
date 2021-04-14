/**
 * Generic upgrade class
 */
import {Saveable} from "@/ig-template/tools/saving/Saveable";
import {UpgradeType} from "@/ig-template/tools/upgrades/UpgradeType";
import {UpgradeId} from "@/ig-template/tools/upgrades/UpgradeId";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {UpgradeSaveData} from "@/ig-template/tools/upgrades/UpgradeSaveData";
import {IgtWallet} from "@/ig-template/features/wallet/IgtWallet";

export abstract class IgtAbstractUpgrade implements Saveable {
    id: UpgradeId;
    type: UpgradeType;
    displayName: string;
    maxLevel: number;
    level: number;

    protected constructor(id: UpgradeId, type: UpgradeType, displayName: string, maxLevel: number) {
        this.id = id;
        this.type = type;
        this.displayName = displayName;
        this.maxLevel = maxLevel;
        this.level = 0;

        this.saveKey = this.id;
    }

    abstract getCost(): Currency;

    getBonus(): number {
        return this.getBonusForLevel(this.level);
    }

    abstract getBonusForLevel(level: number): number;

    getUpgradeBonus(): number {
        if (!this.isMaxLevel()) {
            return this.getBonusForLevel(this.level + 1) - this.getBonusForLevel(this.level);
        }
        return 0;
    }

    isMaxLevel(): boolean {
        return this.level >= this.maxLevel;
    }

    canAfford(wallet: IgtWallet): boolean {
        return wallet.hasCurrency(this.getCost());
    }

    // Override in subclass when other requirements exist.
    canBuy(wallet: IgtWallet): boolean {
        return this.level < this.maxLevel && this.canAfford(wallet);
    }

    buy(wallet: IgtWallet): boolean {
        if (!this.canBuy(wallet)) {
            return false;
        }

        wallet.loseCurrency(this.getCost());
        this.levelUp();
        return true;
    }

    levelUp(): void {
        this.level = this.level + 1;
    }


    // Save logic
    saveKey: string;

    load(data: UpgradeSaveData): void {
        this.level = data.level;
    }

    save(): UpgradeSaveData {
        return {
            'id': this.id,
            'level': this.level,
        }
    }

}
