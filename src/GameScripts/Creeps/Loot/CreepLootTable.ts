import {SpawnTable} from "../SpawnTable";

export namespace CreepLootTable {
    export function getTableByLevel(level: number) {
        switch (level) {
            case 1:
                return TIER_1;
            default:
                return TIER_1;
        }
    }

    export const TIER_1 = new SpawnTable("I000", "I001", "I002", "I003", "I004");
}
