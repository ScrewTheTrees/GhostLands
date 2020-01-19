import {Hooks} from "../../TreeLib/Hooks";
import {Quick} from "../../TreeLib/Quick";
import {UnitRespawner} from "../../TreeLib/Respawner/UnitRespawner";
import {Entity} from "../../TreeLib/Entity";
import {NeutralCreepCamp} from "./NeutralCreepCamp";
import {Players} from "../../TreeLib/Structs/Players";
import {CampBuilding} from "./CampBuilding";
import {Point} from "../../TreeLib/Utility/Point";
import {NamedRect} from "../RectControl/NamedRect";
import {CreepCampTypes} from "./CreepCampTypes";

export class CreepCamps extends Entity {
    private static instance: CreepCamps;
    public minRespawnRange = 3000;
    public camps: NeutralCreepCamp[] = [];

    constructor() {
        super();
        this._timerDelay = 10;
        this.spawnCamp(CampBuilding.FOREST_TROLL_HUT, CreepCampTypes.FOREST_TROLL, 5);
        this.spawnCamp(CampBuilding.MURLOC_HUT, CreepCampTypes.MURLOC, 5);
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepCamps();
            Hooks.set("CreepCamps", this.instance);
        }
        return this.instance;
    }

    onCreepRespawn(creep: UnitRespawner) {
        //TODO: Add replacements and tiering
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

    private spawnCamp(type: string, campType: CreepCampTypes, strength: number) {
        let num = 0;
        let namedRects = [];
        let group = Quick.groupToUnitArray(GetUnitsOfPlayerAndTypeId(Players.NEUTRAL_HOSTILE, FourCC(type)));
        for (let i = 0; i < group.length; i++) {
            let val = group[i];
            let p = Point.fromWidget(val);
            let rect = Rect(p.x - 256, p.y - 256, p.x + 256, p.y + 256);
            Quick.Push(namedRects, new NamedRect("NeutralCreepCamp" + num, rect));
            num += 1;
            RemoveUnit(val);
        }

        for (let i = 0; i < namedRects.length; i++) {
            let value = namedRects[i];

            let camp = new NeutralCreepCamp(value, [], campType, strength);
            Quick.Push(this.camps, camp);
            camp.respawn();
        }
    }

    isCampAllowedToRespawn(camp: NeutralCreepCamp): boolean {
        let respawnLocation = camp.location.getCenter();
        let g = GetUnitsInRangeOfLocAll(this.minRespawnRange, respawnLocation.toLocationClean());
        const result = FirstOfGroup(g) == null;
        DestroyGroup(g);
        return result;
    }
}

