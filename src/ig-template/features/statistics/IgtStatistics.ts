/**
 * Statistics class to keep track of increasing numbers
 */
import {StatisticId} from "@/ig-template/features/statistics/StatisticId";
import {NumberStatistic} from "@/ig-template/features/statistics/NumberStatistic";
import {IgtFeature} from "@/ig-template/features/IgtFeature";
import {AbstractStatistic} from "@/ig-template/features/statistics/AbstractStatistic";
import {StatisticsSaveData} from "@/ig-template/features/statistics/StatisticsSaveData";
import {ArrayStatistic} from "@/ig-template/features/statistics/ArrayStatistic";
import {DictStatistic} from "@/ig-template/features/statistics/DictStatistic";

export class IgtStatistics extends IgtFeature {

    list: Record<StatisticId, AbstractStatistic>

    constructor(saveKey: string = "statistics") {
        super(saveKey);
        this.list = {} as Record<StatisticId, AbstractStatistic>;
    }

    incrementNumberStatistic(id: StatisticId, amount = 1): void {
        if (!this.hasStatistic(id)) {
            console.warn(`Could not find statistic with id ${id}`)
            return;
        }
        const statistic = this.list[id];
        if (!(statistic instanceof NumberStatistic)) {
            console.warn(`Trying to treat ${id} as NumberStatistic but it's not.`);
            return;
        }
        statistic.value += amount;
    }

    incrementArrayStatistic(id: StatisticId, index: number, amount = 1): void {
        if (!this.hasStatistic(id)) {
            console.warn(`Could not find statistic with id ${id}`)
            return;
        }
        const statistic = this.list[id];
        if (!(statistic instanceof ArrayStatistic)) {
            console.warn(`Trying to treat ${id} as ArrayStatistic but it's not.`);
            return;
        }
        const newValue = statistic.value[index] + amount;
        statistic.value.splice(index, 1, newValue);
    }

    incrementDictStatistic(id: StatisticId, key: string, amount = 1): void {
        if (!this.hasStatistic(id)) {
            console.warn(`Could not find statistic with id ${id}`)
            return;
        }
        const statistic = this.list[id];
        if (!(statistic instanceof DictStatistic)) {
            console.warn(`Trying to treat ${id} as DictStatistic but it's not.`);
            return;
        }
        statistic.value[key] += amount;
    }

    public getStatistic(id: StatisticId): AbstractStatistic | null {
        if (!this.hasStatistic(id)) {
            console.warn(`Could not find statistic with id ${id}`)
            return null;
        } else {
            return this.list[id];
        }
    }

    protected hasStatistic(id: StatisticId): boolean {
        return id in this.list
    }

    public registerStatistic<T extends AbstractStatistic>(statistic: T): T {
        this.list[statistic.id] = statistic;
        return statistic;
    }

    load(data: StatisticsSaveData): void {
        for (const id in data.list) {
            if (Object.prototype.hasOwnProperty.call(data.list, id)) {
                if (this.hasStatistic(id)) {
                    this.list[id].value = data.list[id];
                } else {
                    console.warn(`Could not load statistic ${id}`)
                }
            }
        }
    }


    save(): StatisticsSaveData {
        const data = new StatisticsSaveData();
        for (const id in this.list) {
            data.addStatistic(id, this.list[id].value);
        }
        return data;
    }

}
