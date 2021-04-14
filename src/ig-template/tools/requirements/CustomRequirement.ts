import {Requirement} from "@/ig-template/tools/requirements/Requirement";

export class CustomRequirement extends Requirement {

    private readonly _hintText: string;
    private readonly _actualFunction: () => number;
    private readonly _targetFunction: () => number;


    constructor(hintText: string, actualFunction: () => number, targetFunction: () => number) {
        super();
        this._hintText = hintText;
        this._actualFunction = actualFunction;
        this._targetFunction = targetFunction;
    }

    get actualValue(): number {
        return this._actualFunction();
    }

    get targetValue(): number {
        return this._targetFunction();
    }

    get hint(): string {
        return this._hintText
    }


}
