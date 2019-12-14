import {Hooks} from "../../TreeLib/Hooks";
import {PlayerManager} from "../PlayerManager";
import {Units} from "../Enums/Units";
import {Occupations} from "../GameState/Occupations";

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
    private occupations: Occupations = Occupations.getInstance();

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
            occu.keepUnit = CreateUnit(this.occupations.getHallPlayerByForce(occu.owner), this.occupations.getHallByForce(occu.owner), loc.x, loc.y, bj_UNIT_FACING);
        }
    }
}