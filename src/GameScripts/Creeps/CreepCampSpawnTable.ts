import {SpawnTable} from "./SpawnTable";
import {CreepCampTypes} from "./CreepCampTypes";

export namespace CreepCampSpawnTable {
    export const MURLOCS = new SpawnTable("n000", "n001", "n002", "n003", "n004", "n00F", "n00E");
    export const FOREST_TROLLS = new SpawnTable("n005", "n006", "n007", "n008", "n009");
    export const SPIDER = new SpawnTable("n00K", "n00L", "n00M", "n00N");
}

export function GetCreepTableByCreepCampType(creepCampType: CreepCampTypes): SpawnTable {
    switch (creepCampType) {
        case CreepCampTypes.MURLOC:
            return CreepCampSpawnTable.MURLOCS;
        case CreepCampTypes.FOREST_TROLL:
            return CreepCampSpawnTable.FOREST_TROLLS;
        case CreepCampTypes.SPIDER:
            return CreepCampSpawnTable.SPIDER;

        default:
            return new SpawnTable();
    }
}