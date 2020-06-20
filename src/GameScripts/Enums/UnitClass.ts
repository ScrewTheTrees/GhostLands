import {GameUnits} from "./GameUnits";
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
        case GameUnits.MELEE_SOLDIER:
        case GameUnits.BANDIT_MELEE:
            return UnitClass.MELEE;

        case GameUnits.RANGER_ARCHER:
        case GameUnits.RANGER_FOREST_TROLL:
        case GameUnits.BANDIT_ASSASSIN:
            return UnitClass.RANGED;

        case GameUnits.CASTER_PRIEST:
        case GameUnits.CASTER_SORCERESS:
        case GameUnits.BANDIT_ROUGE_WIZARD:
            return UnitClass.CASTER;

        case GameUnits.CAVALRY_KNIGHT:
            return UnitClass.CAVALRY;

        case GameUnits.ARTILLERY_DEMOLISHER:
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