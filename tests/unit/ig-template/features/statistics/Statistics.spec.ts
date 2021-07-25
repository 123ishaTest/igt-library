import {NumberStatistic} from "@/ig-template/features/statistics/NumberStatistic";
import {StatisticId} from "@/ig-template/features/statistics/StatisticId";
import {IgtStatistics} from "@/ig-template/features/statistics/IgtStatistics";
import {ArrayStatistic} from "@/ig-template/features/statistics/ArrayStatistic";
import { DictStatistic } from "@/ig-template/features/statistics/DictStatistic";


describe('Number Statistic', () => {
    const statistics = new IgtStatistics();
    const id = 'example' as StatisticId;
    const arrayId = 'array' as StatisticId;
    const dictId = 'dict' as StatisticId;
    const stat = new NumberStatistic(id, 'get money', 0);
    const array = new ArrayStatistic(arrayId, 'array stat', [0, 0, 0]);
    const dict = new DictStatistic(dictId, 'dict stat', {'stat1': 0, 'stat2': 0, 'stat3': 0});
    statistics.registerStatistic(stat);
    const arrayStat = statistics.registerStatistic(array);
    const dictStat = statistics.registerStatistic(dict);

    beforeEach(() => {
        stat.value = 0;
        array.value = [0, 0, 0];
        dict.value = {'stat1': 0, 'stat2': 0, 'stat3': 0};
    })

    test('happy path', () => {
        // Arrange
        statistics.incrementNumberStatistic(id, 10);
        statistics.incrementNumberStatistic(id);

        // Assert
        expect(statistics.getStatistic(id)?.value).toBe(11);
    });

    test('incorrect get', () => {
        // Assert
        expect(statistics.getStatistic('wrong-id' as StatisticId)).toBeNull();
    });

    test('array statistic', () => {
        // Assert
        statistics.incrementArrayStatistic(arrayStat.id, 1, 3)
        expect(arrayStat.value[1]).toBe(3);
    });

    test('dict statistic', () => {
        // Assert
        statistics.incrementDictStatistic(dictStat.id, 'stat1', 3);
        expect(dictStat.value['stat1']).toBe(3);
    });

    test('save and load', () => {
        // Arrange
        statistics.incrementNumberStatistic(id, 20);
        statistics.incrementArrayStatistic(arrayId, 1, 4);
        statistics.incrementDictStatistic(dictId, 'stat2', 10);
        const save = statistics.save();

        statistics.list[id].value = 0;
        statistics.list[arrayId].value = [0, 0, 0];
        statistics.list[dictId].value = {};

        statistics.load(save)
        // Assert
        expect(statistics.getStatistic(id)?.value).toBe(20);
        const arrayVal = (statistics.getStatistic(arrayId)?.value as number[])[1];
        expect(arrayVal).toBe(4);
        const dictVal = (statistics.getStatistic(dictId)?.value as any)['stat2'];
        expect(dictVal).toBe(10);
    });

});
