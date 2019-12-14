import {Hooks} from "../../TreeLib/Hooks";
import {PlayerManager} from "../PlayerManager";
import {Units} from "../Enums/Units";
import {Occupations} from "../GameState/Occupations";
import {AIManager} from "../AI/AIManager";

export class PlayerUnitBuilder {
    private static instance: PlayerUnitBuilder;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerUnitBuilder();
            Hooks.set("PlayerUnitBuilder", this.instance);
        }
        return this.instance;
    }

    private playerManager: PlayerManager = PlayerManager.getInstance();
    private aiManager: AIManager = AIManager.getInstance();

    public execute() {
        for (let i = 0; i < this.playerManager.team1Minions.length; i++) {
            let minion = this.playerManager.team1Minions[i];
            let startX = GetPlayerStartLocationX(minion);
            let startY = GetPlayerStartLocationY(minion);
            CreateUnit(minion, Units.GRAND_GENERAL, startX, startY, 270);
        }

        let occupants = Occupations.getInstance().getAllOccupants();

        for (let i = 0; i < occupants.length; i++) {
            let occu = occupants[i];
            let loc = occu.primaryRect.getCenter();
            CreateUnit(this.aiManager.getHallPlayerByForce(occu.owner), this.aiManager.getHallByForce(occu.owner), loc.x, loc.y, bj_UNIT_FACING);
        }
    }
}