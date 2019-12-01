import {UnitQueue} from "../../TreeLib/ActionQueue/Queues/UnitQueue";

export class RecruitContainer {
    public recruit: unit;
    public currentQueue: UnitQueue;

    constructor(recruit: unit, currentQueue: UnitQueue) {
        this.recruit = recruit;
        this.currentQueue = currentQueue;
    }
}