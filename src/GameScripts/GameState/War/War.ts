import {Entity} from "../../../TreeLib/Entity";
import {Army} from "./Army";
import {AIManager} from "../../AI/AIManager";
import {TargetResolver, WarContainer} from "./TargetResolver";
import {Logger} from "../../../TreeLib/Logger";
import {Point} from "../../../TreeLib/Utility/Point";
import {ActionQueue} from "../../../TreeLib/ActionQueue/ActionQueue";
import {Forces} from "../../Enums/Forces";
import {Warzone} from "./Warzones";
import {UnitQueue} from "../../../TreeLib/ActionQueue/Queues/UnitQueue";
import {PathManager} from "../../PathManager";
import {WaypointOrders} from "../../../TreeLib/ActionQueue/Actions/WaypointOrders";
import {UnitActionDeath} from "../../../TreeLib/ActionQueue/Actions/UnitActionDeath";
import {UnitActionWaypoint} from "../../../TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import {Delay} from "../../../TreeLib/Utility/Delay";
import {NamedRect} from "../../RectControl/NamedRect";
import {Songs} from "../../flavor/Songs";
import {MinimapIconHandler} from "../MinimapIconHandler";

export class War extends Entity {
    public state: WarState = WarState.SETUP;
    public targets: WarContainer;

    public isFinished: boolean = false;
    public countdown: number = 20;
    public siegeTimer = 600;

    constructor() {
        super();
        Logger.generic("THERE IS ONLY WAR!");
        this.targets = TargetResolver.resolveTargets();
        this._timerDelay = 1;

        if (this.targets != null) {
            Logger.generic("There is targets!");
            let targets = this.targets;
            let mgr = AIManager.getInstance();

            if (this.targets.deadLock && targets.selectedBattlefield != null) {
                Logger.generic("There is a deadlock, normal war");
                targets.armies.force1 = new Army(mgr.force1Data, targets.selectedBattlefield.force1gather);
                targets.armies.force2 = new Army(mgr.force2Data, targets.selectedBattlefield.force2gather);
            } else {
                Logger.generic("This is not a deadlock, single side conquer war.");
                targets.armies.force1 = new Army(mgr.force1Data, targets.targets.force1.force1gather);
                targets.armies.force2 = new Army(mgr.force2Data, targets.targets.force2.force2gather);
            }

            this.countdown = 10;
            this.state = WarState.SETUP; //Time to spawn soldiers.
        } else {
            this.endWar();
            Logger.critical(`Cannot resolve targets... something went horribly wrong :(`);
        }
    }

    private count = 10;
    public sentArmies: boolean = false;

    step() {
        if (this.targets == null) {
            Logger.critical(`Target is null? U fking wot m8`);
            return;
        }
        this.count -= 1;
        const iconHandler = MinimapIconHandler.getInstance();

        if (this.state == WarState.SETUP) {
            if (this.targets.armies.force1.isArmyInRect(this.targets.armies.force1.baseGathering)
                && this.targets.armies.force2.isArmyInRect(this.targets.armies.force2.baseGathering)
            ) {
                this.countdown -= this._timerDelay;
                if (!this.sentArmies && this.countdown <= 0) {
                    this.sentArmies = true;
                    this.countdown = 10;
                    this.state = WarState.PREPARE_CLASH;
                    this.targets.armies.force1.sendAllSoldiersToGathering();
                    this.targets.armies.force2.sendAllSoldiersToGathering();

                    iconHandler.redObjective = this.targets.armies.force1.armyGathering.getCenter();
                    iconHandler.blueObjective = this.targets.armies.force2.armyGathering.getCenter();
                }
            }
        }
        if (this.state == WarState.PREPARE_CLASH) {
            if (this.targets.armies.force1.isArmyInRect(this.targets.armies.force1.armyGathering)
                && this.targets.armies.force2.isArmyInRect(this.targets.armies.force2.armyGathering)) {
                this.countdown -= this._timerDelay;

                if (this.countdown <= 0) {
                    if (this.targets.deadLock) {

                        Logger.generic("Deadlock, Let there be clash.");
                        this.startClash(this.targets);
                        this.state = WarState.CLASHING;

                        if (this.targets.selectedBattlefield) {
                            iconHandler.redObjective = this.targets.selectedBattlefield.center.getCenter();
                            iconHandler.blueObjective = this.targets.selectedBattlefield.center.getCenter();
                        }

                    } else {
                        Logger.generic("No deadlock, go to: ", WarState.PREPARE_FOR_SIEGE);
                        this.countdown = 10;
                        this.state = WarState.PREPARE_FOR_SIEGE;

                        if (this.targets.selectedBattlefield) {
                            if (!this.targets.armies.force1.isArmyDead())
                                iconHandler.redObjective = this.targets.selectedBattlefield.force1gather.getCenter();
                            if (!this.targets.armies.force2.isArmyDead())
                                iconHandler.blueObjective = this.targets.selectedBattlefield.force2gather.getCenter();
                        }
                    }
                }
            }
        }
        if (this.state == WarState.CLASHING) {
            let force1 = this.targets.armies.force1;
            let force2 = this.targets.armies.force2;
            if (force1 && force2 && this.count == 0) {
                if (force1.isArmyDead()) {
                    this.finishClash(this.targets, Forces.FORCE_2);
                } else if (force2.isArmyDead()) {
                    this.finishClash(this.targets, Forces.FORCE_1);
                }
            }
        }
        if (this.state == WarState.PREPARE_FOR_SIEGE) {
            if ((this.targets.armies.force1.isArmyDead() || this.targets.armies.force1.isArmyInRect(this.targets.targets.force1.force1gather))
                && (this.targets.armies.force2.isArmyDead() || this.targets.armies.force2.isArmyInRect(this.targets.targets.force2.force2gather))) {

                this.countdown -= this._timerDelay;
                if (this.countdown <= 0) {
                    Logger.generic("Start siege.");
                    this.startSiege(this.targets);
                    this.countdown = 1;
                    this.state = WarState.SIEGE;
                    if (!this.targets.armies.force1.isArmyDead())
                        iconHandler.redObjective = this.targets.targets.force1.force2Occupant.primaryRect.getCenter();
                    if (!this.targets.armies.force2.isArmyDead())
                        iconHandler.blueObjective = this.targets.targets.force2.force1Occupant.primaryRect.getCenter();
                }
            }
        }
        if (this.state == WarState.SIEGE) {
            let force1 = this.targets.armies.force1;
            let force2 = this.targets.armies.force2;
            let force1Target = this.resolveSiegeTarget(this.targets, this.targets.targets.force1, Forces.FORCE_1);
            let force2Target = this.resolveSiegeTarget(this.targets, this.targets.targets.force2, Forces.FORCE_2);
            this.siegeTimer -= 1;

            if (force1 && force2 && this.count == 0) {
                let isF1Active = true;
                let isF2Active = true;

                if (force1Target.force2Occupant.owner == Forces.FORCE_1 || force1.isArmyDead()) {
                    isF1Active = false;
                }
                if (force2Target.force1Occupant.owner == Forces.FORCE_2 || force2.isArmyDead()) {
                    isF2Active = false;
                }

                if (!isF1Active && !isF2Active) {
                    this.endWar(); // Sad ending
                }
                if (this.siegeTimer <= 0) {
                    Logger.warning("Siege has been running for longer than 600, might want to check that.");
                    Logger.warning("Army 1 Len: ", this.targets.armies.force1.platoons.length);
                    Logger.warning("Army 2 Len: ", this.targets.armies.force2.platoons.length);

                    this.endWar(); // Wtf ending
                }
            }
        }

        if (this.count == 0) {
            this.count = 10;
        }

    }

    public sendArmyToRect(army: Army, end: NamedRect) {
        for (let i = 0; i < army.platoons.length; i++) {
            let unit = army.platoons[i];
            let atkPoint = end.getRandomPoint();
            unit.currentQueue.isFinished = true;
            ActionQueue.disableQueue(unit.currentQueue);
            unit.currentQueue = ActionQueue.createGroupGuardPoint(unit.getUnitList(), atkPoint);
        }
    }

    public sendArmyToRectNoPath(army: Army, end: NamedRect) {
        for (let i = 0; i < army.platoons.length; i++) {
            let unit = army.platoons[i];
            Delay.addDelay(() => {
            }, 2);
            unit.currentQueue.isFinished = true;
            ActionQueue.disableQueue(unit.currentQueue);
            unit.currentQueue = ActionQueue.createGroupGuardPoint(unit.getUnitList(), end.getRandomPoint());
        }
    }

    public endWar() {
        this.remove(); //Kill entity.
        this.state = WarState.END;
        this.isFinished = true;
        Logger.generic("The war has reached its conclusion.");

        Delay.addDelay(() => {
            Logger.generic("Recall all the units.");
            if (this.targets != null) {
                if (this.targets.armies.force1 != null) {
                    this.disbandArmy(this.targets.armies.force1);
                    Logger.generic("Disbanded force 1");
                }
                if (this.targets.armies.force2 != null) {
                    this.disbandArmy(this.targets.armies.force2);
                    Logger.generic("Disbanded force 2");
                }
            }
        }, 240);

        Songs.getInstance().resetBackgroundOst();
    }

    private disbandArmy(army: Army) {
        for (let i = 0; i < army.platoons.length; i++) {
            let platoon = army.platoons[i];
            ActionQueue.disableQueue(platoon.currentQueue);
            for (let j = 0; j < platoon.soldiers.length; j++) {
                let unit = platoon.soldiers[j];
                let path = PathManager.getInstance().createPath(Point.fromWidget(unit.soldier), unit.startPoint, unit.force, WaypointOrders.move);
                let queue = new UnitQueue(unit.soldier, ...path);
                queue.addAction(new UnitActionWaypoint(unit.startPoint, WaypointOrders.attack));
                queue.addAction(new UnitActionDeath(true));
                unit.currentQueue = queue;
                ActionQueue.enableQueue(queue);
            }
        }
    }

    private resolveSiegeTarget(targets: WarContainer, target: Warzone, force: Forces) {
        if (targets.selectedBattlefield != null) {
            if (targets.selectedBattlefield.force2Occupant.owner != force) {
                //return targets.selectedBattlefield; //Causes issues.
            }
        }
        return target;
    }

    private startSiege(targets: WarContainer) {
        if (!targets.armies.force1 || !targets.armies.force2) {
            Logger.critical("One of the armies is undefined, it should never be undefined.");
            return;
        }

        let targetf1 = this.resolveSiegeTarget(targets, targets.targets.force1, Forces.FORCE_1);
        let targetf2 = this.resolveSiegeTarget(targets, targets.targets.force2, Forces.FORCE_2);

        if (!targets.armies.force1.isArmyDead()) {
            Logger.generic("F1 army is alive");
            this.sendArmyToRect(targets.armies.force1, targetf1.force2Occupant.primaryRect);
        }
        if (!targets.armies.force2.isArmyDead()) {
            Logger.generic("F2 army is alive");
            this.sendArmyToRect(targets.armies.force2, targetf2.force1Occupant.primaryRect);
        }

        Songs.getInstance().setBackgroundOst(Songs.getInstance().OST_COUNTDOWN_SIEGE);
    }

    private startClash(targets: WarContainer) {
        if (!targets.armies.force1 || !targets.armies.force2) {
            Logger.critical("One of the armies is undefined, it should never be undefined.");
            return;
        }

        if (targets.selectedBattlefield) {
            let center = targets.selectedBattlefield.center;

            this.sendArmyToRect(targets.armies.force1, center);
            this.sendArmyToRect(targets.armies.force2, center);

        } else {
            Logger.critical("There is no selected battlefield, if there is clashing there must be one.");
        }

        Songs.getInstance().setBackgroundOst(Songs.getInstance().OST_COUNTDOWN_WAR);
    }

    private finishClash(targets: WarContainer, winner: Forces) {
        let force1 = targets.armies.force1;
        let force2 = targets.armies.force2;

        Logger.generic("Finish the clash, winner is: ", winner);
        if (force1 && force2) {
            this.countdown = 10;
            if (winner == Forces.FORCE_1) {
                /*if (Occupations.getInstance().CITY_1.owner != Forces.FORCE_1) {
                    targets.targets.force1 = Warzones.getInstance().getWarzoneByForceAndCity(Forces.FORCE_1, Occupations.getInstance().CITY_1);
                }*/
                this.sendUnitsToSiege(force1, targets, Forces.FORCE_1, targets.targets.force1.force1gather);
            } else if (winner == Forces.FORCE_2) {
                this.sendUnitsToSiege(force2, targets, Forces.FORCE_2, targets.targets.force2.force2gather);
            }
        }

        Songs.getInstance().resetBackgroundOst();
        this.state = WarState.PREPARE_FOR_SIEGE;
    }

    private sendUnitsToSiege(force: Army, targets: WarContainer, winner: Forces, zone: NamedRect) {
        this.sendArmyToRectNoPath(force, force.armyGathering);

        if (targets.selectedBattlefield) {

            /*if ((winner == Forces.FORCE_1 && targets.selectedBattlefield.force2Occupant.owner == Forces.FORCE_1)
                    || (winner == Forces.FORCE_2 && targets.selectedBattlefield.force1Occupant.owner == Forces.FORCE_2)
            ) {*/
            if (
                (winner == Forces.FORCE_1 && targets.selectedBattlefield.force1gather != targets.targets.force1.force1gather)
                || (winner == Forces.FORCE_2 && targets.selectedBattlefield.force2gather != targets.targets.force2.force2gather)
            ) {
                Logger.generic("Switch battlezone");
                force.armyGathering = zone;
                this.countdown = 10;
            }
        }
        Delay.addDelay(() => {
            Logger.generic("Send to new gathering.");
            force.sendAllSoldiersToGathering();
        }, 10);
    }
}


export const enum WarState {
    SETUP = "SETUP",
    PREPARE_CLASH = "PREPARE_CLASH",
    CLASHING = "CLASHING",
    PREPARE_FOR_SIEGE = "PREPARE_FOR_SIEGE",
    SIEGE = "SIEGE",
    END = "END",
}