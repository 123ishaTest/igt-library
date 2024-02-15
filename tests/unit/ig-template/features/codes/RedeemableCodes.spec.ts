import {IgtRedeemableCodes} from "@/ig-template/features/codes/IgtRedeemableCodes";
import {RedeemableCode} from "@/ig-template/features/codes/RedeemableCode";
import {RedeemableCodeId} from "@/ig-template/features/codes/RedeemableCodeId";


describe('Redeemable Codes', () => {
    const id = "example-code" as RedeemableCodeId
    const plainText = "DUMMY";
    let code: RedeemableCode;
    let repeatableCode: RedeemableCode;

    beforeEach(() => {
        code = new RedeemableCode(id, 'Example code', 65408136, () => {
            // Empty
        })
        repeatableCode = new RedeemableCode(id, 'Example code', 65408136, () => {
            // Empty
        }, true)
    })


    test('regular usage', () => {
        // Arrange
        const redeemableCodes = new IgtRedeemableCodes();
        redeemableCodes.list.push(code)

        const redeemedCode = redeemableCodes.enterCode(plainText);

        expect(redeemedCode).toStrictEqual(code);
    });

    test('non existing code', () => {
        // Arrange
        const redeemableCodes = new IgtRedeemableCodes();
        redeemableCodes.list.push(code)

        const redeemedCode = redeemableCodes.enterCode("non-existing");

        expect(redeemedCode).toBeUndefined();
    });

    test('redeeming code twice', () => {
        // Arrange
        const redeemableCodes = new IgtRedeemableCodes();
        redeemableCodes.list.push(code)

        redeemableCodes.enterCode("DUMMY");

        const redeemedDirectly = code.redeem();
        const redeemedCode = redeemableCodes.enterCode("DUMMY");

        expect(redeemedCode).toBe(false);
        expect(redeemedDirectly).toBe(false);
    });


    test('save and load', () => {
        // Arrange
        const redeemableCodes = new IgtRedeemableCodes();
        redeemableCodes.list.push(code);

        const saveDataEmpty = redeemableCodes.save();

        expect(saveDataEmpty.list).toHaveLength(0);
        redeemableCodes.enterCode("DUMMY");

        const saveData = redeemableCodes.save();

        expect(saveData.list).toHaveLength(1)

        const newRedeemableCodes = new IgtRedeemableCodes();
        const newCode = new RedeemableCode(id, 'Example code', 65408136, () => {
            // Empty
        })
        newRedeemableCodes.list.push(newCode);
        newRedeemableCodes.load(saveData);
        expect(newCode.isRedeemed).toBe(true);
    });

    test('redeeming repeatable code twice', () => {
        // Arrange
        const redeemableCodes = new IgtRedeemableCodes();
        redeemableCodes.list.push(repeatableCode)

        redeemableCodes.enterCode("DUMMY");

        const redeemedCode = redeemableCodes.enterCode("DUMMY");
        const redeemedSecondTime = redeemableCodes.enterCode("DUMMY");

        expect(redeemedCode).toBeTruthy();
        expect(redeemedSecondTime).toBeTruthy();
    });

    test('hash with empty string returns 0', () => {
        // Arrange
        const redeemableCodes = new IgtRedeemableCodes();

        // Act
        const hash = redeemableCodes.hash('');

        // Assert
        expect(hash).toBe(0);
    });

    test('load sets isRedeemed to true for matching code IDs', () => {
        // Arrange
        const redeemableCodes = new IgtRedeemableCodes();
        const code1 = code
        const code2 = new RedeemableCode(id, 'Second code', 65408136, () => {
                // Empty
            })
        redeemableCodes.list = [code1, code2];

        const data = {
            list: [code1.id]
        };

        // Act
        redeemableCodes.load(data);

        // Assert
        const codeList = redeemableCodes.list;
        expect(codeList[0].isRedeemed).toBe(true);
        expect(codeList[1].isRedeemed).toBe(false);
    });

    test('load returns nothing if no data is provided', () => {
        // Arrange
        const redeemableCodes = new IgtRedeemableCodes();
        const emptySaveData = redeemableCodes.save();

        // Act
        redeemableCodes.load(emptySaveData);

        // Assert
        expect(redeemableCodes.list).toHaveLength(0);
    });
});
