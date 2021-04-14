import {RedeemableCodeId} from "@/ig-template/features/codes/RedeemableCodeId";

export class RedeemableCode {
    id: RedeemableCodeId;
    description: string;
    hash: number;
    isRedeemed: boolean;

    // Repeatable
    isRepeatable: boolean;
    protected readonly rewardFunction: () => void;

    constructor(id: RedeemableCodeId, description: string, hash: number, rewardFunction: () => void, isRepeatable: boolean = false) {
        this.id = id;
        this.description = description;
        this.hash = hash;
        this.rewardFunction = rewardFunction;
        this.isRedeemed = false;
        this.isRepeatable = isRepeatable;
    }

    /**
     * Returns true if the code was successfully redeemed, false otherwise.
     */
    redeem(): boolean {
        if (this.isRedeemed) {
            return false;
        }

        if (!this.isRepeatable) {
            this.isRedeemed = true;
        }
        this.rewardFunction();
        return true;
    }
}
