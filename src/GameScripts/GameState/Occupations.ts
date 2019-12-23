import {Hooks} from "../../TreeLib/Hooks";
import {Occupant} from "./Occupant";
import {Forces} from "../Enums/Forces";
import {UnitClass} from "../Enums/UnitClass";
import {Point} from "../../TreeLib/Utility/Point";
import {Units} from "../Enums/Units";
import {PlayerManager} from "../PlayerManager";
import {Logger} from "../../TreeLib/Logger";
import {Entity} from "../../TreeLib/Entity";
import {DamageDetectionSystem} from "../../TreeLib/DDS/DamageDetectionSystem";
import {HitCallback} from "../../TreeLib/DDS/HitCallback";
import {DDSFilterTargetUnitTypes} from "../../TreeLib/DDS/Filters/DDSFilterTargetUnitTypes";
import {Delay} from "../../TreeLib/Utility/Delay";

export class Occupations extends Entity {
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

    private onOccupantDie: trigger = CreateTrigger();
    private callToAid: HitCallback;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Occupations();
            Hooks.set("Occupations", this.instance);
        }
        return this.instance;
    }

    constructor() {
        super();
        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            TriggerRegisterPlayerUnitEvent(this.onOccupantDie, Player(i), EVENT_PLAYER_UNIT_DEATH, null);
        }
        TriggerAddAction(this.onOccupantDie, () => this.onHallUnitDie(GetDyingUnit(), GetKillingUnit()));

        this.callToAid = DamageDetectionSystem.getInstance().registerAfterDamageCalculation((hitObject) => {
            let occupation = this.getOccupationByHall(hitObject.targetUnit);
            if (occupation != null) {
                for (let i = 0; i < occupation.guardPosts.length; i++) {
                    let post = occupation.guardPosts[i];
                    if (post.occupied != undefined && !post.occupied.currentQueue.isPaused) {
                        let loc = Point.fromWidget(hitObject.targetUnit);
                        post.occupied.currentQueue.isPaused = true;
                        IssuePointOrder(post.occupied.guard, "attack", loc.x, loc.y);
                        Delay.addDelay(() => {
                            if (post.occupied) {
                                post.occupied.currentQueue.isPaused = false;
                            }
                        }, 30);
                    }
                }
            }
        });
        this.callToAid.addFilter(new DDSFilterTargetUnitTypes(Units.HALL_FORCE_1, Units.HALL_FORCE_2, Units.HALL_FORCE_BANDITS));
    }

    step() {
        //TODO:
    }

    public getHallPlayerByForce(force: Forces): player {
        switch (force) {
            case Forces.FORCE_1:
                return PlayerManager.getInstance().team1Player;
            case Forces.FORCE_2:
                return PlayerManager.getInstance().team2Player;
            case Forces.FORCE_BANDIT:
                return PlayerManager.getInstance().bandit; // Both bandits use the same players

        }
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
                    if (post.postType == guardType && post.needNewGuard()) {
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

    getOccupationByHall(hall: unit): Occupant | null {
        for (let i = 0; i < this.allOccupants.length; i++) {
            let occu = this.allOccupants[i];
            if (occu.keepUnit != null && occu.keepUnit == hall) {
                return occu;
            }
        }
        return null;
    }

    getHallByForce(force: Forces): number {
        switch (force) {
            case Forces.FORCE_1:
                return Units.HALL_FORCE_1;
            case Forces.FORCE_2:
                return Units.HALL_FORCE_2;
            case Forces.FORCE_BANDIT:
                return Units.HALL_FORCE_BANDITS;
        }
    }

    getForceByPlayer(p: player): Forces {
        let playerManager = PlayerManager.getInstance();
        if (playerManager.team1MinionsAll.indexOf(p) >= 0
            || playerManager.team1Player == p
            || playerManager.team1PlayerArmy == p
            || playerManager.team1PlayerExtra == p
        ) {
            return Forces.FORCE_1;
        }
        if (playerManager.team2MinionsAll.indexOf(p) >= 0
            || playerManager.team2Player == p
            || playerManager.team2PlayerArmy == p
            || playerManager.team2PlayerExtra == p
        ) {
            return Forces.FORCE_2;
        }
        return Forces.FORCE_BANDIT;
    }

    private onHallUnitDie(dyingUnit: unit, killingUnit: unit) {
        for (let i = 0; i < this.allOccupants.length; i++) {
            let value = this.allOccupants[i];
            if (value.keepUnit != null && value.keepUnit == dyingUnit) {
                let newForce = this.getForceByPlayer(GetOwningPlayer(killingUnit));
                let newPlayer = this.getHallPlayerByForce(newForce);
                let newUnitType = this.getHallByForce(newForce);
                let where = Point.fromLocationClean(GetUnitLoc(dyingUnit));
                let building = CreateUnit(newPlayer, newUnitType, where.x, where.y, bj_UNIT_FACING);
                SetWidgetLife(building, 50);

                value.keepUnit = building;
                value.owner = newForce;

                //TODO: Send all guards on a sucide protection mission.

                Logger.generic("Finished starting a new town hall.");
                return;
            }
        }
    }

}