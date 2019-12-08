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
    public forceGeneralPaths: Pathfinder;
    public banditPreference: Pathfinder;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PathManager();
            Hooks.set("PathManager", this.instance);
        }
        return this.instance;
    }

    constructor() {
        this.forceGeneralPaths = new Pathfinder();
        this.banditPreference = new Pathfinder();

        let basicPath = Rectifier.getInstance().getBySegmentNames("path", "waypoint");
        let forestPath = Rectifier.getInstance().getBySegmentNames("forestpath", "waypoint");

        for (let i = 0; i < basicPath.length; i++) {
            let node = new Node(Point.fromRectCenter(basicPath[i].value));
            this.forceGeneralPaths.addNodeWithNeighborsInRange(node, 1500);

            let node2 = new Node(Point.fromRectCenter(basicPath[i].value));
            this.banditPreference.addNodeWithNeighborsInRange(node2, 1500);
        }
        for (let j = 0; j < forestPath.length; j++) {
            let node = new Node(Point.fromRectCenter(forestPath[j].value));
            node.cost = 0.5; //Bandits doesnt like roads
            this.banditPreference.addNodeWithNeighborsInRange(node, 1500);
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
            case Forces.FORCE_BANDIT:
                return this.banditPreference;

            default:
                return this.forceGeneralPaths;

        }
    }
}