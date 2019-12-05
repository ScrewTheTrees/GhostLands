import {Hooks} from "../../TreeLib/Hooks";
import {Entity} from "../../TreeLib/Entity";
import {AIForceData} from "./AIForceData";
import {PlayerManager} from "../PlayerManager";
import {Rectifier} from "../RectControl/Rectifier";
import {Point} from "../../TreeLib/Utility/Point";
import {AIUnitSpawner} from "./AIUnitSpawner";
import {Delay} from "../../TreeLib/Utility/Delay";
import {Forces} from "../Enums/Forces";

export class AIManager extends Entity {
    private static instance: AIManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new AIManager();
            Hooks.set("AIManager", this.instance);
        }
        return this.instance;
    }

    public force1Data: AIForceData;
    public force2Data: AIForceData;

    private force1Spawner: AIUnitSpawner;
    private force2Spawner: AIUnitSpawner;

    constructor() {
        super();
        let playerManager = PlayerManager.getInstance();
        this.force1Data = new AIForceData(this.getSpawnPoints(1), playerManager.team1Player, playerManager.team1PlayerArmy, playerManager.team1PlayerExtra, Forces.FORCE_1);
        this.force2Data = new AIForceData(this.getSpawnPoints(2), playerManager.team2Player, playerManager.team2PlayerArmy, playerManager.team2PlayerExtra, Forces.FORCE_2);
        this.force1Spawner = new AIUnitSpawner(this.force1Data, 1);
        this.force2Spawner = new AIUnitSpawner(this.force2Data, 2);
        Delay.addDelay(() => {
            this.force2Spawner.currentWaveTime = 0;
        }, this.force2Spawner.waveTimer / 2);
    }

    step(): void {
    }


    private getSpawnPoints(forceId: number): Point[] {
        let rectifier = Rectifier.getInstance();
        let rects = rectifier.getRectsByForceOfType(forceId, "spawner");
        let positions: Point[] = [];
        rects.forEach((value) => {
            let point = new Point(GetRectCenterX(value.value), GetRectCenterY(value.value));
            positions.push(point);
        });
        return positions;
    }
}