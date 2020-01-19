import {CreepSpawnTable} from "./CreepSpawnTable";
import {CreepCampTypes} from "./CreepCampTypes";

export namespace CreepCampSpawnTable {
    export const MURLOCS = new CreepSpawnTable("n000", "n001", "n002", "n003", "n004");
    export const FOREST_TROLLS = new CreepSpawnTable("n005", "n006", "n007", "n008", "n009");
}

export function GetCreepTableByCreepCampType(creepCampType: CreepCampTypes): CreepSpawnTable {
    switch (creepCampType) {
        case CreepCampTypes.MURLOC:
            return CreepCampSpawnTable.MURLOCS;
        case CreepCampTypes.FOREST_TROLL:
            return CreepCampSpawnTable.FOREST_TROLLS;

        default:
            return new CreepSpawnTable();
    }
}