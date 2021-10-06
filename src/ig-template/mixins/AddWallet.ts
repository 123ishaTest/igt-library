import {IgtWallet} from "@/ig-template/features/wallet";
import {IgtAbstractUpgrade} from "@/ig-template/tools/upgrades";
import {FeatureConstructor} from "@/ig-template/mixins/Mixins";

export function AddWallet<TBase extends FeatureConstructor>(Base: TBase) {
    abstract class AddWallet extends Base {
        _wallet: IgtWallet = undefined as unknown as IgtWallet;

        buyUpgrade(upgrade: IgtAbstractUpgrade): boolean {
            if (!this._wallet) {
                console.warn("Wallet not found, are you sure it is initialized?")
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
    }
    return AddWallet;
}
