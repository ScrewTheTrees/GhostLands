export class CreepSpawnTable {
    private values: string[];

    constructor(...values: string[]) {
        this.values = values;
    }

    public getRandom(): string {
        return this.values[GetRandomInt(0, this.values.length - 1)];
    }

    public getRandomAsId(): number {
        return FourCC(this.values[GetRandomInt(0, this.values.length - 1)]);
    }
}