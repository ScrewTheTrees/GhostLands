import {Hooks} from "../../TreeLib/Hooks";
import {AIForceData} from "./AIForceData";
import {PlayerManager} from "../PlayerManager";
import {Rectifier} from "../RectControl/Rectifier";
import {Point} from "../../TreeLib/Utility/Point";
import {AIUnitSpawner} from "./AIUnitSpawner";
import {Forces} from "../Enums/Forces";
import {AIBanditSpawner} from "./Bandits/AIBanditSpawner";
import {BanditCamp} from "./Bandits/BanditCamp";
import {Segment} from "../RectControl/Segment";
import {Logger} from "../../TreeLib/Logger";
import {Units} from "../Enums/Units";

export class AIManager {
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
    public force1Spawner: AIUnitSpawner;
    public force2Spawner: AIUnitSpawner;

    public banditNorthData: AIForceData;
    public banditSouthData: AIForceData;
    public banditNorthSpawner: AIBanditSpawner;
    public banditSouthSpawner: AIBanditSpawner;

    constructor() {
        let playerManager = PlayerManager.getInstance();
        let b = PlayerManager.getInstance().bandit;

        this.force1Data = new AIForceData(this.getSpawnPoints(1), playerManager.team1Player, playerManager.team1PlayerArmy, playerManager.team1PlayerExtra, Forces.FORCE_1);
        this.force2Data = new AIForceData(this.getSpawnPoints(2), playerManager.team2Player, playerManager.team2PlayerArmy, playerManager.team2PlayerExtra, Forces.FORCE_2);
        this.force1Spawner = new AIUnitSpawner(this.force1Data, 1);
        this.force2Spawner = new AIUnitSpawner(this.force2Data, 2);

        this.banditNorthData = new AIForceData(this.getBanditSpawn(BanditCamp.CAMP_NORTH), b, b, b, Forces.FORCE_BANDIT);
        this.banditSouthData = new AIForceData(this.getBanditSpawn(BanditCamp.CAMP_SOUTH), b, b, b, Forces.FORCE_BANDIT);
        this.banditNorthSpawner = new AIBanditSpawner(this.banditNorthData, BanditCamp.CAMP_NORTH);
        this.banditSouthSpawner = new AIBanditSpawner(this.banditSouthData, BanditCamp.CAMP_SOUTH);
    }

    public performAIReinforcements() {
        Logger.warning("Ai Wave.");
        this.force1Spawner.performUnitRevival();
        this.force2Spawner.performUnitRevival();
        this.banditNorthSpawner.performUnitRevival();
        this.banditSouthSpawner.performUnitRevival();
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

    public getHallPlayerByForce(force: Forces): player {
        switch (force) {
            case Forces.FORCE_1:
                return this.force1Data.aiPlayer;
            case Forces.FORCE_2:
                return this.force2Data.aiPlayer;
            case Forces.FORCE_BANDIT:
                return this.banditNorthData.aiPlayer; // Both bandits use the same players

        }
    }

    getHallByForce(force: Forces): number {
        switch (force) {
            case Forces.FORCE_1:
                return Units.HALL_FORCE_1;
            case Forces.FORCE_2:
                return Units.HALL_FORCE_2;
            case Forces.FORCE_BANDIT:
                return Units.HALL_FORCE_BANDITS;
        }
    }

    getForceByPlayer(p: player): Forces {
        let playerManager = PlayerManager.getInstance();
        if (playerManager.team1MinionsAll.indexOf(p) >= 0
            || playerManager.team1Player == p
            || playerManager.team1PlayerArmy == p
            || playerManager.team1PlayerExtra == p
        ) {
            return Forces.FORCE_1;
        }
        if (playerManager.team2MinionsAll.indexOf(p) >= 0
            || playerManager.team2Player == p
            || playerManager.team2PlayerArmy == p
            || playerManager.team2PlayerExtra == p
        ) {
            return Forces.FORCE_2;
        }
        return Forces.FORCE_BANDIT;
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

    private getBanditSpawn(camp: BanditCamp): Point[] {
        let rectifier = Rectifier.getInstance();
        let rects = rectifier.getBySegment(new Segment(["banditcamp", tostring(camp), "spawner"]));
        let positions: Point[] = [];
        rects.forEach((value) => {
            let point = new Point(GetRectCenterX(value.value), GetRectCenterY(value.value));
            positions.push(point);
        });
        return positions;
    }
}