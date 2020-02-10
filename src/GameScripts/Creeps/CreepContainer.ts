import {Hooks} from "../../TreeLib/Hooks";
import {CreepLoot} from "./Loot/CreepLoot";
import {CreepCamps} from "./CreepCamps";

export class CreepContainer {
    private static instance: CreepContainer;
    public creepCamps: CreepCamps = CreepCamps.getInstance();
    public creepLoot: CreepLoot = CreepLoot.getInstance();

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepContainer();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }
}