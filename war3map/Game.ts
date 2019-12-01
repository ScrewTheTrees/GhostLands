import {Logger} from "./TreeLib/Logger";
import {StartGameDiag} from "./GameScripts/StartGame/StartGameDiag";
import {PlayerUnitBuilder} from "./GameScripts/StartGame/PlayerUnitBuilder";
import {Rectifier} from "./GameScripts/RectControl/Rectifier";
import {AIManager} from "./GameScripts/AI/AIManager";

export class Game {
    constructor() {
        Logger.doLogVerbose = false;
        Logger.doLogDebug = true;

        Rectifier.getInstance();
        StartGameDiag.getInstance().runDiagnosis();
        PlayerUnitBuilder.getInstance().execute();
        AIManager.getInstance();
    }
}