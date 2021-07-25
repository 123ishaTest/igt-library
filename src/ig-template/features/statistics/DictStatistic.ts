import {AbstractStatistic} from "@/ig-template/features/statistics/AbstractStatistic";
import {StatisticId} from "@/ig-template/features/statistics/StatisticId";

export class DictStatistic extends AbstractStatistic {
    value: {[key: string]: number};

    constructor(id: StatisticId, description: string, value: {[key: string]: number}) {
        super(id, description);
        this.value = value;
    }

}