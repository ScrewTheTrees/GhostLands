import {IndexSpawnTable} from "../../../TreeLib/Utility/Data/IndexSpawnTable";
import {CreepLootQuality} from "./CreepLootQuality";
import {GameItems} from "../../Enums/GameItems";

export namespace CreepLootTable {
    export function getTableByQuality(quality: CreepLootQuality) {
        switch (quality) {
            case CreepLootQuality.STANDARD:
            case CreepLootQuality.STANDARDS_SLOW:
                return STANDARD_TIER;
            case CreepLootQuality.RARE:
                return RARE_TIER;
            default:
                return STANDARD_TIER;
        }
    }

    export const STANDARD_TIER = new IndexSpawnTable(
        GameItems.HEALING_SALVE,
        GameItems.LESSER_CLARITY_POTION,
        GameItems.SCROLL_OF_HEALING,
        GameItems.SCROLL_OF_REGENERATION,
        GameItems.SCROLL_OF_SPEED
    );

    export const RARE_TIER = new IndexSpawnTable(
        GameItems.ARMOR_SHARDS,
        GameItems.WEAPON_PARTS
    );
}
