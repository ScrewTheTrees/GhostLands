import {Entity} from "../../TreeLib/Entity";
import {AIForceData} from "./AIForceData";
import {Rectifier} from "../RectControl/Rectifier";
import {Point} from "../../TreeLib/Utility/Point";
import {Units} from "../Enums/Units";
import {RecruitContainer} from "./RecruitContainer";
import {ActionQueue} from "../../TreeLib/ActionQueue/ActionQueue";

export class AIUnitSpawner extends Entity {
    private readonly forceData: AIForceData;
    private readonly forceId: number;
    private readonly gathering: rect;
    public spawnTimer: number = 5;
    public timeScale: number = 1;
    public currentTime: number = 0;

    public unitsInGather: RecruitContainer[] = [];

    constructor(forceData: AIForceData, forceId: number) {
        super();
        this.forceData = forceData;
        this.forceId = forceId;
        this.gathering = Rectifier.getInstance().getRectsByForceOfType(forceId, "gathering")[0].value;
    }

    step() {
        this.currentTime += this._timerDelay * this.timeScale;
        if (this.currentTime >= this.spawnTimer) {
            this.currentTime -= this.spawnTimer;
            let spawnPoint = this.forceData.getRandomSpawnPoint();
            let gatherPoint = this.getRandomGatherPoint();

            let u = CreateUnit(this.forceData.aiPlayer, Units.SOLDIER, spawnPoint.x, spawnPoint.y, GetRandomReal(0, 360));
            SetUnitCreepGuard(u, false);
            RemoveGuardPosition(u);
            let queue = ActionQueue.createSimpleGuardPoint(u, gatherPoint);
            let recruit = new RecruitContainer(u, queue);
            this.unitsInGather.push(recruit);
        }
    }


    public getRandomGatherPoint(): Point {
        return Point.fromLocationClean(GetRandomLocInRect(this.gathering));
    }
}