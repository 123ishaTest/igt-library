export abstract class IgtLoot {
    abstract loot: unknown;
    amount: number;

    protected constructor(amount: number) {
        this.amount = amount;
    }

    /**
     * Actually award the loot-tables
     */
    abstract apply(): void;

    /**
     * Override to implement comparisons. Used for simplifying the list of loot
     */
    abstract equals(other: IgtLoot): boolean;
}
