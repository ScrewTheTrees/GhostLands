import {Logger} from "./TreeLib/Logger";
import {StartGameDiag} from "./GameScripts/StartGame/StartGameDiag";
import {PlayerUnitBuilder} from "./GameScripts/StartGame/PlayerUnitBuilder";
import {Rectifier} from "./GameScripts/RectControl/Rectifier";
import {AIManager} from "./GameScripts/AI/AIManager";
import {PathManager} from "./GameScripts/AI/PathManager";
import {Occupations} from "./GameScripts/GameState/Occupations";

export class Game {
    constructor() {
        Logger.doLogVerbose = false;
        Logger.doLogDebug = false;

        Rectifier.getInstance();
        StartGameDiag.getInstance().runDiagnosis();
        PlayerUnitBuilder.getInstance().execute();
        AIManager.getInstance();
        PathManager.getInstance();
        Occupations.getInstance();
    }
}