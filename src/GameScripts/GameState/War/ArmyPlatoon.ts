import {Forces} from "../../Enums/Forces";
import {Point} from "../../../TreeLib/Utility/Point";
import {ActionQueue} from "../../../TreeLib/ActionQueue/ActionQueue";
import {ArmySoldier} from "./ArmySoldier";
import {UnitGroupQueue} from "../../../TreeLib/ActionQueue/Queues/UnitGroupQueue";
import {Quick} from "../../../TreeLib/Quick";

export class ArmyPlatoon {
    public soldiers: ArmySoldier[] = [];
    public force: Forces;
    private _currentQueue: UnitGroupQueue;

    constructor(force: Forces, _currentQueue: UnitGroupQueue) {
        this.force = force;
        this._currentQueue = _currentQueue;
    }

    get currentQueue(): UnitGroupQueue {
        return this._currentQueue;
    }

    set currentQueue(value: UnitGroupQueue) {
        if (this._currentQueue != value) {
            this.purgeDead(); // Purge
            this._currentQueue.resetActions();
            ActionQueue.disableQueue(this._currentQueue);
            this.soldiers.forEach((soldier) => {
                ActionQueue.disableQueue(soldier.currentQueue);
            })
        }
        this._currentQueue = value;
    }

    public getPlatoonPoint(): Point {
        let avg: Point[] = [];
        this.purgeDead(); // Purge
        for (let i = 0; i < this.soldiers.length; i++) {
            Quick.Push(avg, Point.fromWidget(this.soldiers[i].soldier));
        }
        return Point.getCenterOfPoints(avg);
    }

    public getUnitList(): unit[] {
        let arr: unit[] = [];
        this.purgeDead(); // Purge
        for (let i = 0; i < this.soldiers.length; i++) {
            Quick.Push(arr, this.soldiers[i].soldier);
        }
        return arr;
    }

    public purgeDead() {
        for (let i = 0; i < this.soldiers.length; i++) {
            if (this.soldiers[i].isDead()) {
                Quick.Slice(this.soldiers, i);
                i--;
            }
        }
    }

    public isDead(): boolean {
        this.purgeDead();
        return (this.soldiers.length == 0);
    }

    public isFull(): boolean {
        this.purgeDead(); // Purge
        return (this.soldiers.length >= 6); // Is full.
    }
}