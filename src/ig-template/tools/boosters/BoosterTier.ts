import {Currency} from "@/ig-template/features/wallet/Currency";
import {Requirement} from "@/ig-template/tools/requirements/Requirement";
import {NoRequirement} from "@/ig-template/tools/requirements/NoRequirement";

export class BoosterTier {
    displayName: string;

    /**
     * All costs are per second
     */
    costs: Currency[];
    output: number;
    requirement: Requirement;

    constructor(costs: Currency[], output: number, displayName: string = "", requirement: Requirement = new NoRequirement()) {
        this.costs = costs;
        this.output = output;
        this.displayName = displayName;
        this.requirement = requirement;
    }

    getCostPerDelta(delta: number): Currency[] {
        return this.costs.map(cost => {
            return new Currency(cost.amount * delta, cost.type);
        })
    }

    canUse(): boolean {
        return this.requirement.isCompleted;
    }
}
