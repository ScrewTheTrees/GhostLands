import {UnitQueue} from "../../../TreeLib/ActionQueue/Queues/UnitQueue";
import {ActionQueue} from "../../../TreeLib/ActionQueue/ActionQueue";
import {Forces} from "../../Enums/Forces";

export class ArmySoldier {
    public soldier: unit;
    public force: Forces;

    constructor(soldier: unit, force: Forces, _currentQueue: UnitQueue) {
        this.soldier = soldier;
        this.force = force;
        this._currentQueue = _currentQueue;
    }

    public _currentQueue: UnitQueue;

    get currentQueue(): UnitQueue {
        return this._currentQueue;
    }

    set currentQueue(value: UnitQueue) {
        if (this._currentQueue != value) {
            this._currentQueue.resetActions();
            ActionQueue.disableQueue(this._currentQueue);
        }
        this._currentQueue = value;
    }


    public isDead(): boolean {
        return IsUnitDeadBJ(this.soldier);
    }
}