import {Hooks} from "../../TreeLib/Hooks";
import {Rectifier} from "../RectControl/Rectifier";
import {Pathfinder} from "../../TreeLib/Pathfinder/Pathfinder";
import {Node} from "../../TreeLib/Pathfinder/Node";
import {Point} from "../../TreeLib/Utility/Point";
import {UnitActionWaypoint} from "../../TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import {WaypointOrders} from "../../TreeLib/ActionQueue/Actions/WaypointOrders";
import {UnitAction} from "../../TreeLib/ActionQueue/Actions/UnitAction";
import {UnitActionDeath} from "../../TreeLib/ActionQueue/Actions/UnitActionDeath";
import {UnitActionDelay} from "../../TreeLib/ActionQueue/Actions/UnitActionDelay";

export class PathManager {
    private static instance: PathManager;
    public pathfinder: Pathfinder;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PathManager();
            Hooks.set("PathManager", this.instance);
        }
        return this.instance;
    }

    constructor() {
        this.pathfinder = new Pathfinder();

        let rects = Rectifier.getInstance().getPathWaypoints();
        for (let i = 0; i < rects.length; i++) {
            let node = new Node(Point.fromRectCenter(rects[i].value));
            this.pathfinder.addNodeWithNeighborsInRange(node, 1500);
        }
    }

    public createAttackPath(start: Point, end: Point): UnitAction[] {
        let path = this.pathfinder.findPath(start, end);
        let actions = [];
        let newPath = path.path;
        let randomLen = GetRandomInt(32, 400);
        let randomAng = GetRandomReal(0, 360);

        for (let i = 0; i < newPath.length; i++) {
            let value = newPath[i].polarProject(randomLen, randomAng);
            actions.push(new UnitActionWaypoint(value, WaypointOrders.attack, 128));
        }

        return actions;
    }
}