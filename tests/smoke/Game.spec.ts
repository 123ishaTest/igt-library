import {IgtGame} from "@/ig-template/IgtGame";
import {IgtWallet} from "@/ig-template/features/wallet/IgtWallet";
import {IgtSettings} from "@/ig-template/features/settings/IgtSettings";
import {IgtRedeemableCodes} from "@/ig-template/features/codes/IgtRedeemableCodes";
import {IgtKeyItems} from "@/ig-template/features/key-items/IgtKeyItems";
import {IgtSpecialEvents} from "@/ig-template/features/special-events/IgtSpecialEvents";
import {IgtStatistics} from "@/ig-template/features/statistics/IgtStatistics";
import {IgtAchievements} from "@/ig-template/features/achievements";
import {IgtFeatures} from "@/ig-template/IgtFeatures";

class DummyGame extends IgtGame {
    features: IgtFeatures;

    constructor(features: IgtFeatures) {
        super();
        this.features = features;
    }

    protected readonly SAVE_KEY: string = 'dummy';
    protected readonly TICK_DURATION: number = 0.05;
}

/**
 * This smoke test starts the game and runs 100 game ticks.
 * It fails if any exceptions are thrown.
 */
describe('Game launch smoke test', () => {

    const game = new DummyGame({
        wallet: new IgtWallet(['money']),
        settings: new IgtSettings(),
        codes: new IgtRedeemableCodes(),
        keyItems: new IgtKeyItems(),
        specialEvents: new IgtSpecialEvents(),
        statistics: new IgtStatistics(),
        achievements: new IgtAchievements(),
    })
    test('smoke test', () => {
        expect(() => {
            game.initialize();
            game.load();
            game.start();

            for (let i = 0; i < 100; i++) {
                game.forceUpdate(0.5);
            }
        }).not.toThrow();
    });
});
