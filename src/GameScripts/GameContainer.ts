import {Hooks} from "../TreeLib/Hooks";
import {OccupationManager} from "./GameState/Occupations/OccupationManager";
import {GlobalGameManager} from "./GameState/GlobalGameManager";
import {PlayerUnitManager} from "./StartGame/PlayerUnitManager";
import {CreepContainer} from "./Creeps/CreepContainer";

export class GameContainer {
    private static instance: GameContainer;
    public occupationManager: OccupationManager = OccupationManager.getInstance();
    public globalGameManager: GlobalGameManager = GlobalGameManager.getInstance();
    public playerUnitManager: PlayerUnitManager = PlayerUnitManager.getInstance();
    public creepContainer: CreepContainer = CreepContainer.getInstance();

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GameContainer();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }
}