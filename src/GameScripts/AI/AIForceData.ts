import {Point} from "../../TreeLib/Utility/Point";
import {Forces} from "../Enums/Forces";
import {SpawnWeight} from "./SpawnWeight";
import {Units} from "../Enums/Units";

export class AIForceData {
    public spawnLocations: Point[] = [];
    public aiPlayer: player;
    public aiPlayerArmy: player;
    public aiPlayerExtra: player;
    public force: Forces;

    public meleeUnits = new SpawnWeight<number>(Units.SOLDIER);
    public rangedUnits = new SpawnWeight<number>(Units.ARCHER);

    constructor(spawnLocations: Point[], aiPlayer: player, aiPlayerArmy: player, aiPlayerExtra: player, force: Forces) {
        this.spawnLocations = spawnLocations;
        this.aiPlayer = aiPlayer;
        this.aiPlayerArmy = aiPlayerArmy;
        this.aiPlayerExtra = aiPlayerExtra;
        this.force = force;
    }


    public getRandomSpawnPoint(): Point {
        return this.spawnLocations[GetRandomInt(0, this.spawnLocations.length - 1)];
    }
}