import {Logger} from "./TreeLib/Logger";
import {StartGameDiag} from "./GameScripts/StartGame/StartGameDiag";
import {Rectifier} from "./GameScripts/RectControl/Rectifier";
import {Point} from "./TreeLib/Utility/Point";
import {Skinner} from "./GameScripts/flavor/Skinner";
import {GameConfigContainer} from "./GameScripts/GameConfigContainer";

export class Game {
    constructor() {
        Logger.doLogVerbose = false;
        Logger.doLogDebug = true;

        this.killPreload();

        StartGameDiag.getInstance().runDiagnosis();


        GameConfigContainer.getInstance().start();

        this.skin();
    }

    public killPreload() {
        let ret = Rectifier.getInstance().getRectByWEName("preloadRegion");
        let units = GetUnitsInRectAll(ret.value);
        ForGroup(units, () => {
            RemoveUnit(GetEnumUnit());
        });
        DestroyGroup(units);
    }

    public skin() {
        let units = GetUnitsInRangeOfLocAll(9999999, new Point(0, 0).toLocationClean());
        ForGroup(units, () => {
            let u = GetEnumUnit();
            BlzSetUnitSkin(u, Skinner.getInstance().getRandomSkinOfUnit(u));
        });
    }
}