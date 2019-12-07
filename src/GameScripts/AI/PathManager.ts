import {Hooks} from "../../TreeLib/Hooks";
import {Rectifier} from "../RectControl/Rectifier";
import {Pathfinder} from "../../TreeLib/Pathfinder/Pathfinder";
import {Node} from "../../TreeLib/Pathfinder/Node";
import {Point} from "../../TreeLib/Utility/Point";
import {UnitActionWaypoint} from "../../TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import {WaypointOrders} from "../../TreeLib/ActionQueue/Actions/WaypointOrders";
import {UnitAction} from "../../TreeLib/ActionQueue/Actions/UnitAction";
import {Forces} from "../Enums/Forces";

export class PathManager {
    private static instance: PathManager;
    public force1Pathfinder: Pathfinder;
    public force2Pathfinder: Pathfinder;
    public neutralHostilePathfinder: Pathfinder;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PathManager();
            Hooks.set("PathManager", this.instance);
        }
        return this.instance;
    }

    constructor() {
        this.force1Pathfinder = new Pathfinder();
        this.force2Pathfinder = new Pathfinder();
        this.neutralHostilePathfinder = new Pathfinder();

        let rects = Rectifier.getInstance().getPathWaypoints();
        for (let i = 0; i < rects.length; i++) {
            let node = new Node(Point.fromRectCenter(rects[i].value));
            this.force1Pathfinder.addNodeWithNeighborsInRange(node, 1500);
            this.force2Pathfinder.addNodeWithNeighborsInRange(node, 1500);
            this.neutralHostilePathfinder.addNodeWithNeighborsInRange(node, 1500);
        }
    }

    public createAttackPath(start: Point, end: Point, force: Forces): UnitAction[] {
        let path = this.getPathfinderForForce(force).findPath(start, end);
        let actions = [];
        let newPath = path.path;
        let randomLen = GetRandomInt(64, 256);
        let randomAng = GetRandomReal(0, 360);

        for (let i = 0; i < newPath.length; i++) {
            let value = newPath[i].polarProject(randomLen, randomAng);
            actions.push(new UnitActionWaypoint(value, WaypointOrders.attack, 128));
        }

        return actions;
    }

    public getPathfinderForForce(force: Forces): Pathfinder {
        switch (force) {
            case Forces.FORCE_1:
                return this.force1Pathfinder;
            case Forces.FORCE_2:
                return this.force2Pathfinder;
            case Forces.FORCE_HOSTILE:
                return this.neutralHostilePathfinder;

        }
    }
}