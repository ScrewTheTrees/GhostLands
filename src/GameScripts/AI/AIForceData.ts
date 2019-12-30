import {Point} from "../../TreeLib/Utility/Point";
import {Forces} from "../Enums/Forces";
import {SpawnWeight} from "./SpawnWeight";
import {Units} from "../Enums/Units";
import {UnitClass} from "../Enums/UnitClass";
import {Logger} from "../../TreeLib/Logger";

export class AIForceData {
    public spawnLocations: Point[] = [];
    public aiPlayer: player;
    public aiPlayerArmy: player;
    public aiPlayerExtra: player;
    public force: Forces;

    public meleeUnits = new SpawnWeight<number>(Units.MELEE_SOLDIER);
    public rangedUnits = new SpawnWeight<number>(Units.RANGER_ARCHER);
    public casterUnits = new SpawnWeight<number>(Units.CASTER_PRIEST);
    public cavalryUnits = new SpawnWeight<number>(Units.CAVALRY_KNIGHT);
    public artilleryUnits = new SpawnWeight<number>(Units.ARTILLERY_DEMOLISHER);

    public amountOfMelee: number = 20;
    public amountOfRanged: number = 8;
    public amountOfCasters: number = 4;
    public amountOfCavalry: number = 3;
    public amountOfArtillery: number = 1;

    constructor(spawnLocations: Point[], aiPlayer: player, aiPlayerArmy: player, aiPlayerExtra: player, force: Forces) {
        this.spawnLocations = spawnLocations;
        this.aiPlayer = aiPlayer;
        this.aiPlayerArmy = aiPlayerArmy;
        this.aiPlayerExtra = aiPlayerExtra;
        this.force = force;

        this.rangedUnits.add(Units.RANGER_FOREST_TROLL, 20);
        this.casterUnits.add(Units.CASTER_SORCERESS, 50);
    }


    public getRandomSpawnPoint(): Point {
        return this.spawnLocations[GetRandomInt(0, this.spawnLocations.length - 1)];
    }

    public getUnitTypeOfUnitClass(type: UnitClass) {
        switch (type) {
            case UnitClass.MELEE:
                return this.meleeUnits.getRandom();
            case UnitClass.RANGED:
                return this.rangedUnits.getRandom();
            case UnitClass.CASTER:
                return this.casterUnits.getRandom();
            case UnitClass.CAVALRY:
                return this.cavalryUnits.getRandom();
            case UnitClass.ARTILLERY:
                return this.artilleryUnits.getRandom();
            default:
                Logger.critical(`Trying to fetch unitType of undefined UnitClass: ${type}`);
                return 0;
        }
    }
}