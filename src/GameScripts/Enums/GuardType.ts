import {Units} from "./Units";

export enum GuardType {
    ERROR = "ERROR",
    MELEE = "MELEE",
    RANGED = "RANGED",
    CAVALRY = "CAVALRY",
    ARTILLERY = "ARTILLERY",
}

export function GetGuardTypeFromString(type: string): GuardType {
    switch (type.toUpperCase()) {
        case GuardType.MELEE:
            return GuardType.MELEE;
        case GuardType.RANGED:
            return GuardType.RANGED;
        case GuardType.CAVALRY:
            return GuardType.CAVALRY;
        case GuardType.ARTILLERY:
            return GuardType.ARTILLERY;

        default:
            return GuardType.ERROR;
    }

}

export function GetGuardTypeFromUnitType(u: number): GuardType {
    switch (u) {
        case Units.SOLDIER:
            return GuardType.MELEE;
        case Units.ARCHER:
            return GuardType.RANGED;
        default:
            return GuardType.ERROR;
    }
}

export function GetGuardTypeFromUnit(u: unit): GuardType {
    return GetGuardTypeFromUnitType(GetUnitTypeId(u));
}