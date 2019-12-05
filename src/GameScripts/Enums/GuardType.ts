export enum GuardType {
    ERROR = "ERROR",
    MELEE = "MELEE",
    ARCHER = "ARCHER",
    CAVALRY = "CAVALRY",
    ARTILLERY = "ARTILLERY",
}

export function GetGuardTypeFromString(type: string): GuardType {
    switch (type.toUpperCase()) {
        case GuardType.MELEE:
            return GuardType.MELEE;
        case GuardType.ARCHER:
            return GuardType.ARCHER;
        case GuardType.CAVALRY:
            return GuardType.CAVALRY;
        case GuardType.ARTILLERY:
            return GuardType.ARTILLERY;

        default:
            return GuardType.ERROR;
    }

}