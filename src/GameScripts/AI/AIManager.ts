import {Hooks} from "../../TreeLib/Hooks";
import {AIForceData} from "./AIForceData";
import {PlayerManager} from "../PlayerManager";
import {Rectifier} from "../RectControl/Rectifier";
import {Point} from "../../TreeLib/Utility/Point";
import {AIGuardSpawner} from "./AIGuardSpawner";
import {Forces, GetIDByForce} from "../Enums/Forces";
import {AIBanditSpawner} from "./Bandits/AIBanditSpawner";
import {BanditCamp} from "./Bandits/BanditCamp";
import {Segment} from "../RectControl/Segment";
import {Logger} from "../../TreeLib/Logger";
import {Quick} from "../../TreeLib/Quick";
import {SpawnWeight} from "./SpawnWeight";
import {PlayerUnits} from "../Enums/PlayerUnits";

export class AIManager {
    private static instance: AIManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new AIManager();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public force1Data: AIForceData;
    public force2Data: AIForceData;
    public force1Spawner: AIGuardSpawner;
    public force2Spawner: AIGuardSpawner;

    public banditNorthData: AIForceData;
    public banditSouthData: AIForceData;
    public banditNorthSpawner: AIBanditSpawner;
    public banditSouthSpawner: AIBanditSpawner;

    constructor() {
        let playerManager = PlayerManager.getInstance();
        let b = PlayerManager.getInstance().bandit;

        this.force1Data = new AIForceData(this.getSpawnPoints(GetIDByForce(Forces.FORCE_1)), playerManager.team1Player, playerManager.team1PlayerArmy, playerManager.team1PlayerExtra, Forces.FORCE_1);
        this.force2Data = new AIForceData(this.getSpawnPoints(GetIDByForce(Forces.FORCE_2)), playerManager.team2Player, playerManager.team2PlayerArmy, playerManager.team2PlayerExtra, Forces.FORCE_2);
        this.force1Spawner = new AIGuardSpawner(this.force1Data);
        this.force2Spawner = new AIGuardSpawner(this.force2Data);

        this.banditNorthData = new AIForceData(this.getBanditSpawn(BanditCamp.CAMP_NORTH), b, b, b, Forces.FORCE_BANDIT);
        this.banditSouthData = new AIForceData(this.getBanditSpawn(BanditCamp.CAMP_SOUTH), b, b, b, Forces.FORCE_BANDIT);
        this.banditNorthSpawner = new AIBanditSpawner(this.banditNorthData, BanditCamp.CAMP_NORTH);
        this.banditSouthSpawner = new AIBanditSpawner(this.banditSouthData, BanditCamp.CAMP_SOUTH);

        this.tweakBanditData();
    }

    private tweakBanditData() {
        this.banditNorthData.amountOfCavalry = 0;
        this.banditSouthData.amountOfCavalry = 0;
        this.banditNorthData.amountOfArtillery = 0;
        this.banditSouthData.amountOfArtillery = 0;

        this.banditNorthData.meleeUnits = new SpawnWeight<string>(PlayerUnits.BANDIT_MELEE);
        this.banditSouthData.meleeUnits = new SpawnWeight<string>(PlayerUnits.BANDIT_MELEE);
        this.banditNorthData.rangedUnits = new SpawnWeight<string>(PlayerUnits.BANDIT_ASSASSIN);
        this.banditSouthData.rangedUnits = new SpawnWeight<string>(PlayerUnits.BANDIT_ASSASSIN);
        this.banditNorthData.casterUnits = new SpawnWeight<string>(PlayerUnits.BANDIT_ROUGE_WIZARD);
        this.banditSouthData.casterUnits = new SpawnWeight<string>(PlayerUnits.BANDIT_ROUGE_WIZARD);
    }

    public performAIReinforcements() {
        Logger.warning("Ai Wave.");
        this.force1Spawner.performUnitRevival();
        this.force2Spawner.performUnitRevival();
        this.banditNorthSpawner.performUnitRevival();
        this.banditSouthSpawner.performUnitRevival();
    }

    public getDataByForces(force: Forces) {
        switch (force) {
            case Forces.FORCE_1:
                return this.force1Data;

            case Forces.FORCE_2:
                return this.force2Data;

            case Forces.FORCE_BANDIT:
                return this.banditNorthData;
        }
    }

    public performAIRelocation() {
        Logger.warning("Force Relocate.");
        this.force1Spawner.replenishTroopsInAllCities();
        this.force2Spawner.replenishTroopsInAllCities();
    }

    public performBanditRelocation() {
        Logger.warning("Bandit Relocate.");
        this.banditNorthSpawner.replenishTroopsInAllCities();
        this.banditSouthSpawner.replenishTroopsInAllCities();
    }


    private getSpawnPoints(forceId: number): Point[] {
        let rectifier = Rectifier.getInstance();
        let rects = rectifier.getRectsByForceOfType(forceId, "spawner");
        let positions: Point[] = [];
        rects.forEach((value) => {
            let point = new Point(GetRectCenterX(value.value), GetRectCenterY(value.value));
            Quick.Push(positions, point);
        });
        return positions;
    }

    private getBanditSpawn(camp: BanditCamp): Point[] {
        let rectifier = Rectifier.getInstance();
        let rects = rectifier.getBySegment(new Segment(["banditcamp", tostring(camp), "spawner"]));
        let positions: Point[] = [];
        rects.forEach((value) => {
            let point = new Point(GetRectCenterX(value.value), GetRectCenterY(value.value));
            Quick.Push(positions, point);
        });
        return positions;
    }
}