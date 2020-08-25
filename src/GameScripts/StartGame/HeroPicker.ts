import {Hooks} from "../../TreeLib/Hooks";
import {PlayerManager} from "../PlayerManager";
import {Rectifier} from "../RectControl/Rectifier";
import {GameUnits} from "../Enums/GameUnits";
import {UnitArrays} from "../../TreeLib/Utility/Extended Functionality/UnitArrayFunc";
import ArrayUnitsOfPlayer = UnitArrays.ArrayUnitsOfPlayer;
import {Delay} from "../../TreeLib/Utility/Delay";
import {PlayerUnitManager} from "./PlayerUnitManager";
import {GetIDByForce} from "../Enums/Forces";
import ArrayUnitsOfType = UnitArrays.ArrayUnitsOfType;
import {Logger} from "../../TreeLib/Logger";
import {Point} from "../../TreeLib/Utility/Point";
import {GameContainer} from "../GameContainer";

export class HeroPicker {
    private static instance: HeroPicker;
    private onHeroPick: trigger;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new HeroPicker();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        let p1 = PlayerManager.getInstance().team1Minions;
        let p2 = PlayerManager.getInstance().team2Minions;

        let wispSpawn1 = Rectifier.getInstance().getRectByWEName("force1WispSpawn").getCenter();
        let wispSpawn2 = Rectifier.getInstance().getRectByWEName("force2WispSpawn").getCenter();

        p1.forEach((value) => {
            let u = CreateUnit(value, FourCC(GameUnits.HERO_PICKER), wispSpawn1.x, wispSpawn1.y, 0);
            if (value == GetLocalPlayer()) SelectUnit(u, true);
        });
        p2.forEach((value) => {
            let u = CreateUnit(value, FourCC(GameUnits.HERO_PICKER), wispSpawn2.x, wispSpawn2.y, 0)
            if (value == GetLocalPlayer()) SelectUnit(u, true);
        });

        if (p1.indexOf(GetLocalPlayer()) >= 0) SetCameraPosition(wispSpawn1.x, wispSpawn1.y);
        if (p2.indexOf(GetLocalPlayer()) >= 0) SetCameraPosition(wispSpawn2.x, wispSpawn2.y);

        this.onHeroPick = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(this.onHeroPick, EVENT_PLAYER_UNIT_SELL);
        TriggerAddAction(this.onHeroPick, () => {
            let u = GetSoldUnit();
            if (IsHeroUnitId(GetUnitTypeId(u))) {
                let wisp = ArrayUnitsOfPlayer(GetOwningPlayer(u),
                    (target) => GetUnitTypeId(target) == FourCC(GameUnits.HERO_PICKER));
                wisp.forEach((w) => RemoveUnit(w));

                Delay.addDelay(() => {
                    let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(u));
                    let point = Rectifier.getInstance().getRectsByForceOfType(GetIDByForce(forcesByPlayer), "gathering")[0].getCenter();
                    PlayerUnitManager.getInstance().setUnitPath(u, point, forcesByPlayer);
                })
                let p = Point.fromWidget(u);
                if (GetOwningPlayer(u) == GetLocalPlayer()) {
                    SetCameraPosition(p.x, p.y);
                    SelectUnit(u, true);
                }
            }
            this.validatePickingOver();
        });
    }

    private validatePickingOver() {
        if (ArrayUnitsOfType(FourCC(GameUnits.HERO_PICKER)).length == 0) {
            Logger.generic("All heroes have been picked.");
            GameContainer.getInstance().start();
            this.destroy();
        }
    }

    public destroy() {
        Logger.generic("Destruct HeroPicker as its no longer needed.");
        ArrayUnitsOfType(FourCC(GameUnits.TAVERN_1)).forEach((u) => RemoveUnit(u));
        DestroyTrigger(this.onHeroPick);
        delete HeroPicker.instance;
        Hooks.set(HeroPicker.name, null);
    }

}