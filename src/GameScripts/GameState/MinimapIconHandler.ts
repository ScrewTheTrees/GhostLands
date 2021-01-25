import {Hooks} from "../../TreeLib/Hooks";
import {Point} from "../../TreeLib/Utility/Point";
import {Entity} from "../../TreeLib/Entity";

export class MinimapIconHandler extends Entity{
    private static instance: MinimapIconHandler;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new MinimapIconHandler();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public redObjective: Point;
    public blueObjective: Point;

    constructor() {
        super();
        this._timerDelay = 5;
        this.redObjective = new Point(-1024,0);
        this.blueObjective = new Point(1024,0);
    }

    step() {
        PingMinimapEx(this.redObjective.x, this.redObjective.y,5,254,0,0,false);
        PingMinimapEx(this.blueObjective.x, this.blueObjective.y,5,0,0,254,false);
    }

}
