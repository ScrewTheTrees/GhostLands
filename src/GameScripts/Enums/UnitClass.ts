import {PlayerUnits} from "./PlayerUnits";
import {InverseFourCC} from "../../TreeLib/Misc";

export const enum UnitClass {
    ERROR = "ERROR",
    MELEE = "MELEE",
    RANGED = "RANGED",
    CASTER = "CASTER",
    CAVALRY = "CAVALRY",
    ARTILLERY = "ARTILLERY",
}

export function GetUnitClassFromString(type: string): UnitClass {
    switch (type.toUpperCase()) {
        case UnitClass.MELEE:
            return UnitClass.MELEE;
        case UnitClass.RANGED:
            return UnitClass.RANGED;
        case UnitClass.CASTER:
            return UnitClass.CASTER;
        case UnitClass.CAVALRY:
            return UnitClass.CAVALRY;
        case UnitClass.ARTILLERY:
            return UnitClass.ARTILLERY;

        default:
            return UnitClass.ERROR;
    }

}


export function GetUnitClassFromUnitType(e: number): UnitClass {
    const u = InverseFourCC(e);
    switch (u) {
        case PlayerUnits.MELEE_SOLDIER:
            return UnitClass.MELEE;

        case PlayerUnits.RANGER_ARCHER:
        case PlayerUnits.RANGER_FOREST_TROLL:
            return UnitClass.RANGED;

        case PlayerUnits.CASTER_PRIEST:
        case PlayerUnits.CASTER_SORCERESS:
            return UnitClass.CASTER;

        case PlayerUnits.CAVALRY_KNIGHT:
            return UnitClass.CAVALRY;

        case PlayerUnits.ARTILLERY_DEMOLISHER:
            return UnitClass.ARTILLERY;

        default:
            return UnitClass.ERROR;
    }
}

export function GetDelayFromUnitClass(type: UnitClass): number {
    switch (type) {
        case UnitClass.MELEE:
            return 1;
        case UnitClass.RANGED:
            return 3;
        case UnitClass.CASTER:
            return 3;
        case UnitClass.CAVALRY:
            return 2;
        case UnitClass.ARTILLERY:
            return 4;

        default:
            return 0;
    }
}

export function GetGuardTypeFromUnit(u: unit): UnitClass {
    return GetUnitClassFromUnitType(GetUnitTypeId(u));
}

export function GetDelayFromUnit(u: unit) {
    return GetDelayFromUnitClass(GetUnitClassFromUnitType(GetUnitTypeId(u)))
}