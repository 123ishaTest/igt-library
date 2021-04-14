import {Currency} from "@/ig-template/features/wallet/Currency";
import {CurrencyType} from "@/ig-template/features/wallet/CurrencyType";


describe('Currency', () => {

    const money: CurrencyType = 'money'

    test('constructor', () => {
        // Arrange
        const currency = new Currency(3, money);

        // Act

        // Assert
        expect(currency.amount).toBe(3);
        expect(currency.type).toBe(money);
    });

});
