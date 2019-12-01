import {Hooks} from "../../TreeLib/Hooks";
import {PlayerManager} from "../PlayerManager";
import {Units} from "../Enums/Units";

export class PlayerUnitBuilder {
    private static instance: PlayerUnitBuilder;
    private playerManager: PlayerManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerUnitBuilder();
            Hooks.set("PlayerUnitBuilder", this.instance);
        }
        return this.instance;
    }

    constructor() {
        this.playerManager = PlayerManager.getInstance();
    }

    public execute() {
        for (let i = 0; i < this.playerManager.team1Minions.length; i++) {
            let minion = this.playerManager.team1Minions[i];
            let startX = GetPlayerStartLocationX(minion);
            let startY = GetPlayerStartLocationY(minion);
            let hero = CreateUnit(minion, Units.GRAND_GENERAL, startX, startY, 270);
        }
    }
}