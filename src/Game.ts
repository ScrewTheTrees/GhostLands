import {Logger} from "./TreeLib/Logger";
import {StartGameDiag} from "./GameScripts/StartGame/StartGameDiag";
import {AddAbilityReplacements} from "./GameScripts/StartGame/AddAbilityReplacements";
import {GameContainer} from "./GameScripts/GameContainer";

export class Game {
    constructor() {
        Logger.doLogVerbose = false;
        Logger.doLogDebug = true;

        StartGameDiag.getInstance().runDiagnosis();
        AddAbilityReplacements.getInstance().register();
        GameContainer.getInstance();
    }
}