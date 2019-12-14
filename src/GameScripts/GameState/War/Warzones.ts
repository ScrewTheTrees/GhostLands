import {Hooks} from "../../../TreeLib/Hooks";
import {NamedRect} from "../../RectControl/NamedRect";
import {Occupant} from "../Occupant";
import {Rectifier} from "../../RectControl/Rectifier";
import {Occupations} from "../Occupations";
import {Forces} from "../../Enums/Forces";
import {Logger} from "../../../TreeLib/Logger";

export class Warzones {
    private static instance: Warzones;
    private occupations: Occupations = Occupations.getInstance();
    public WARZONE_1: Warzone = new Warzone(1, this.occupations.FORCE_1_BASE, this.occupations.CITY_1);
    public WARZONE_2: Warzone = new Warzone(2, this.occupations.CITY_2, this.occupations.FORCE_1_BASE);
    public WARZONE_3: Warzone = new Warzone(3, this.occupations.CITY_1, this.occupations.CITY_3);
    public WARZONE_4: Warzone = new Warzone(4, this.occupations.CITY_3, this.occupations.CITY_2);
    public WARZONE_5: Warzone = new Warzone(5, this.occupations.CITY_5, this.occupations.CITY_5);
    public WARZONE_6: Warzone = new Warzone(6, this.occupations.CITY_4, this.occupations.CITY_4);

    public allWarzones: Warzone[] = [
        this.WARZONE_1,
        this.WARZONE_2,
        this.WARZONE_3,
        this.WARZONE_4,
        this.WARZONE_5,
        this.WARZONE_6,
    ];

    constructor() {
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Warzones();
            Hooks.set("Warzones", this.instance);
        }
        return this.instance;
    }

    public getWarzoneByForceAndCity(force: Forces, city: Occupant): Warzone {
        for (let i = 0; i < this.allWarzones.length; i++) {
            let zone = this.allWarzones[i];
            if (force == Forces.FORCE_1 && city == zone.force2Occupant) { // If force one, and the warzone is on the force1 side of the city.
                return zone;
            } else if (force == Forces.FORCE_2 && city == zone.force1Occupant) { // Force two instead.
                return zone;
            }
        }
        Logger.critical("No warzone was found for ", force, " and city with rect: ", city.primaryRect.name);
        return this.WARZONE_5;
    }

    //Warzones available.
    public getContestedWarzones() {
        let entries: Warzone[] = [];
        for (let i = 0; i < this.allWarzones.length; i++) {
            let zone = this.allWarzones[i];
            if (zone.force1Occupant.owner != zone.force2Occupant.owner //if its between two warring factions
                || zone.force1Occupant == zone.force2Occupant) { //If the zone is outside city 5 or 6, aka a constant contested zone.
                entries.push(zone);
            }
        }
        return entries;
    }

    //
    public getBanditWarzonesByForce(force: Forces) {
        let entries: Warzone[] = [];
        for (let i = 0; i < this.allWarzones.length; i++) {
            let zone = this.allWarzones[i];
            if (force == Forces.FORCE_1) {
                if ((zone.force1Occupant.owner == Forces.FORCE_1 && zone.force2Occupant.owner == Forces.FORCE_BANDIT) //if warzone is
                    || (zone.force1Occupant == zone.force2Occupant && zone.force1Occupant.owner == Forces.FORCE_BANDIT)) { //If the zone is outside city 5 or 6, aka a constant contested zone.
                    entries.push(zone);
                }
            } else if (force == Forces.FORCE_2) {
                if ((zone.force1Occupant.owner == Forces.FORCE_BANDIT && zone.force2Occupant.owner == Forces.FORCE_2) //if warzone is
                    || (zone.force1Occupant == zone.force2Occupant && zone.force2Occupant.owner == Forces.FORCE_BANDIT)) { //If the zone is outside city 5 or 6, aka a constant contested zone.
                    entries.push(zone);
                }
            }
        }
        return entries;
    }

    public getContestedWarzonesByForce(force: Forces) {
        let entries: Warzone[] = [];
        for (let i = 0; i < this.allWarzones.length; i++) {
            let zone = this.allWarzones[i];
            if (zone.force1Occupant.owner != zone.force2Occupant.owner //if its between two warring factions
                || (zone.force1Occupant == zone.force2Occupant && zone.force1Occupant.owner != force)) { //If side city and
                entries.push(zone);
            }
        }
        return entries;
    }
}

export class Warzone {
    public force1gather: NamedRect;
    public force2gather: NamedRect;
    public force1Occupant: Occupant;
    public force2Occupant: Occupant;

    constructor(id: number, force1Occupant: Occupant, force2Occupant: Occupant) {
        this.force1gather = Rectifier.getInstance().getRectByWEName("warzone" + tostring(id) + "force1");
        this.force2gather = Rectifier.getInstance().getRectByWEName("warzone" + tostring(id) + "force2");
        this.force1Occupant = force1Occupant;
        this.force2Occupant = force2Occupant;
    }

    /**
     *  Returns if this warzone is contested with another player, if either occupants are a bandit its not contested.
     *  That means
     */
    isContested(): boolean {
        return this.force1Occupant.owner != Forces.FORCE_BANDIT && this.force2Occupant.owner != Forces.FORCE_BANDIT;
    }
}