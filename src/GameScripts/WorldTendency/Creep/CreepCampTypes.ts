export const enum CreepCampTypes {
    MURLOC = "MURLOC",
    FOREST_TROLL = "FOREST_TROLL",
    ICE_TROLLS = "ICE_TROLLS",
    DARK_TROLLS = "DARK_TROLLS",
    SPIDER = "SPIDER",
    UNKNOWN = "UNKNOWN",
}

export function GetCreepCampTypeFromString(camp: string): CreepCampTypes {
    camp = camp.toUpperCase().replace(" ", "_");
    switch (camp) {
        case CreepCampTypes.MURLOC:
            return CreepCampTypes.MURLOC;
        case CreepCampTypes.FOREST_TROLL:
            return CreepCampTypes.FOREST_TROLL;
        case CreepCampTypes.ICE_TROLLS:
            return CreepCampTypes.ICE_TROLLS;
        case CreepCampTypes.DARK_TROLLS:
            return CreepCampTypes.DARK_TROLLS;
        case CreepCampTypes.SPIDER:
            return CreepCampTypes.SPIDER;

        default:
            return CreepCampTypes.UNKNOWN;
    }
}