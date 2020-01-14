import {Quick} from "../../TreeLib/Quick";

export class SpawnWeight<T> {
    private list: T[] = [];

    constructor(type: T) {
        for (let i = 0; i < 100; i++) {
            Quick.Push(this.list, type);
        }
    }

    public remove(type: T, amount: number = -1) {
        for (let i = 0; i < this.list.length; i++) {
            if (type == this.list[i]) {
                Quick.Splice(this.list, i);
                i -= 1;
                amount -= 1;
                if (amount == 0) {
                    return;
                }
            }
        }
    }

    public add(type: T, amount: number) {
        for (let i = 0; i < amount; i++) {
            Quick.Push(this.list, type);
        }
    }

    public countEntries(type: T): number {
        let count = 0;
        for (let i = 0; i < this.list.length; i++) {
            if (type == this.list[i]) {
                count += 1;
            }
        }
        return count;
    }

    public getChanceOf(type: T): number {
        return this.countEntries(type) / this.list.length;
    }

    public getRandom(): T {
        return this.list[GetRandomInt(0, this.list.length - 1)];
    }

    public getAllAvailable(): T[] {
        let retvar: T[] = [];
        for (let i = 0; i < this.list.length; i++) {
            let val = this.list[i];
            if (retvar.indexOf(val) < 0) {
                Quick.Push(retvar, val);
            }
        }

        return retvar;

    }
}