import {Entity} from "../../TreeLib/Entity";
import {AIForceData} from "./AIForceData";
import {Rectifier} from "../RectControl/Rectifier";
import {Point} from "../../TreeLib/Utility/Point";
import {RecruitContainer} from "./RecruitContainer";
import {ActionQueue} from "../../TreeLib/ActionQueue/ActionQueue";
import {PathManager} from "./PathManager";
import {UnitQueue} from "../../TreeLib/ActionQueue/Queues/UnitQueue";
import {UnitActionExecuteCode} from "../../TreeLib/ActionQueue/Actions/UnitActionExecuteCode";
import {Delay} from "../../TreeLib/Utility/Delay";
import {Occupations} from "../GameState/Occupations";
import {Occupant} from "../GameState/Occupant";
import {GetGuardTypeFromUnit, GuardType} from "../Enums/GuardType";
import {Guard} from "../GameState/Guard";
import {NamedRect} from "../RectControl/NamedRect";
import {Units} from "../Enums/Units";
import {DummyCaster} from "../../TreeLib/DummyCasting/DummyCaster";

export class AIUnitSpawner extends Entity {
    public forceData: AIForceData;
    public forceId: number;
    public gathering: NamedRect;
    public spawnTimer: number = 60;
    public waveTimer: number = 60;

    public currentSpawnTime: number = 10;
    public currentWaveTime: number = 5;

    public spawnTimeScale: number = 1;

    public pathManager: PathManager = PathManager.getInstance();

    public unitsInGather: RecruitContainer[] = [];

    constructor(forceData: AIForceData, forceId: number) {
        super();
        this.forceData = forceData;
        this.forceId = forceId;
        this.gathering = Rectifier.getInstance().getRectsByForceOfType(forceId, "gathering")[0];

        this._timerDelay = 1;

        Delay.addDelay(() => {
            let soldiers = Math.min(Occupations.getInstance().getNeededGuardsByForce(this.forceData.force, GuardType.MELEE), 20);
            let archers = Math.min(Occupations.getInstance().getNeededGuardsByForce(this.forceData.force, GuardType.RANGED), 20);
            for (let i = 0; i < soldiers; i++) {
                let u = this.executeUnitSpawn(Units.SOLDIER).recruit;
                DummyCaster.castImmediately(FourCC("A002"), "berserk", u);

            }
            for (let i = 0; i < archers; i++) {
                let u = this.executeUnitSpawn(Units.ARCHER).recruit;
                DummyCaster.castImmediately(FourCC("A002"), "berserk", u);
            }
            this.replenishTroopsInAllCities();
        }, 0.02)
    }

    step() {
        this.currentSpawnTime += this._timerDelay * this.spawnTimeScale;
        this.currentWaveTime += this._timerDelay;
        if (this.currentSpawnTime >= this.spawnTimer) {
            this.currentSpawnTime -= this.spawnTimer;
            for (let i = 0; i < 5; i++) {
                if (this.countUnitOfGuardType(GuardType.MELEE) < 5) {
                    this.executeUnitSpawn(Units.SOLDIER);
                }
                if (this.countUnitOfGuardType(GuardType.RANGED) < 5) {
                    this.executeUnitSpawn(Units.ARCHER);
                }
            }
        }
        if (this.currentWaveTime >= this.waveTimer) {
            this.currentWaveTime -= this.waveTimer;

            this.replenishTroopsInAllCities();
        }
    }

    public executeUnitSpawn(unitType: number) {
        let spawnPoint = this.forceData.getRandomSpawnPoint();

        let u = CreateUnit(this.forceData.aiPlayer, unitType, spawnPoint.x, spawnPoint.y, spawnPoint.directionTo(new Point(0, 0)));
        SetUnitCreepGuard(u, false);
        RemoveGuardPosition(u);

        let queue = new UnitQueue(u);
        let recruit = new RecruitContainer(u, queue);
        this.unitsInGather.push(recruit);

        this.sendRecruitToRect(recruit, this.gathering.value, 0);

        return recruit;
    }

    public replenishTroopsInAllCities() {
        let occupants = Occupations.getInstance().getAllOccupants();
        for (let i = 0; i < occupants.length; i++) {
            let occupant = occupants[i];
            if (occupant.owner == this.forceData.force) {
                this.replenishTroopsInCity(occupant);
            }
        }
    }

    public replenishTroopsInCity(occupant: Occupant) {
        for (let j = 0; j < occupant.guardPosts.length; j++) {
            let guard = occupant.guardPosts[j];
            if (guard.needNewGuard()) {
                let unit = this.popUnitByGuardType(guard.postType);
                if (unit != null) {
                    guard.occupied = new Guard(unit.recruit);
                    this.sendRecruitToPoint(unit, guard.point);
                }
            }
        }
    }

    public popUnitByGuardType(postType: GuardType): RecruitContainer | null {
        for (let i = 0; i < this.unitsInGather.length; i++) {
            let u = this.unitsInGather[i];
            if (GetGuardTypeFromUnit(u.recruit) == postType) {
                this.unitsInGather.splice(i, 1);
                return u;
            }
        }

        return null;
    }

    private countUnitOfGuardType(guardType: GuardType): number {
        let num = 0;
        for (let i = 0; i < this.unitsInGather.length; i++) {
            let u = this.unitsInGather[i];
            if (GetGuardTypeFromUnit(u.recruit) == guardType) {
                num += 1;
            }
        }
        return num;
    }

    public sendRecruitToRect(recruit: RecruitContainer, rct: rect, delay?: number) {
        return this.sendRecruitToPoint(recruit, Point.fromLocationClean(GetRandomLocInRect(rct)), delay);
    }

    public sendRecruitToPoint(recruit: RecruitContainer, point: Point, delay: number = 5) {
        point = point.copy();
        let path = this.pathManager.createAttackPath(Point.fromWidget(recruit.recruit), point, this.forceData.force);
        //Prepare
        recruit.currentQueue = new UnitQueue(recruit.recruit, path[0]);
        ActionQueue.enableQueue(recruit.currentQueue);
        //Depart
        Delay.addDelay(() => {
            let queue = new UnitQueue(recruit.recruit, ...path);
            recruit.currentQueue = queue;
            queue.addAction(new UnitActionExecuteCode((u: unit) => {
                recruit.currentQueue = ActionQueue.createSimpleGuardPoint(u, point);
            }));

            ActionQueue.enableQueue(queue);

        }, delay);
    }
}