import {Hooks} from "../../TreeLib/Hooks";
import {Rectifier} from "../RectControl/Rectifier";
import {Quick} from "../../TreeLib/Quick";
import {Logger} from "../../TreeLib/Logger";
import {UnitRespawner} from "../../TreeLib/Respawner/UnitRespawner";
import {NamedRect} from "../RectControl/NamedRect";
import {ShitEx} from "../../TreeLib/ShitEx";
import {Segment} from "../RectControl/Segment";
import {IsValidUnit} from "../../TreeLib/Misc";
import {Entity} from "../../TreeLib/Entity";
import {Players} from "../../TreeLib/Structs/Players";

export class CreepCamps extends Entity {
    private static instance: CreepCamps;
    public minRespawnRange = 3000;
    public camps: NeutralCreepCamp[] = [];

    constructor() {
        super();
        this._timerDelay = 10;
        let namedRects = Rectifier.getInstance().getBySegmentNames("creepcamp", "");

        for (let i = 0; i < namedRects.length; i++) {
            let value = namedRects[i];
            let neutral = Player(PLAYER_NEUTRAL_AGGRESSIVE);
            let group = GetUnitsInRectOfPlayer(value.value, neutral);
            let creeps: unit[] = [];

            let toAdd = FirstOfGroup(group);
            while (toAdd != null) {
                Quick.Push(creeps, toAdd);
                GroupRemoveUnit(group, toAdd);
                toAdd = FirstOfGroup(group);
            }

            let camp = new NeutralCreepCamp(value, creeps, new Segment(ShitEx.separateNumbers(value.name)));
            Quick.Push(this.camps, camp);
        }
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepCamps();
            Hooks.set("CreepCamps", this.instance);
        }
        return this.instance;
    }

    step() {
        for (let i = 0; i < this.camps.length; i++) {
            let value = this.camps[i];
            value.update();
            if (value.isCampDead() && value.secondTimer <= 0) {
                if (this.isCampAllowedToRespawn(value)) {
                    value.respawn();
                }
            }

        }
    }

    onCreepRespawn(creep: UnitRespawner) {
        //TODO: Add replacements and tiering (if wanted)
    }

    isCampAllowedToRespawn(camp: NeutralCreepCamp): boolean {
        let respawnLocation = camp.location.getCenter();
        let g = GetUnitsInRangeOfLocAll(this.minRespawnRange, respawnLocation.toLocationClean());
        const result = FirstOfGroup(g) == null;
        DestroyGroup(g);
        return result;
    }
}


export const enum CreepCampTypes {
    MURLOC = "MURLOC",
    FOREST_TROLL = "FOREST_TROLL",
    UNKNOWN = "UNKNOWN",
}

export namespace CreepCampSpawnTable {
    export const MURLOCS = ["n000", "n001", "n002", "n003", "n004"];
    export const FOREST_TROLLS = ["n005", "n006", "n007", "n008", "n009"];
}

export function GetTableByCreepCampType(creepCampType: CreepCampTypes): string[] {
    switch (creepCampType) {
        case CreepCampTypes.MURLOC:
            return CreepCampSpawnTable.MURLOCS;
        case CreepCampTypes.FOREST_TROLL:
            return CreepCampSpawnTable.FOREST_TROLLS;

        default:
            return [];
    }
}

export function GetRandomCreepByCreepCampType(creepCampType: CreepCampTypes): string {
    let strings = GetTableByCreepCampType(creepCampType);
    return strings[GetRandomInt(0, strings.length - 1)];
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

export class NeutralCreepCamp {
    public location: NamedRect;
    public campType: CreepCampTypes;
    public creeps: unit[];
    public noOfCreeps: number;

    public secondTimer: number = 120;

    constructor(location: NamedRect, creeps: unit[], segment: Segment) {
        this.location = location;
        this.creeps = creeps;
        this.campType = GetCreepCampTypeFromString(segment.segment2);
        this.noOfCreeps = this.creeps.length;

        Logger.generic(`Created creep camp of ${creeps.length} creeps at: ${location.getCenter().toString()} of ${this.campType}`);
    }

    public isCampDead() {
        return this.creeps.length == 0;
    }

    public respawn() {
        for (let i = 0; i < this.noOfCreeps; i++) {
            let point = this.location.getRandomPoint();
            let u = CreateUnit(Players.NEUTRAL_HOSTILE, FourCC(GetRandomCreepByCreepCampType(this.campType)), point.x, point.y, GetRandomInt(0, 360));
            Quick.Push(this.creeps, u);
        }

        this.secondTimer = 120;
    }

    public update() {
        for (let i = 0; i < this.creeps.length; i++) {
            let value = this.creeps[i];
            if (!IsValidUnit(value)) {
                Quick.Splice(this.creeps, i);
                i -= 1;
            }
        }
        if (this.isCampDead()) {
            this.secondTimer -= 10;
            print("--- " + this.secondTimer);
        }
    }


}