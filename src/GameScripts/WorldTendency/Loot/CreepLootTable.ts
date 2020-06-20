import {IndexSpawnTable} from "../../../TreeLib/Utility/Data/IndexSpawnTable";
import {CreepLootQuality} from "./CreepLootQuality";

export namespace CreepLootTable {
    export function getTableByQuality(quality: CreepLootQuality) {
        switch (quality) {
            case CreepLootQuality.STANDARD:
            case CreepLootQuality.STANDARDS_SLOW:
                return STANDARD_TIER;
            default:
                return STANDARD_TIER;
        }
    }

    export const STANDARD_TIER = new IndexSpawnTable("I000", "I001", "I002", "I003", "I004", "I005");
}
