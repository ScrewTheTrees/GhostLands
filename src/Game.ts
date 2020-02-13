import {Logger} from "./TreeLib/Logger";
import {StartGameDiag} from "./GameScripts/StartGame/StartGameDiag";
import {OnSpellCastCreator} from "./GameScripts/StartGame/OnSpellCastCreator";
import {GameContainer} from "./GameScripts/GameContainer";

export class Game {
    constructor() {
        Logger.doLogVerbose = false;
        Logger.doLogDebug = true;

        StartGameDiag.getInstance().runDiagnosis();
        OnSpellCastCreator.getInstance().register();
        GameContainer.getInstance();
    }
}