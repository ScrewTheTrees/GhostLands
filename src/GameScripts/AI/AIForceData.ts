import {Point} from "../../TreeLib/Utility/Point";

export class AIForceData {
    public spawnLocations: Point[] = [];
    public aiPlayer: player;
    public aiPlayerArmy: player;
    public aiPlayerExtra: player;

    constructor(spawnLocations: Point[], aiPlayer: player, aiPlayerArmy: player, aiPlayerExtra: player) {
        this.spawnLocations = spawnLocations;
        this.aiPlayer = aiPlayer;
        this.aiPlayerArmy = aiPlayerArmy;
        this.aiPlayerExtra = aiPlayerExtra;
    }


    public getRandomSpawnPoint(): Point {
        return this.spawnLocations[GetRandomInt(0, this.spawnLocations.length - 1)];
    }
}