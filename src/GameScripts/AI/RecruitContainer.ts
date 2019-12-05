import {UnitQueue} from "../../TreeLib/ActionQueue/Queues/UnitQueue";
import {ActionQueue} from "../../TreeLib/ActionQueue/ActionQueue";

export class RecruitContainer {

    public recruit: unit;
    public unitType: number;
    private _currentQueue: UnitQueue;

    constructor(recruit: unit, currentQueue: UnitQueue) {
        this.recruit = recruit;
        this.unitType = GetUnitTypeId(this.recruit);
        this._currentQueue = currentQueue;
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
}