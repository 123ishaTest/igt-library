import { Achievement } from '@/ig-template/features/achievements/Achievement';
import { AchievementId } from '@/ig-template/features/achievements/AchievementId';
import { IgtFeature } from '@/ig-template/features/IgtFeature';
import { AchievementsSaveData } from '@/ig-template/features/achievements/AchievementSaveData';
import { ISimpleEvent, SimpleEventDispatcher } from 'strongly-typed-events';

export class IgtAchievements extends IgtFeature {
  list: Record<AchievementId, Achievement>;

  // Delay between checking for achievements
  protected readonly ACHIEVEMENT_CHECK_TIME: number = 2.0;
  protected _checkCounter: number = 0;

  protected _onUnlock = new SimpleEventDispatcher<Achievement>();

  /**
   * Emitted whenever an achievement is unlocked.
   */
  public get onUnlock(): ISimpleEvent<Achievement> {
    return this._onUnlock.asEvent();
  }

  constructor(saveKey: string = 'achievements') {
    super(saveKey);
    this.list = {} as Record<AchievementId, Achievement>;
  }

  update(delta: number): void {
    this._checkCounter += delta;
    if (this._checkCounter >= this.ACHIEVEMENT_CHECK_TIME) {
      this.checkForAchievementsCompleted();
      this._checkCounter = 0;
    }
  }

  public checkForAchievementsCompleted(): void {
    for (const key in this.list) {
      const achievement = this.list[key];
      if (achievement.requirementsCompleted()) {
        const isJustUnlocked = achievement.unlock();
        if (isJustUnlocked) {
          this._onUnlock.dispatch(achievement);
        }
      }
    }
  }

  public registerAchievement<T extends Achievement>(achievement: T): T {
    this.list[achievement.key] = achievement;
    return achievement;
  }

  public getAchievement(key: AchievementId): Achievement | null {
    if (!this.hasAchievement(key)) {
      console.warn(`Could not find achievement with key ${key}`);

      return null;
    } else {
      return this.list[key];
    }
  }

  protected hasAchievement(key: AchievementId): boolean {
    return key in this.list;
  }

  load(data: AchievementsSaveData): void {
    for (const key of data.list) {
      const achievement = this.getAchievement(key);
      if (achievement !== null) {
        achievement.unlocked = true;
      }
    }
  }

  save(): AchievementsSaveData {
    const data = new AchievementsSaveData();
    for (const key in this.list) {
      if (this.list[key].unlocked) {
        data.addAchievement(key);
      }
    }
    return data;
  }
}
