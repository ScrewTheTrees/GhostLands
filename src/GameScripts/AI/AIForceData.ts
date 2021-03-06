import {Point} from "../../TreeLib/Utility/Point";
import {Forces} from "../Enums/Forces";
import {SpawnWeight} from "./SpawnWeight";
import {GameUnits} from "../Enums/GameUnits";
import {UnitClass} from "../Enums/UnitClass";
import {Logger} from "../../TreeLib/Logger";

export class AIForceData {
    public spawnLocations: Point[] = [];
    public aiPlayer: player;
    public aiPlayerArmy: player;
    public aiPlayerExtra: player;
    public force: Forces;

    public meleeUnits = new SpawnWeight<string>(GameUnits.MELEE_SOLDIER);
    public rangedUnits = new SpawnWeight<string>(GameUnits.RANGER_ARCHER);
    public casterUnits = new SpawnWeight<string>(GameUnits.CASTER_PRIEST);
    public cavalryUnits = new SpawnWeight<string>(GameUnits.CAVALRY_KNIGHT);
    public artilleryUnits = new SpawnWeight<string>(GameUnits.ARTILLERY_DEMOLISHER);

    public amountOfMelee: number = 14;
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
    }


    public getRandomSpawnPoint(): Point {
        return this.spawnLocations[GetRandomInt(0, this.spawnLocations.length - 1)];
    }

    public getUnitTypeOfUnitClass(type: UnitClass) {
        switch (type) {
            case UnitClass.MELEE:
                return FourCC(this.meleeUnits.getRandom());
            case UnitClass.RANGED:
                return FourCC(this.rangedUnits.getRandom());
            case UnitClass.CASTER:
                return FourCC(this.casterUnits.getRandom());
            case UnitClass.CAVALRY:
                return FourCC(this.cavalryUnits.getRandom());
            case UnitClass.ARTILLERY:
                return FourCC(this.artilleryUnits.getRandom());
            default:
                Logger.critical(`Trying to fetch unitType of undefined UnitClass: ${type}`);
                return 0;
        }
    }
}