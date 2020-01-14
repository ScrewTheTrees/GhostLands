import {Hooks} from "../TreeLib/Hooks";
import {OccupationManager} from "./GameState/Occupations/OccupationManager";
import {GlobalGameManager} from "./GameState/GlobalGameManager";
import {PlayerUnitManager} from "./StartGame/PlayerUnitManager";

export class GameContainer {
    private static instance: GameContainer;
    public occupationManager: OccupationManager = OccupationManager.getInstance();
    public globalGameManager: GlobalGameManager = GlobalGameManager.getInstance();
    public playerUnitManager: PlayerUnitManager = PlayerUnitManager.getInstance();

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GameContainer();
            Hooks.set("GameContainer", this.instance);
        }
        return this.instance;
    }
}