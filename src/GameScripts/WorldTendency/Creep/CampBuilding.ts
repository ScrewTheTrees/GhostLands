export namespace CampBuilding {
    export const FOREST_TROLL_HUT = "n00G";
    export const ICE_TROLL_HUT = "n00T";
    export const DARK_TROLL_HUT = "n010";
    export const MURLOC_HUT = "n00H";
    export const EGG_SACK = "n00I";


    export const GENERIC_RANDOM_CAMP = "n00C";
    export const NORTH_RANDOM_CAMP = "n00U";
    export const SOUTH_RANDOM_CAMP = "n011";


    export const GENERIC_CAMPS = [FOREST_TROLL_HUT, EGG_SACK];
    export const NORTH_CAMPS = [ICE_TROLL_HUT, EGG_SACK];
    export const SOUTH_CAMPS = [DARK_TROLL_HUT, EGG_SACK];

    export function GetRandomGenericCamp() {
        return GENERIC_CAMPS[GetRandomInt(0, GENERIC_CAMPS.length - 1)];
    }
    export function GetRandomNorthCamp() {
        return NORTH_CAMPS[GetRandomInt(0, NORTH_CAMPS.length - 1)];
    }
    export function GetRandomSouthCamp() {
        return SOUTH_CAMPS[GetRandomInt(0, SOUTH_CAMPS.length - 1)];
    }
}