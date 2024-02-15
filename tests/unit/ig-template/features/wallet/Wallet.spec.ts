import {IgtWallet} from "@/ig-template/features/wallet/IgtWallet";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";
import {Currency} from "@/ig-template/features/wallet/Currency";
import {WalletSaveData} from "@/ig-template/features/wallet/WalletSaveData";


describe('Wallet', () => {

    const money: CurrencyType = 'money'
    const secondary: CurrencyType = 'secondary'
    let moneyWallet: IgtWallet;

    beforeEach(() => {
        moneyWallet = new IgtWallet([money]);
    });

    test('example usage', () => {
        const wallet = new IgtWallet([money, secondary]);

        wallet.gainCurrency(new Currency(10, money));

        expect(wallet.getAmount(money)).toBe(10);

        wallet.setCurrencyMultiplier(2, money);
        wallet.gainCurrency(new Currency(10, money));
        expect(wallet.getAmount(money)).toBe(30);

        const couldAffordFalse = wallet.payIfPossible(new Currency(31, money));
        expect(couldAffordFalse).toBeFalsy();
        const couldAffordTrue = wallet.payIfPossible(new Currency(25, money));
        expect(couldAffordTrue).toBeTruthy();

        expect(wallet.getCurrencyMultiplier(secondary)).toBe(1);
        expect(wallet.getAmount(money)).toBe(5);

    });

    test('moneyWallet instantiates properly', () => {
        // Act

        // Assert
        expect(moneyWallet.getAmount(money)).toBe(0)
    });

    test('supported currencies', () => {
        // Act
        const supportsMoney = moneyWallet.supportsCurrencyType(money);
        const supportsSecondary = moneyWallet.supportsCurrencyType(secondary);

        // Assert
        expect(supportsMoney).toBeTruthy();
        expect(supportsSecondary).toBeFalsy();
    });


    test('gaining money', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(1, money));
        const actualMoney = moneyWallet.getAmount(money);

        // Assert
        expect(actualMoney).toBe(1);
    });

    test('gain multiple of the same currencies', () => {
        // Act
        moneyWallet.gainMultipleCurrencies([new Currency(1, money), new Currency(2, money)]);
        const actualMoney = moneyWallet.getAmount(money);

        // Assert
        expect(actualMoney).toBe(3);
    });

    test('gain multiple of different currencies', () => {
        // Act
        const wallet = new IgtWallet([money, secondary]);
        wallet.gainMultipleCurrencies([new Currency(1, money), new Currency(2, secondary)]);
        const actualMoney = wallet.getAmount(money);
        const actualSecondary = wallet.getAmount(secondary);

        // Assert
        expect(actualMoney).toBe(1);
        expect(actualSecondary).toBe(2);
    });

    test('gaining negative amount not possible', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(-1, money));
        const actualMoney = moneyWallet.getAmount(money);

        // Assert
        expect(actualMoney).toBe(0);
    });

    test('gaining NaN not possible', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(NaN, money));
        const actualMoney = moneyWallet.getAmount(money);

        // Assert
        expect(actualMoney).toBe(0);
    });

    test('multiplier', () => {
        // Act
        moneyWallet.setCurrencyMultiplier(2, money);
        moneyWallet.gainCurrency(new Currency(1, money));
        const actualMoney = moneyWallet.getAmount(money);

        // Assert
        expect(actualMoney).toBe(2);
    });

    test('negative multiplier not possible', () => {
        // Act
        moneyWallet.setCurrencyMultiplier(-1, money);
        moneyWallet.gainCurrency(new Currency(1, money));
        const actualMoney = moneyWallet.getAmount(money);

        // Assert
        expect(actualMoney).toBe(1);
    });

    test('has currency', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, money));

        // Assert
        expect(moneyWallet.hasCurrency(new Currency(10, money))).toBeTruthy();
        expect(moneyWallet.hasCurrency(new Currency(11, money))).toBeFalsy();
    });

    test('lose currency', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, money));
        moneyWallet.loseCurrency(new Currency(4, money))

        // Assert
        expect(moneyWallet.getAmount(money)).toBe(6);
    });

    test('cannot lose invalid currency', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, money));
        moneyWallet.loseCurrency(new Currency(-1, money))

        // Assert
        expect(moneyWallet.getAmount(money)).toBe(10);
    });

    test('pay if possible', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, money));
        const paid = moneyWallet.payIfPossible(new Currency(5, money))

        // Assert
        expect(moneyWallet.getAmount(money)).toBe(5);
        expect(paid).toBeTruthy();
    });

    test('pay if not possible', () => {
        // Act
        moneyWallet.gainCurrency(new Currency(10, money));
        const paid = moneyWallet.payIfPossible(new Currency(15, money))

        // Assert
        expect(moneyWallet.getAmount(money)).toBe(10);
        expect(paid).toBeFalsy();
    });

    test('get amount for unsupported currency', () => {
        // Assert
        expect(moneyWallet.getAmount(secondary)).toBe(0);
    });

    test('get currency multiplier for unsupported currency', () => {
        // Assert
        expect(moneyWallet.getCurrencyMultiplier(secondary)).toBe(1);
    });

    test('has currency for unsupported currency', () => {
        // Assert
        expect(moneyWallet.hasCurrency(new Currency(0, secondary))).toBeFalsy();
    });

    test('can access', () => {
        // Assert
        expect(moneyWallet.canAccess()).toBeTruthy();
    });

    test('save', () => {
        // Arrange
        const expectedSaveData: WalletSaveData = {
            currencies: [
                {type: 'money', amount: 10},
                {type: 'secondary', amount: 8}
            ]
        };
        const wallet = new IgtWallet([money, secondary]);

        // Act
        wallet.gainCurrency(new Currency(10, money));
        wallet.gainCurrency(new Currency(8, secondary));
        const actualSaveData = wallet.save();

        // Assert
        expect(actualSaveData).toEqual(expectedSaveData);
    });

    test('load', () => {
        // Arrange
        const saveData: WalletSaveData = {
            currencies: [
                {type: 'money', amount: 10},
                {type: 'secondary', amount: 8}
            ]
        };
        const wallet = new IgtWallet([money, secondary]);

        // Act
        wallet.load(saveData);

        // Assert
        expect(wallet.getAmount(money)).toEqual(10);
        expect(wallet.getAmount(secondary)).toEqual(8);
    });

    test('load empty data', () => {
        // Arrange
        const wallet = new IgtWallet([money, secondary]);

        // Act
        wallet.load({} as WalletSaveData);

        // Assert
        expect(wallet.getAmount(money)).toEqual(0);
        expect(wallet.getAmount(secondary)).toEqual(0);
    });

    test('on currency gain', () => {
        // Arrange
        expect.assertions(2);

        moneyWallet.onCurrencyGain.subscribe(currency => {
            expect(currency.amount).toBe(10);
            expect(currency.type).toBe(money);
        });

        // Act
        moneyWallet.gainCurrency(new Currency(10, money));
    });

});
