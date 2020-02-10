import {Hooks} from "../../TreeLib/Hooks";
import {PlayerManager} from "../PlayerManager";
import {Logger} from "../../TreeLib/Logger";
import {Rectifier} from "../RectControl/Rectifier";

export class StartGameDiag {
    private static instance: StartGameDiag;
    private playMan: PlayerManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new StartGameDiag();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        this.playMan = PlayerManager.getInstance();
    }

    public runDiagnosis(): number {
        let errors = 0;

        let team1Length = this.playMan.team1Minions.length;
        let team2Length = this.playMan.team2Minions.length;

        if (team1Length != team2Length) {
            Logger.warning("Uneven teams have been detected, Team1: ", team1Length, " - vs - ", team2Length);
            errors += 1;
        }
        if (Rectifier.getInstance().rects.length == 0) {
            Logger.warning("No rects found in Rectifier, Rect data might be compromised.");
            errors += 1;
        }


        return errors;
    }
}