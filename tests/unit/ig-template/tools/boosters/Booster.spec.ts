import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {IgtWallet} from "@/ig-template/features/wallet/IgtWallet";
import {Booster} from "@/ig-template/tools/boosters/Booster";
import {BoosterTier} from "@/ig-template/tools/boosters/BoosterTier";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {ImpossibleRequirement} from "@/ig-template/tools/requirements/ImpossibleRequirement";

describe('Booster', () => {
    const money: CurrencyType = 'money'

    const wallet = new IgtWallet([money])
    let booster: Booster;
    beforeEach(() => {
        // Reset wallet
        wallet.loseCurrency(new Currency(wallet.getAmount(money), money));
        wallet.gainCurrency(new Currency(10000, money));

        booster = new Booster("Example", [
            new BoosterTier([new Currency(10, money)], 1.5),
            new BoosterTier([new Currency(100, money)], 2, "2x"),
            new BoosterTier([new Currency(1000, money)], 3, "3x"),
        ], wallet, 1);
    })

    test('Normal usage', () => {
        booster.selectTier(2);
        const bonus = booster.perform(3);

        expect(wallet.getAmount(money)).toBe(7000);
        expect(booster.currentTierIndex).toBe(2);
        expect(bonus).toBe(3);
        expect(booster.bonus).toBe(3);
    });

    test('Normal usage, no money', () => {
        wallet.loseCurrency(new Currency(wallet.getAmount(money), money));
        booster.selectTier(2);
        booster.perform(1);
        booster.perform(1);
        booster.perform(1);

        expect(booster.currentTierIndex).toBe(-1);
        expect(booster.bonus).toBe(1);
    });


    test('Requirement', () => {
        const booster = new Booster("Example", [
            new BoosterTier([new Currency(10, money)], 1.5, "1.5x"),
            new BoosterTier([new Currency(100, money)], 2, "2x", new ImpossibleRequirement()),
            new BoosterTier([new Currency(1000, money)], 3, "3x"),
        ], wallet, 1);

        booster.selectTier(1);

        expect(booster.currentTierIndex).toBe(-1);
    });

    test('No wallet throws error', () => {
        const booster = new Booster("", [], null as unknown as IgtWallet, 1);
        expect(() => {
            booster.perform(1);
        }).toThrow();
    });

});
