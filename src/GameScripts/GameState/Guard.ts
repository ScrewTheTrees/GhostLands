import {IsValidUnit} from "../../TreeLib/Misc";
import {Forces} from "../Enums/Forces";
import {UnitQueue} from "../../TreeLib/ActionQueue/Queues/UnitQueue";
import {ActionQueue} from "../../TreeLib/ActionQueue/ActionQueue";

export class Guard {
    public guard: unit;
    public force: Forces;

    constructor(guard: unit, force: Forces, queue: UnitQueue) {
        this.guard = guard;
        this.force = force;
        this._currentQueue = queue;
    }

    private _currentQueue: UnitQueue;

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
        return IsUnitDeadBJ(this.guard);
    }

    public hasDespawned(): boolean {
        return !IsValidUnit(this.guard);
    }
}