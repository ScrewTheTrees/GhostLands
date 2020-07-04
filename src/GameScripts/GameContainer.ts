import {Hooks} from "../TreeLib/Hooks";
import {OccupationManager} from "./GameState/Occupations/OccupationManager";
import {GlobalGameManager} from "./GameState/GlobalGameManager";
import {PlayerUnitManager} from "./StartGame/PlayerUnitManager";
import {DebugUI} from "./Debug/DebugUI";
import {WorldTendencyContainer} from "./WorldTendency/WorldTendencyContainer";
import {StackingItems} from "./WorldTendency/Loot/StackingItems";
import {Runes} from "./StartGame/Runes";
import {Delay} from "../TreeLib/Utility/Delay";
import {GameUnits} from "./Enums/GameUnits";
import {UnitArrays} from "../TreeLib/Utility/Extended Functionality/UnitArrayFunc";
import ArrayUnitsOfType = UnitArrays.ArrayUnitsOfType;

export class GameContainer {
    private static instance: GameContainer;
    public occupationManager: OccupationManager = OccupationManager.getInstance();
    public playerUnitManager: PlayerUnitManager = PlayerUnitManager.getInstance();
    public worldTendencyContainer: WorldTendencyContainer = WorldTendencyContainer.getInstance();
    public stackingItems: StackingItems = StackingItems.getInstance();
    public runes: Runes = Runes.getInstance();

    public globalGameManager?: GlobalGameManager;
    public debugUI?: DebugUI;
    public hasStarted: boolean = false;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GameContainer();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public start() {
        if (!this.hasStarted) {
            this.hasStarted = true;
            print("Game starts in 30 seconds.");

            Delay.addDelay(() => {
                ArrayUnitsOfType(FourCC(GameUnits.PATHING_BLOCKER_MAP_START)).forEach((u) => RemoveUnit(u));
                this.globalGameManager = GlobalGameManager.getInstance();
                this.debugUI = DebugUI.getInstance();
            }, 30);
        }
    }
}