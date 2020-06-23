export namespace CampBuilding {
    export const FOREST_TROLL_HUT = "n00G";
    export const ICE_TROLL_HUT = "n00T";
    export const DARK_TROLL_HUT = "n010";
    export const MURLOC_HUT = "n00H";
    export const EGG_SACK = "n00I";


    export const GENERIC_RANDOM_CAMP = "n00C";


    export const GENERIC_CAMPS = [FOREST_TROLL_HUT, EGG_SACK];

    export function GetRandomGenericCamp() {
        return GENERIC_CAMPS[GetRandomInt(0, GENERIC_CAMPS.length - 1)];
    }
}