import {Hooks} from "../../TreeLib/Hooks";
import {CreepContainer} from "./Creep/CreepContainer";
import {PlayerPowerTendency} from "./Power/PlayerPowerTendency";

export class WorldTendencyContainer {
    private static instance: WorldTendencyContainer;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new WorldTendencyContainer();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public creepContainer: CreepContainer = CreepContainer.getInstance();
    public playerPowerTendency: PlayerPowerTendency = PlayerPowerTendency.getInstance();
}