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

export class AIUnitSpawner extends Entity {
    private readonly forceData: AIForceData;
    private readonly forceId: number;
    private readonly gathering: rect;
    public spawnTimer: number = 1;
    public waveTimer: number = 120;

    public spawnTimeScale: number = 1;
    public currentSpawnTime: number = 0;
    public currentWaveTime: number = 0;

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
        if (this.currentSpawnTime >= this.spawnTimer) {
            this.currentSpawnTime -= this.spawnTimer;

            let spawnPoint = this.forceData.getRandomSpawnPoint();

            let u = CreateUnit(this.forceData.aiPlayer, Units.SOLDIER, spawnPoint.x, spawnPoint.y, GetRandomReal(0, 360));
            SetUnitCreepGuard(u, false);
            RemoveGuardPosition(u);

            let queue = new UnitQueue(u);
            let recruit = new RecruitContainer(u, queue);
            this.sendRecruitToGathering(recruit);
        }
        if (this.currentWaveTime >= this.waveTimer) {
            this.currentWaveTime -= this.waveTimer;

            while (this.unitsInGather.length > 0) {
                let container = this.unitsInGather.pop();
                if (container) {
                    this.sendRecruitToRect(container, _G.gg_rct_city3);
                }
            }
        }

    }

    private sendRecruitToGathering(recruit: RecruitContainer) {
        let path = this.pathManager.createAttackPath(Point.fromWidget(recruit.recruit), Point.fromLocationClean(GetRandomLocInRect(this.gathering)));
        //Prepare
        recruit.currentQueue = new UnitQueue(recruit.recruit, path[0]);
        ActionQueue.enableQueue(recruit.currentQueue);
        //Depart
        Delay.addDelay(() => {
            let queue = new UnitQueue(recruit.recruit, ...path);
            recruit.currentQueue = queue;
            queue.addAction(new UnitActionExecuteCode((u: unit) => {
                recruit.currentQueue = ActionQueue.createSimpleGuardPoint(u, Point.fromLocationClean(GetRandomLocInRect(this.gathering)));
                this.unitsInGather.push(recruit);
            }));

            ActionQueue.enableQueue(queue);
        }, 5);
    }

    private sendRecruitToRect(recruit: RecruitContainer, rct: rect) {
        let path = this.pathManager.createAttackPath(Point.fromWidget(recruit.recruit), Point.fromLocationClean(GetRandomLocInRect(rct)));
        //Prepare
        recruit.currentQueue = new UnitQueue(recruit.recruit, path[0]);
        ActionQueue.enableQueue(recruit.currentQueue);
        //Depart
        Delay.addDelay(() => {
            let queue = new UnitQueue(recruit.recruit, ...path);
            recruit.currentQueue = queue;
            queue.addAction(new UnitActionExecuteCode((u: unit) => {
                recruit.currentQueue = ActionQueue.createSimpleGuardPoint(u, Point.fromLocationClean(GetRandomLocInRect(rct)));
            }));

            ActionQueue.enableQueue(queue);
        }, 5);
    }

    private updateTimeScale() {
        let units = CountLivingPlayerUnitsOfTypeId(FourCC("h001"), this.forceData.aiPlayer);
        this.spawnTimeScale = 1 / (0.025 + (0.15 * ((units / 2) * (units / 2))));
    }
}