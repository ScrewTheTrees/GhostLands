import {Hooks} from "../../../TreeLib/Hooks";
import {Quick} from "../../../TreeLib/Quick";
import {UnitRespawner} from "../../../TreeLib/Respawner/UnitRespawner";
import {Entity} from "../../../TreeLib/Entity";
import {NeutralCreepCamp} from "./NeutralCreepCamp";
import {Players} from "../../../TreeLib/Structs/Players";
import {CampBuilding} from "./CampBuilding";
import {Point} from "../../../TreeLib/Utility/Point";
import {NamedRect} from "../../RectControl/NamedRect";
import {CreepCampTypes} from "./CreepCampTypes";
import {PlayerManager} from "../../PlayerManager";

export class CreepCamps extends Entity {
    private static instance: CreepCamps;
    public minRespawnRange = 3000;
    public camps: NeutralCreepCamp[] = [];

    constructor() {
        super();
        this._timerDelay = 10;
        this.spawnCamp(CampBuilding.FOREST_TROLL_HUT_SIZE_3, CreepCampTypes.FOREST_TROLL, 3);
        this.spawnCamp(CampBuilding.FOREST_TROLL_HUT_SIZE_5, CreepCampTypes.FOREST_TROLL, 5);
        this.spawnCamp(CampBuilding.FOREST_TROLL_HUT_SIZE_8, CreepCampTypes.FOREST_TROLL, 8);
        this.spawnCamp(CampBuilding.MURLOC_HUT_SIZE_3, CreepCampTypes.MURLOC, 3);
        this.spawnCamp(CampBuilding.MURLOC_HUT_SIZE_5, CreepCampTypes.MURLOC, 5);
        this.spawnCamp(CampBuilding.MURLOC_HUT_SIZE_8, CreepCampTypes.MURLOC, 8);
        this.spawnCamp(CampBuilding.EGG_SACK_SIZE_3, CreepCampTypes.SPIDER, 3);
        this.spawnCamp(CampBuilding.EGG_SACK_SIZE_5, CreepCampTypes.SPIDER, 5);
        this.spawnCamp(CampBuilding.EGG_SACK_SIZE_8, CreepCampTypes.SPIDER, 8);
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepCamps();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    onCreepRespawn(creep: UnitRespawner) {
        //TODO: Add replacements and tiering
    }

    step() {
        for (let i = 0; i < this.camps.length; i++) {
            let value = this.camps[i];
            value.update(this._timerDelay);
            if (value.secondTimer <= 0) {
                if (this.isCampAllowedToRespawn(value)) {
                    value.respawn();
                }
            }

        }
    }

    isCampAllowedToRespawn(camp: NeutralCreepCamp): boolean {
        let respawnLocation = camp.location.getCenter();
        let g = GetUnitsInRangeOfLocMatching(this.minRespawnRange, respawnLocation.toLocationClean(), null);
        const result = this.isActivePlayerInGroup(g);
        DestroyGroup(g);
        return result;
    }

    isActivePlayerInGroup(g: group) {
        const pm = PlayerManager.getInstance();
        let u = FirstOfGroup(g);
        while (u != null) {
            if (pm.isPlayerAnActiveMinion(GetOwningPlayer(u))) {
                return false;
            }
            GroupRemoveUnit(g, u);
            u = FirstOfGroup(g);
        }
        return true;
    }

    private spawnCamp(type: string, campType: CreepCampTypes, strength: number) {
        let num = 0;
        let namedRects = [];
        let group = Quick.GroupToUnitArray(GetUnitsOfPlayerAndTypeId(Players.NEUTRAL_HOSTILE, FourCC(type)));
        for (let i = 0; i < group.length; i++) {
            let val = group[i];
            let p = Point.fromWidget(val);
            let rect = Rect(p.x - 400, p.y - 400, p.x + 400, p.y + 400);
            Quick.Push(namedRects, new NamedRect("NeutralCreepCamp" + num, rect));
            num += 1;
            SetUnitOwner(val, Players.NEUTRAL_PASSIVE, true);
        }

        for (let i = 0; i < namedRects.length; i++) {
            let value = namedRects[i];
            let camp = new NeutralCreepCamp(value, [], campType, strength);
            Quick.Push(this.camps, camp);
            camp.respawn();
        }
    }
}


