import {Hooks} from "../TreeLib/Hooks";
import {OccupationManager} from "./GameState/Occupations/OccupationManager";
import {GlobalGameManager} from "./GameState/GlobalGameManager";
import {PlayerUnitManager} from "./StartGame/PlayerUnitManager";
import {DebugUI} from "./Debug/DebugUI";
import {WorldTendencyContainer} from "./WorldTendency/WorldTendencyContainer";
import {StackingItems} from "./WorldTendency/Loot/StackingItems";
import {Runes} from "./StartGame/Runes";

export class GameContainer {
    private static instance: GameContainer;
    public occupationManager: OccupationManager = OccupationManager.getInstance();
    public globalGameManager: GlobalGameManager = GlobalGameManager.getInstance();
    public playerUnitManager: PlayerUnitManager = PlayerUnitManager.getInstance();
    public worldTendencyContainer: WorldTendencyContainer = WorldTendencyContainer.getInstance();
    public debugUI: DebugUI = DebugUI.getInstance();
    public stackingItems: StackingItems = StackingItems.getInstance();
    public runes: Runes = Runes.getInstance();

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GameContainer();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }
}