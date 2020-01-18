import {Hooks} from "../../TreeLib/Hooks";
import {CreepCamps} from "./CreepCamps";

export class CreepContainer {
    private static instance: CreepContainer;
    public creepCamps: CreepCamps = CreepCamps.getInstance();

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepContainer();
            Hooks.set("CreepManager", this.instance);
        }
        return this.instance;
    }
}