import {Hooks} from "./TreeLib/Hooks";
import {PlayerUnits} from "./GameScripts/Enums/PlayerUnits";
import {InverseFourCC} from "./TreeLib/Misc";

export function CreateUnitHandleSkin(id: player, unitid: number, x: number, y: number, face: number): unit {
    let u = CreateUnit(id, unitid, x, y, face);
    BlzSetUnitSkin(u, Skinner.getInstance().getRandomSkinOfUnit(u));
    return u;
}

export function ApplySkinToUnit(u: unit) {
    BlzSetUnitSkin(u, Skinner.getInstance().getRandomSkinOfUnit(u));
}

export class Skinner {
    private static instance: Skinner;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Skinner();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public skins: string[][] = [];

    constructor() {
        this.skins[PlayerUnits.RANGER_ARCHER] = [PlayerUnits.RANGER_ARCHER, PlayerUnits.RANGER_ARCHER_SKIN1];
        this.skins[PlayerUnits.MELEE_SOLDIER] = [PlayerUnits.MELEE_SOLDIER, PlayerUnits.MELEE_SOLDIER_SKIN1, PlayerUnits.MELEE_SOLDIER_SKIN2];
    }

    public getRandomSkinOfUnit(u: unit): number {
        let type = GetUnitTypeId(u);
        let sk: string[] = this.skins[InverseFourCC(type)];

        if (sk != null) {
            return FourCC(sk[GetRandomInt(0, sk.length - 1)]);
        }

        return type;
    }




}