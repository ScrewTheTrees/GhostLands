import {Logger} from "./TreeLib/Logger";
import {StartGameDiag} from "./GameScripts/StartGame/StartGameDiag";
import {PlayerUnitBuilder} from "./GameScripts/StartGame/PlayerUnitBuilder";
import {GlobalGameManager} from "./GameScripts/GameState/GlobalGameManager";

export class Game {
    constructor() {
        Logger.doLogVerbose = false;
        Logger.doLogDebug = false;

        StartGameDiag.getInstance().runDiagnosis();
        PlayerUnitBuilder.getInstance().execute();
        GlobalGameManager.getInstance();
    }
}