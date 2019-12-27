import {Logger} from "./TreeLib/Logger";
import {StartGameDiag} from "./GameScripts/StartGame/StartGameDiag";
import {PlayerUnitBuilder} from "./GameScripts/StartGame/PlayerUnitBuilder";
import {GlobalGameManager} from "./GameScripts/GameState/GlobalGameManager";
import {AddAbilityReplacements} from "./GameScripts/StartGame/AddAbilityReplacements";

export class Game {
    constructor() {
        Logger.doLogVerbose = false;
        Logger.doLogDebug = true;

        StartGameDiag.getInstance().runDiagnosis();
        PlayerUnitBuilder.getInstance().execute();
        AddAbilityReplacements.getInstance().register();
        GlobalGameManager.getInstance();

    }
}