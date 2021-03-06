import {Hooks} from "../TreeLib/Hooks";
import {Rectifier} from "./RectControl/Rectifier";
import {Pathfinder} from "../TreeLib/Pathfinder/Pathfinder";
import {Node} from "../TreeLib/Pathfinder/Node";
import {Point} from "../TreeLib/Utility/Point";
import {UnitActionWaypoint} from "../TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import {WaypointOrders} from "../TreeLib/ActionQueue/Actions/WaypointOrders";
import {UnitAction} from "../TreeLib/ActionQueue/Actions/UnitAction";
import {Forces} from "./Enums/Forces";
import {Logger} from "../TreeLib/Logger";
import {UnitGroupAction} from "../TreeLib/ActionQueue/Actions/UnitGroupAction";
import {UnitGroupActionWaypoint} from "../TreeLib/ActionQueue/Actions/UnitGroupActionWaypoint";

export class PathManager {
    private static instance: PathManager;
    public forceGeneralPaths: Pathfinder;
    public banditPreference: Pathfinder;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PathManager();
            Hooks.set(this.name, this.instance);
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

        this.banditPreference.nodes.forEach((node) => {
            if (node.neighbors.length <= 1) {
                Logger.warning("One or fewer nodes at: ", node.point.toString(), "....................................");
            }
        });
    }

    public createPath(start: Point, end: Point, force: Forces, type = WaypointOrders.attack): UnitAction[] {
        let path = this.getPathfinderForForce(force).findPath(start, end);
        let actions: UnitAction[] = [];
        let newPath = path.path;
        let randomLen = GetRandomInt(32, 256);
        let randomAng = GetRandomReal(1, 359);

        if (!path.reachedTheEnd) {
            Logger.warning("Couldnt reach node: ", path.endNode.toString());
        }

        for (let i = 0; i < newPath.length; i++) {
            let value = newPath[i].polarProject(randomLen, randomAng);
            actions.push(new UnitActionWaypoint(value, type, 128));
        }

        return actions;
    }

    public createPathGroup(start: Point, end: Point, force: Forces, type = WaypointOrders.attack): UnitGroupAction[] {
        let path = this.getPathfinderForForce(force).findPath(start, end);
        let actions: UnitGroupAction[] = [];
        let newPath = path.path;

        if (!path.reachedTheEnd) {
            Logger.warning("Couldnt reach node: ", path.endNode.toString());
        }

        for (let i = 0; i < newPath.length; i++) {
            actions.push(new UnitGroupActionWaypoint(newPath[i], type));
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