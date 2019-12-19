import {Entity} from "../../../TreeLib/Entity";
import {Army} from "./Army";
import {AIManager} from "../../AI/AIManager";
import {TargetResolver, WarContainer} from "./TargetResolver";
import {Logger} from "../../../TreeLib/Logger";
import {Point} from "../../../TreeLib/Utility/Point";
import {ActionQueue} from "../../../TreeLib/ActionQueue/ActionQueue";
import {Forces} from "../../Enums/Forces";
import {Warzone} from "./Warzones";
import {Occupations} from "../Occupations";

export class War extends Entity {
    public state: WarState = WarState.SETUP;
    public targets: WarContainer | null = null;

    public isFinished: boolean = false;
    public clashCountdown: number = 60;
    public siegeCountdown: number = 60;

    //TODO: Replace print with Debug.Log();
    constructor() {
        super();
        print("THERE IS ONLY WAR!");
        this.targets = TargetResolver.resolveTargets();
        this._timerDelay = 1;

        if (this.targets != null) {
            print("There is targets!");
            let targets = this.targets;
            let t1 = targets.targets.force1.force1gather.getCenter();
            let t2 = targets.targets.force2.force2gather.getCenter();

            let mgr = AIManager.getInstance();

            if (this.targets.deadLock && targets.selectedBattlefield != null) {
                print("There is a deadlock, det finns bara krig.");
                targets.armies.force1 = new Army(mgr.force1Data, targets.selectedBattlefield.force1gather);
                targets.armies.force2 = new Army(mgr.force2Data, targets.selectedBattlefield.force2gather);
            } else {
                print("This is not a deadlock, single side conquer war.");
                targets.armies.force1 = new Army(mgr.force1Data, targets.targets.force1.force1gather);
                targets.armies.force2 = new Army(mgr.force2Data, targets.targets.force2.force2gather);
            }

            this.clashCountdown = math.max(
                targets.armies.force1.gathering.getCenter().distanceTo(Occupations.getInstance().FORCE_1_BASE.primaryRect.getCenter()),
                targets.armies.force2.gathering.getCenter().distanceTo(Occupations.getInstance().FORCE_2_BASE.primaryRect.getCenter())
            ) / 100;

            this.state = WarState.PREPARE_CLASH; //Armies are done, preparatus.
        } else {
            this.endWar();
            Logger.critical(`Cannot resolve targets... something went horribly wrong :(`);
        }

        print("Time till war is: ", this.clashCountdown);
    }


    step() {
        if (this.targets == null) {
            Logger.critical(`Target is null? U fking wot m8`);
            return;
        }

        if (this.state == WarState.PREPARE_CLASH) {
            this.clashCountdown -= this._timerDelay;
            if (this.clashCountdown <= 0) {
                if (this.targets.deadLock) {
                    print("Deadlock, Let there be clash.");
                    this.startClash(this.targets);
                    this.state = WarState.CLASHING;
                } else {
                    print("No deadlock, go to: ", WarState.PREPARE_FOR_SIEGE);
                    this.siegeCountdown = 5;
                    this.state = WarState.PREPARE_FOR_SIEGE;
                }
            }
            if (this.clashCountdown % 10 == 0) {
                print(this.clashCountdown);
            }

        } else if (this.state == WarState.PREPARE_FOR_SIEGE) {
            this.siegeCountdown -= this._timerDelay;
            if (this.siegeCountdown <= 0) {
                print("Start siege.");
                this.startSiege(this.targets);
                this.state = WarState.SIEGE;
            }
            if (this.siegeCountdown % 10 == 0) {
                print(this.siegeCountdown);
            }
        }

    }

    public startSiege(targets: WarContainer) {
        if (!targets.armies.force1 || !targets.armies.force2) {
            Logger.critical("One of the armies is undefined, it should never be undefined.");
            return;
        }

        let targetf1 = this.resolveSiegeTarget(targets, targets.targets.force1, Forces.FORCE_1);
        let targetf2 = this.resolveSiegeTarget(targets, targets.targets.force2, Forces.FORCE_2);

        if (!targets.armies.force1.isArmyDead()) {
            print("F1 army is alive");
            this.sendArmyWithOffset(targets.armies.force1, targets.armies.force1.gathering.getCenter(), targetf1.force2Occupant.primaryRect.getCenter());
        }
        if (!targets.armies.force2.isArmyDead()) {
            print("F2 army is alive");
            this.sendArmyWithOffset(targets.armies.force2, targets.armies.force2.gathering.getCenter(), targetf2.force1Occupant.primaryRect.getCenter());
        }
    }

    public sendArmyWithOffset(army: Army, start: Point, end: Point) {
        let offset = start.getOffsetTo(end);
        army.units.forEach((unit) => {
            let atkPoint = Point.fromWidget(unit.soldier).addOffset(offset);
            unit.currentQueue.isFinished = true;
            ActionQueue.disableQueue(unit.currentQueue);
            unit.currentQueue = ActionQueue.createSimpleGuardPoint(unit.soldier, atkPoint);
        });
    }

    public endWar() {
        this.remove(); //Kill entity.
        this.state = WarState.END;
        this.isFinished = true;
    }

    private resolveSiegeTarget(targets: WarContainer, target: Warzone, force: Forces) {
        if (targets.selectedBattlefield != null) {
            if (targets.selectedBattlefield.force2Occupant.owner != force) {
                return targets.selectedBattlefield;
            }
        }
        return target;
    }

    private startClash(targets: WarContainer) {
        if (!targets.armies.force1 || !targets.armies.force2) {
            Logger.critical("One of the armies is undefined, it should never be undefined.");
            return;
        }

        if (targets.selectedBattlefield) {
            let targetsf1 = targets.selectedBattlefield.force2gather.getCenter();
            let targetsf2 = targets.selectedBattlefield.force1gather.getCenter();

            this.sendArmyWithOffset(targets.armies.force1, targetsf1, targetsf2);
            this.sendArmyWithOffset(targets.armies.force2, targetsf2, targetsf1);

        } else {
            Logger.critical("There is no selected battlefield, if there is clashing there must be one.");
        }
    }
}


export enum WarState {
    SETUP = "SETUP",
    PREPARE_CLASH = "PREPARE_CLASH",
    CLASHING = "CLASHING",
    BREAK = "BREAK",
    PREPARE_FOR_SIEGE = "PREPARE_FOR_SIEGE",
    SIEGE = "SIEGE",
    END = "END",
}