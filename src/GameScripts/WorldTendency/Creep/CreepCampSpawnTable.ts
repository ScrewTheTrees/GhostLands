import {IndexSpawnTable} from "../../../TreeLib/Utility/Data/IndexSpawnTable";
import {CreepCampTypes} from "./CreepCampTypes";

export namespace CreepCampSpawnTable {
    export const MURLOCS = new IndexSpawnTable("n000", "n001", "n002", "n003", "n004", "n00F", "n00E");
    export const FOREST_TROLLS = new IndexSpawnTable("n005", "n006", "n007", "n008", "n009");
    export const ICE_TROLLS = new IndexSpawnTable("n00D", "n00J", "n00O", "n00P", "n00Q");
    export const DARK_TROLLS = new IndexSpawnTable("n00V", "n00W", "n00X", "n00Y", "n00Z");
    export const SPIDER = new IndexSpawnTable("n00K", "n00L", "n00M", "n00N");
}

export function GetCreepTableByCreepCampType(creepCampType: CreepCampTypes): IndexSpawnTable {
    switch (creepCampType) {
        case CreepCampTypes.MURLOC:
            return CreepCampSpawnTable.MURLOCS;
        case CreepCampTypes.FOREST_TROLL:
            return CreepCampSpawnTable.FOREST_TROLLS;
        case CreepCampTypes.ICE_TROLLS:
            return CreepCampSpawnTable.ICE_TROLLS;
        case CreepCampTypes.DARK_TROLLS:
            return CreepCampSpawnTable.DARK_TROLLS;
        case CreepCampTypes.SPIDER:
            return CreepCampSpawnTable.SPIDER;

        default:
            return new IndexSpawnTable();
    }
}