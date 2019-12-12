import {Hooks} from "../../TreeLib/Hooks";
import {Occupant} from "./Occupant";
import {Forces} from "../Enums/Forces";
import {UnitClass} from "../Enums/UnitClass";

export class Occupations {
    private static instance: Occupations;

    public CITY_1: Occupant = new Occupant(Forces.FORCE_BANDIT, "city1", "city1guard");
    public CITY_2: Occupant = new Occupant(Forces.FORCE_BANDIT, "city2", "city2guard");
    public CITY_3: Occupant = new Occupant(Forces.FORCE_BANDIT, "city3", "city3guard");
    public CITY_4: Occupant = new Occupant(Forces.FORCE_BANDIT, "city4", "city4guard");
    public CITY_5: Occupant = new Occupant(Forces.FORCE_BANDIT, "city5", "city5guard");
    public FORCE_1_BASE: Occupant = new Occupant(Forces.FORCE_1, "force1base", "base1guard");
    public FORCE_2_BASE: Occupant = new Occupant(Forces.FORCE_2, "force2base", "base2guard");
    /*public FORCE_1_OUTPOST_1: Occupant = new Occupant(Forces.FORCE_1, "force1outpost1", "outpost1guard");
    public FORCE_1_OUTPOST_2: Occupant = new Occupant(Forces.FORCE_1, "force1outpost2", "outpost2guard");
    public FORCE_2_OUTPOST_3: Occupant = new Occupant(Forces.FORCE_2, "force2outpost3", "outpost3guard");
    public FORCE_2_OUTPOST_4: Occupant = new Occupant(Forces.FORCE_2, "force2outpost4", "outpost4guard");
*/

    private allOccupants: Occupant[] = [
        this.FORCE_1_BASE,
        this.FORCE_2_BASE,
        /*this.FORCE_1_OUTPOST_1,
        this.FORCE_1_OUTPOST_2,
        this.FORCE_2_OUTPOST_3,
        this.FORCE_2_OUTPOST_4,*/
        this.CITY_1,
        this.CITY_2,
        this.CITY_3,
        this.CITY_4,
        this.CITY_5,
    ];

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Occupations();
            Hooks.set("Occupations", this.instance);
        }
        return this.instance;
    }

    public getAllOccupants(): Occupant[] {
        return this.allOccupants;
    }

    public getNeededGuardsByForce(force: Forces, guardType: UnitClass): number {
        let occu = this.getAllOccupants();
        let count = 0;
        for (let i = 0; i < occu.length; i++) {
            let occupant = occu[i];
            if (occupant.owner == force) {
                for (let j = 0; j < occupant.guardPosts.length; j++) {
                    let post = occupant.guardPosts[j];
                    if (post.postType == guardType) {
                        count += 1;
                    }
                }
            }
        }
        return count;
    }

    public getTownsOwnedBy(force: Forces): Occupant[] {
        let allOccus = this.getAllOccupants();
        let result: Occupant[] = [];
        for (let i = 0; i < allOccus.length; i++) {
            let value = allOccus[i];
            if (value.owner == force) {
                result.push(value);
            }
        }
        return result;
    }

}