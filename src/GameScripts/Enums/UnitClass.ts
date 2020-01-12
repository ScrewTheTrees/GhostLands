import {Units} from "./Units";
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
        case Units.MELEE_SOLDIER:
            return UnitClass.MELEE;

        case Units.RANGER_ARCHER:
        case Units.RANGER_FOREST_TROLL:
            return UnitClass.RANGED;

        case Units.CASTER_PRIEST:
        case Units.CASTER_SORCERESS:
            return UnitClass.CASTER;

        case Units.CAVALRY_KNIGHT:
            return UnitClass.CAVALRY;

        case Units.ARTILLERY_DEMOLISHER:
            return UnitClass.ARTILLERY;

        default:
            return UnitClass.ERROR;
    }
}

export function GetGuardTypeFromUnit(u: unit): UnitClass {
    return GetUnitClassFromUnitType(GetUnitTypeId(u));
}