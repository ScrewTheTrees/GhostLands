export const enum CreepCampTypes {
    MURLOC = "MURLOC",
    FOREST_TROLL = "FOREST_TROLL",
    UNKNOWN = "UNKNOWN",
}

export function GetCreepCampTypeFromString(camp: string): CreepCampTypes {
    camp = camp.toUpperCase().replace(" ", "_");
    switch (camp) {
        case CreepCampTypes.MURLOC:
            return CreepCampTypes.MURLOC;
        case CreepCampTypes.FOREST_TROLL:
            return CreepCampTypes.FOREST_TROLL;

        default:
            return CreepCampTypes.UNKNOWN;
    }
}