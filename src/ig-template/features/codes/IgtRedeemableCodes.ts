import {RedeemableCode} from "@/ig-template/features/codes/RedeemableCode";
import {IgtFeature} from "@/ig-template/features/IgtFeature";
import {RedeemableCodesSaveData} from "@/ig-template/features/codes/RedeemableCodesSaveData";

export class IgtRedeemableCodes extends IgtFeature {

    list: RedeemableCode[];

    constructor(saveKey: string = 'redeemable-codes') {
        super(saveKey)
        this.list = [];
    }

    /**
     * Returns the code if it was successfully redeemed, false if it was already redeemed, undefined otherwise.
     */
    enterCode(codeString: string): boolean | RedeemableCode | undefined {
        const hash = this.hash(codeString);

        const redeemableCode = this.list.find(c => {
            return c.hash === hash;
        });

        if (!redeemableCode) {
            return undefined;
        }
        if (redeemableCode.isRedeemed) {
            return false;
        }

        redeemableCode.redeem();
        return redeemableCode;
    }

    /**
     * Insecure hash, but should keep some of the nosy people out.
     * @param text
     */
    hash(text: string): number {
        let hash = 0, i, chr;
        if (text.length === 0) {
            return hash;
        }

        for (i = 0; i < text.length; i++) {
            chr = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }


    load(data: RedeemableCodesSaveData): void {
        if (!data?.list) {
            return;
        }

        data.list.forEach(id => {
            const foundCode = this.list.find(code => {
                return code.id === id;
            });

            if (foundCode) {
                foundCode.isRedeemed = true;
            }
        });
    }

    save(): RedeemableCodesSaveData {
        const list = this.list.filter(code => {
            return code.isRedeemed;
        }).map(code => {
            return code.id;
        })
        return new RedeemableCodesSaveData(list)
    }

}
