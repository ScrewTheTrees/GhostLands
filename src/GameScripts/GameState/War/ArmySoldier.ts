import {UnitQueue} from "../../../TreeLib/ActionQueue/Queues/UnitQueue";
import {ActionQueue} from "../../../TreeLib/ActionQueue/ActionQueue";
import {Forces} from "../../Enums/Forces";
import {Point} from "../../../TreeLib/Utility/Point";
import {IsValidUnit} from "../../../TreeLib/Misc";

export class ArmySoldier {
    public soldier: unit;
    public force: Forces;
    private _currentQueue: UnitQueue;
    public startPoint: Point;

    constructor(soldier: unit, force: Forces, _currentQueue: UnitQueue) {
        this.soldier = soldier;
        this.force = force;
        this._currentQueue = _currentQueue;
        this.startPoint = Point.fromWidget(soldier);
    }

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
        return !IsValidUnit(this.soldier) || IsUnitDeadBJ(this.soldier);
    }
}