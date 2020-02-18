import {IndexSpawnTable} from "../../../../TreeLib/Utility/Data/IndexSpawnTable";

export namespace CreepLootTable {
    export function getTableByLevel(level: number) {
        switch (level) {
            case 1:
            case 2:
                return TIER_1;
            default:
                return TIER_1;
        }
    }

    export const TIER_1 = new IndexSpawnTable("I000", "I001", "I002", "I003", "I004");
}
