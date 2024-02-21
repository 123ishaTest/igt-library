import { describe, expect, test } from 'vitest';

import { IgtGame } from '@/ig-template/IgtGame';
import { IgtWallet } from '@/ig-template/features/wallet/IgtWallet';
import { IgtSettings } from '@/ig-template/features/settings/IgtSettings';
import { IgtRedeemableCodes } from '@/ig-template/features/codes/IgtRedeemableCodes';
import { IgtKeyItems } from '@/ig-template/features/key-items/IgtKeyItems';
import { IgtSpecialEvents } from '@/ig-template/features/special-events/IgtSpecialEvents';
import { IgtStatistics } from '@/ig-template/features/statistics/IgtStatistics';
import { IgtAchievements } from '@/ig-template/features/achievements';
import { IgtFeatures } from '@/ig-template/IgtFeatures';

class DummyGame extends IgtGame {
  features: IgtFeatures;

  constructor(features: IgtFeatures) {
    super();
    this.features = features;
  }

  protected readonly SAVE_KEY: string = 'dummy';
  protected readonly TICK_DURATION: number = 0.05;

  public get tickDuration(): number {
    return this.TICK_DURATION;
  }
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
  });

  const ticks: number = 100;

  test('smoke test', () => {
    let tickCount = 0
    game.onTick.subscribe((s: IgtGame, a: number) => {
      tickCount++;
      console.log('Tick', a)
      expect(a).toEqual(game.tickDuration);
    });

    expect(() => {
      game.initialize();
      game.load();
      game.start();

      for (let i = 0; i < ticks; i++) {
        game.forceUpdate(game.tickDuration);
      }

      expect(tickCount).toBe(ticks);
    }).not.toThrow();
  });
});
