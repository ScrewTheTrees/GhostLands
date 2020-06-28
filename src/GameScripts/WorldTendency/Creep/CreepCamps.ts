import {Hooks} from "../../../TreeLib/Hooks";
import {Quick} from "../../../TreeLib/Quick";
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

        this.replaceRandomCamps(CampBuilding.GENERIC_RANDOM_CAMP, CampBuilding.GetRandomGenericCamp);

        this.spawnCamp(CampBuilding.FOREST_TROLL_HUT, CreepCampTypes.FOREST_TROLL);
        this.spawnCamp(CampBuilding.MURLOC_HUT, CreepCampTypes.MURLOC);
        this.spawnCamp(CampBuilding.EGG_SACK, CreepCampTypes.SPIDER);
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepCamps();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
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

    private replaceRandomCamps(input: string, getRandomCampFunc: () => string) {
        let group = Quick.GroupToUnitArray(GetUnitsOfPlayerAndTypeId(Players.NEUTRAL_HOSTILE, FourCC(input)));
        for (let i = 0; i < group.length; i++) {
            let val = group[i];
            let camp = getRandomCampFunc();
            let pos = Point.fromWidget(val);
            RemoveUnit(val);
            CreateUnit(Players.NEUTRAL_HOSTILE, FourCC(camp), pos.x, pos.y, bj_UNIT_FACING);
        }
    }

    private spawnCamp(type: string, campType: CreepCampTypes) {
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
            let strength = this.resolveStrength(value);
            let camp = new NeutralCreepCamp(value, [], campType, strength);
            Quick.Push(this.camps, camp);
            camp.respawn();
        }
    }

    private resolveStrength(namedRect: NamedRect) {
        let map = GetEntireMapRect();
        let cornerUpLeft = new Point(GetRectMinX(map), GetRectMaxY(map));
        let cornerDownRight = new Point(GetRectMaxX(map), GetRectMinY(map));
        let campLoc = namedRect.getCenter();
        let dist = math.min(campLoc.distanceTo(cornerUpLeft), campLoc.distanceTo(cornerDownRight));
        return math.ceil(dist / 20_000) + 4;
    }
}


