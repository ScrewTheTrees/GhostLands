import {Units} from "./Units";

export enum UnitClass {
    ERROR = "ERROR",
    MELEE = "MELEE",
    RANGED = "RANGED",
    CAVALRY = "CAVALRY",
    ARTILLERY = "ARTILLERY",
}

export function GetUnitClassFromString(type: string): UnitClass {
    switch (type.toUpperCase()) {
        case UnitClass.MELEE:
            return UnitClass.MELEE;
        case UnitClass.RANGED:
            return UnitClass.RANGED;
        case UnitClass.CAVALRY:
            return UnitClass.CAVALRY;
        case UnitClass.ARTILLERY:
            return UnitClass.ARTILLERY;

        default:
            return UnitClass.ERROR;
    }

}

export function GetUnitClassFromUnitType(u: number): UnitClass {
    switch (u) {
        case Units.SOLDIER:
            return UnitClass.MELEE;
        case Units.ARCHER:
        case Units.FOREST_TROLL:
            return UnitClass.RANGED;
        default:
            return UnitClass.ERROR;
    }
}

export function GetGuardTypeFromUnit(u: unit): UnitClass {
    return GetUnitClassFromUnitType(GetUnitTypeId(u));
}