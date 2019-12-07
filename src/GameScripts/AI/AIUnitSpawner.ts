import {Entity} from "../../TreeLib/Entity";
import {AIForceData} from "./AIForceData";
import {Rectifier} from "../RectControl/Rectifier";
import {Point} from "../../TreeLib/Utility/Point";
import {Units} from "../Enums/Units";
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

export class AIUnitSpawner extends Entity {
    private readonly forceData: AIForceData;
    private readonly forceId: number;
    private readonly gathering: rect;
    public spawnTimer: number = 1;
    public waveTimer: number = 240;

    public spawnTimeScale: number = 1;
    public currentSpawnTime: number = 0;
    public currentWaveTime: number = 120;

    public paused = false;

    private pathManager: PathManager = PathManager.getInstance();

    public unitsInGather: RecruitContainer[] = [];

    constructor(forceData: AIForceData, forceId: number) {
        super();
        this.forceData = forceData;
        this.forceId = forceId;
        this.gathering = Rectifier.getInstance().getRectsByForceOfType(forceId, "gathering")[0].value;
    }

    step() {
        this.updateTimeScale();

        this.currentSpawnTime += this._timerDelay * this.spawnTimeScale;
        this.currentWaveTime += this._timerDelay;
        if (this.currentSpawnTime >= this.spawnTimer && !this.paused) {
            this.currentSpawnTime -= this.spawnTimer;

            let spawnPoint = this.forceData.getRandomSpawnPoint();

            let u = CreateUnit(this.forceData.aiPlayer, Units.SOLDIER, spawnPoint.x, spawnPoint.y, GetRandomReal(0, 360));
            let u2 = CreateUnit(this.forceData.aiPlayer, Units.ARCHER, spawnPoint.x, spawnPoint.y, GetRandomReal(0, 360));
            SetUnitCreepGuard(u, false);
            RemoveGuardPosition(u);
            SetUnitCreepGuard(u2, false);
            RemoveGuardPosition(u2);

            let queue = new UnitQueue(u);
            let queue2 = new UnitQueue(u2);
            let recruit = new RecruitContainer(u, queue);
            let recruit2 = new RecruitContainer(u2, queue2);
            this.unitsInGather.push(recruit);
            this.unitsInGather.push(recruit2);
            this.sendRecruitToRect(recruit, this.gathering, 0);
            this.sendRecruitToRect(recruit2, this.gathering, 0);
        }
        if (this.currentWaveTime >= this.waveTimer) {
            this.currentWaveTime -= this.waveTimer;

            this.replenishTroopsInAllCities();

            while (this.unitsInGather.length > 0) {
                let container = this.unitsInGather.pop();
                let delay = 0;
                if (container) {
                    if (GetGuardTypeFromUnit(container.recruit) == GuardType.RANGED) {
                        delay = 5;
                    }
                }

                Delay.addDelay(() => {
                    if (container) {
                        this.sendRecruitToRect(container, _G.gg_rct_city3, 5);
                    }
                }, delay);

            }

            this.paused = true;
            Delay.addDelay(() => {
                this.paused = false;
            }, this.waveTimer * 0.9)
        }
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

    private sendRecruitToRect(recruit: RecruitContainer, rct: rect, delay?: number) {
        return this.sendRecruitToPoint(recruit, Point.fromLocationClean(GetRandomLocInRect(rct)), delay);
    }

    private sendRecruitToPoint(recruit: RecruitContainer, point: Point, delay: number = 5) {
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

    private updateTimeScale() {
        let units = CountLivingPlayerUnitsOfTypeId(FourCC("h001"), this.forceData.aiPlayer)
            + CountLivingPlayerUnitsOfTypeId(FourCC("h002"), this.forceData.aiPlayer);
        this.spawnTimeScale = 5 / (1 + units);
    }
}