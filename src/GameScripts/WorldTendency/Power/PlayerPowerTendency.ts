import {Hooks} from "../../../TreeLib/Hooks";
import {Entity} from "../../../TreeLib/Entity";
import {Quick} from "../../../TreeLib/Quick";

export class PlayerPowerTendency extends Entity {
    private static instance: PlayerPowerTendency;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerPowerTendency();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        super();
        this._timerDelay = 1;
        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            this.tendencies[i] = 1;
            this.playerPower[i] = 1;
        }

    }

    public tendencies: number[] = [];
    public playerPower: number[] = [];
    public globalPower: number = 1;
    public heroes: unit[] = [];

    getPlayerXPTendency(p: player) {
        return math.max(this.tendencies[GetPlayerId(p)], 1);
    }

    getPlayerActualXPTendency(p: player) {
        return this.tendencies[GetPlayerId(p)];
    }

    getPlayerPowerLevel(p: player) {
        return this.playerPower[GetPlayerId(p)];
    }

    step() {
        this.heroes = [];
        this.globalPower = 0;

        let sum = 0;
        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            this.playerPower[i] = 0;

            let p = Player(i);
            let g = Quick.GroupToUnitArrayDestroy(GetUnitsOfPlayerAll(p));
            for (let j = 0; j < g.length; j++) {
                let unit = g[j];
                if (IsHeroUnitId(GetUnitTypeId(unit))) {
                    Quick.Push(this.heroes, unit);
                    this.playerPower[i] += GetHeroLevel(unit);
                    sum += GetHeroLevel(unit);
                }
            }
        }

        this.globalPower = sum / this.heroes.length;

        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            const p = Player(i);
            this.tendencies[i] = ((this.globalPower / this.playerPower[i]) + 1) / 2;
            SetPlayerHandicapXP(p, this.getPlayerActualXPTendency(p));
        }

    }

}