import {Hooks} from "../../TreeLib/Hooks";
import {Occupant} from "./Occupant";
import {Forces} from "../Enums/Forces";

export class Occupations {
    private static instance: Occupations;
    public CITY_1: Occupant = new Occupant(Forces.FORCE_HOSTILE, "city1", "city1guard");
    public CITY_2: Occupant = new Occupant(Forces.FORCE_HOSTILE, "city2", "city2guard");
    public CITY_3: Occupant = new Occupant(Forces.FORCE_HOSTILE, "city3", "city3guard");
    public CITY_4: Occupant = new Occupant(Forces.FORCE_HOSTILE, "city4", "city4guard");
    public CITY_5: Occupant = new Occupant(Forces.FORCE_HOSTILE, "city5", "city5guard");
    public FORCE_1_BASE: Occupant = new Occupant(Forces.FORCE_1, "force1base", "base1guard");
    public FORCE_2_BASE: Occupant = new Occupant(Forces.FORCE_2, "force2base", "base2guard");
    public FORCE_1_OUTPOST_1: Occupant = new Occupant(Forces.FORCE_1, "force1outpost1", "outpost1guard");
    public FORCE_1_OUTPOST_2: Occupant = new Occupant(Forces.FORCE_1, "force1outpost2", "outpost2guard");
    public FORCE_2_OUTPOST_1: Occupant = new Occupant(Forces.FORCE_2, "force2outpost3", "outpost3guard");
    public FORCE_2_OUTPOST_2: Occupant = new Occupant(Forces.FORCE_2, "force2outpost4", "outpost4guard");

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Occupations();
            Hooks.set("Occupations", this.instance);
        }
        return this.instance;
    }
}