import {Hooks} from "../../TreeLib/Hooks";
import {PlayerManager} from "../PlayerManager";
import {PlayerUnits} from "../Enums/PlayerUnits";
import {Delay} from "../../TreeLib/Utility/Delay";
import {AIManager} from "../AI/AIManager";
import {WaypointOrders} from "../../TreeLib/ActionQueue/Actions/WaypointOrders";
import {AIForceData} from "../AI/AIForceData";
import {AIGuardSpawner} from "../AI/AIGuardSpawner";
import {Quick} from "../../TreeLib/Quick";
import {IsValidUnit} from "../../TreeLib/Misc";
import {UnitQueue} from "../../TreeLib/ActionQueue/Queues/UnitQueue";
import {PathManager} from "../PathManager";
import {Point} from "../../TreeLib/Utility/Point";
import {ActionQueue} from "../../TreeLib/ActionQueue/ActionQueue";
import {Entity} from "../../TreeLib/Entity";
import {UnitActionWaypoint} from "../../TreeLib/ActionQueue/Actions/UnitActionWaypoint";
import {Logger} from "../../TreeLib/Logger";
import {ApplySkinToUnit, CreateUnitHandleSkin} from "../../Skinner";

export class PlayerUnitManager extends Entity {
    private static instance: PlayerUnitManager;
    private respawnHeroes: trigger = CreateTrigger();

    private playerManager: PlayerManager = PlayerManager.getInstance();
    private hiredUnits: trigger = CreateTrigger();
    private onRouteOrderedUnits: trigger = CreateTrigger();
    private onRouteUnits: OnRouteUnit[] = [];

    constructor() {
        super();
        this._timerDelay = 10;
        this.execute();
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerUnitManager();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public execute() {
        for (let i = 0; i < this.playerManager.allMinions.length; i++) {
            let minion = this.playerManager.allMinions[i];
            let startX = GetPlayerStartLocationX(minion);
            let startY = GetPlayerStartLocationY(minion);
            CreateUnitHandleSkin(minion, FourCC(PlayerUnits.HERO_GRAND_GENERAL), startX, startY, 270);
            SetPlayerState(minion, PLAYER_STATE_RESOURCE_FOOD_CAP, 5);

            TriggerRegisterPlayerUnitEvent(this.respawnHeroes, minion, EVENT_PLAYER_UNIT_DEATH, null);
            TriggerRegisterPlayerUnitEvent(this.onRouteOrderedUnits, minion, EVENT_PLAYER_UNIT_ISSUED_ORDER, null);
            TriggerRegisterPlayerUnitEvent(this.onRouteOrderedUnits, minion, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER, null);
            TriggerRegisterPlayerUnitEvent(this.onRouteOrderedUnits, minion, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER, null);

        }

        PlayerManager.getInstance().allPlayers.forEach((p) => {
            TriggerRegisterPlayerUnitEvent(this.hiredUnits, p, EVENT_PLAYER_UNIT_SELL, null);
        });
        TriggerAddAction(this.respawnHeroes, () => {
            this.respawnHero();
        });
        TriggerAddAction(this.hiredUnits, () => {
            this.trigHireUnit();
        });
        TriggerAddAction(this.onRouteOrderedUnits, () => xpcall(() => {
            this.trigOrderedUnit();
        }, Logger.critical));
    }

    step() {
        this.onRouteUnits.forEach((route) => {
            if (route.isGone()) {
                this.removeRouteUnit(route.target);
            }
        });
    }

    private respawnHero() {
        if (IsHeroUnitId(GetUnitTypeId(GetDyingUnit()))) {
            let h = GetDyingUnit();
            if (PlayerManager.getInstance().team1Minions.indexOf(GetOwningPlayer(h)) >= 0) {
                Delay.addDelay(() => {
                    this.reviveHero(h, AIManager.getInstance().force1Data, AIManager.getInstance().force1Spawner);
                }, 60);
            } else if (PlayerManager.getInstance().team2Minions.indexOf(GetOwningPlayer(h)) >= 0) {
                Delay.addDelay(() => {
                    this.reviveHero(h, AIManager.getInstance().force2Data, AIManager.getInstance().force2Spawner);
                }, 60);
            }
        }
    }

    private reviveHero(h: unit, forceData: AIForceData, spawner: AIGuardSpawner) {
        let point = forceData.getRandomSpawnPoint();
        ReviveHero(h, point.x, point.y, false);
        let gathering = spawner.gathering.getRandomPoint();
        IssuePointOrder(h, WaypointOrders.move, gathering.x, gathering.y);
    }

    private trigHireUnit() {
        const soldUnit = GetSoldUnit();
        const sellingUnit = GetSellingUnit();

        const forces = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(soldUnit));
        SetUnitPositionLoc(soldUnit, AIManager.getInstance().getDataByForces(forces).getRandomSpawnPoint().toLocationClean());

        const path = PathManager.getInstance().createPath(Point.fromWidget(soldUnit), Point.fromWidget(sellingUnit), forces, WaypointOrders.move);
        const queue = ActionQueue.createUnitQueue(soldUnit, ...path);

        ApplySkinToUnit(soldUnit);

        Quick.Push(this.onRouteUnits, new OnRouteUnit(soldUnit, queue));
    }

    private trigOrderedUnit() {
        let ordered = GetOrderedUnit();

        switch (GetHandleId(GetTriggerEventId())) {
            case GetHandleId(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER):
            case GetHandleId(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER):
                this.removeRouteUnit(ordered);
                break;
            case GetHandleId(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER):
                let onRouteUnit = this.getOnRouteUnit(ordered);
                if (onRouteUnit != null) {
                    //Gotta wrap in XP call for safety since typecasting and other things and we dont want it to intercept the rest.
                    xpcall(() => {
                        let waypoint: UnitActionWaypoint = <UnitActionWaypoint>onRouteUnit?.queue.allActions[onRouteUnit.queue.currentActionIndex];
                        if (waypoint != null && waypoint.toPoint.distanceTo(Point.fromLocationClean(GetOrderPointLoc())) > 5) {
                            this.removeRouteUnit(ordered);
                        }
                    }, () => null);
                }
                break;
        }
    }

    private getOnRouteUnit(u: unit) {
        for (let i = 0; i < this.onRouteUnits.length; i++) {
            let value = this.onRouteUnits[i];
            if (value.target == u) {
                return value;
            }
        }
        return null;
    }

    private removeRouteUnit(target: unit) {
        for (let i = 0; i < this.onRouteUnits.length; i++) {
            let routeUnit = this.onRouteUnits[i];

            if (routeUnit.target == target) {
                routeUnit.queue.isFinished = true;
                ActionQueue.disableQueue(routeUnit.queue);
                Quick.Slice(this.onRouteUnits, i);
                return;
            }
        }
    }
}

export class OnRouteUnit {
    constructor(public target: unit, public queue: UnitQueue) {

    }

    public isGone() {
        return !IsValidUnit(this.target) || this.queue.isFinished;
    }

}