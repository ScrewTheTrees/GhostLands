import {Hooks} from "../../../TreeLib/Hooks";
import {Occupations} from "./Occupations";
import {OccupationBaseSpawner} from "./OccupationBaseSpawner";

export class OccupationManager {
    private static instance: OccupationManager;
    public occupations = Occupations.getInstance();
    public occupationRespawner = OccupationBaseSpawner.getInstance();

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new OccupationManager();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

}