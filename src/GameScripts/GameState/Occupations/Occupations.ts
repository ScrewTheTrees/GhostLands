import {Hooks} from "../../../TreeLib/Hooks";
import {Occupant} from "./Occupant";
import {Forces} from "../../Enums/Forces";
import {UnitClass} from "../../Enums/UnitClass";
import {Point} from "../../../TreeLib/Utility/Point";
import {GameUnits} from "../../Enums/GameUnits";
import {PlayerManager} from "../../PlayerManager";
import {DamageDetectionSystem} from "../../../TreeLib/DDS/DamageDetectionSystem";
import {HitCallback} from "../../../TreeLib/DDS/HitCallback";
import {Delay} from "../../../TreeLib/Utility/Delay";
import {DDSFilterIsEnemy} from "../../../TreeLib/DDS/Filters/DDSFilterIsEnemy";
import {DamageHitContainer} from "../../../TreeLib/DDS/DamageHitContainer";
import {Quick} from "../../../TreeLib/Quick";
import {DDSFilterTargetUnitPlayers} from "../../../TreeLib/DDS/Filters/DDSFilterTargetUnitPlayers";
import {InverseFourCC} from "../../../TreeLib/Misc";

export class Occupations {
    private static instance: Occupations;

    constructor() {
        const mgr = PlayerManager.getInstance();
        this.callToAid = DamageDetectionSystem.getInstance().registerAfterDamageCalculation((hitObject) => {
            this.onCallToAid(hitObject);
        });
        this.callToAid.addFilter(new DDSFilterTargetUnitPlayers(mgr.team1Player, mgr.team2Player, mgr.bandit));
        this.callToAid.addFilter(new DDSFilterIsEnemy());
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Occupations();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public CITY_1: Occupant = new Occupant(Forces.FORCE_BANDIT, "city1", "city1unitarea");
    public CITY_2: Occupant = new Occupant(Forces.FORCE_BANDIT, "city2", "city2unitarea");
    public CITY_3: Occupant = new Occupant(Forces.FORCE_BANDIT, "city3", "city3unitarea");
    public CITY_4: Occupant = new Occupant(Forces.FORCE_BANDIT, "city4", "city4unitarea");
    public CITY_5: Occupant = new Occupant(Forces.FORCE_BANDIT, "city5", "city5unitarea");
    public FORCE_1_BASE: Occupant = new Occupant(Forces.FORCE_1, "force1base", "force1base1unitarea");
    public FORCE_2_BASE: Occupant = new Occupant(Forces.FORCE_2, "force2base", "force2base1unitarea");
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

    private callToAid: HitCallback;

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
        return [...this.allOccupants];
    }

    public getNeededGuardsByForce(force: Forces, guardType: UnitClass): number {
        let occu = this.getTownsOwnedBy(force);
        let count = 0;
        for (let i = 0; i < occu.length; i++) {
            let occupant = occu[i];
            for (let j = 0; j < occupant.guardPosts.length; j++) {
                let post = occupant.guardPosts[j];
                if (post.postType == guardType && post.needNewGuard()) {
                    count += 1;
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
                Quick.Push(result, value);
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

    getOccupationByGuard(guard: unit): Occupant | null {
        for (let i = 0; i < this.allOccupants.length; i++) {
            let occu = this.allOccupants[i];
            if (occu.getGuardPostByUnit(guard) != null) {
                return occu;
            }
        }
        return null;
    }

    getHallByForce(force: Forces): number {
        switch (force) {
            case Forces.FORCE_1:
                return FourCC(GameUnits.HALL_FORCE_1);
            case Forces.FORCE_2:
                return FourCC(GameUnits.HALL_FORCE_2);
            case Forces.FORCE_BANDIT:
                return FourCC(GameUnits.HALL_FORCE_BANDITS);
        }
    }

    arrayHasPlayer(minions: player[], p: player) {
        for (let i = 0; i < minions.length; i++) {
            let value = GetPlayerId(minions[i]);
            if (value == GetPlayerId(p)) {
                return true;
            }
        }
        return false;
    }

    getForceByPlayer(p: player): Forces {
        let playerManager = PlayerManager.getInstance();
        if (this.arrayHasPlayer(playerManager.team1MinionsAll, p)
            || GetPlayerId(playerManager.team1Player) == GetPlayerId(p)
            || GetPlayerId(playerManager.team1PlayerArmy) == GetPlayerId(p)
            || GetPlayerId(playerManager.team1PlayerExtra) == GetPlayerId(p)
        ) {
            return Forces.FORCE_1;
        } else if (this.arrayHasPlayer(playerManager.team2MinionsAll, p)
            || GetPlayerId(playerManager.team2Player) == GetPlayerId(p)
            || GetPlayerId(playerManager.team2PlayerArmy) == GetPlayerId(p)
            || GetPlayerId(playerManager.team2PlayerExtra) == GetPlayerId(p)
        ) {
            return Forces.FORCE_2;
        }
        return Forces.FORCE_BANDIT;
    }

    private onCallToAid(hitObject: DamageHitContainer) {
        let occupation: Occupant | null;
        if (this.isHall(hitObject.targetUnitType)) {
            occupation = this.getOccupationByHall(hitObject.targetUnit);
        } else {
            occupation = this.getOccupationByGuard(hitObject.targetUnit);
        }

        if (occupation != null) {
            for (let i = 0; i < occupation.guardPosts.length; i++) {
                let post = occupation.guardPosts[i];
                let loc = Point.fromWidget(hitObject.targetUnit);
                if (post.occupied != undefined && !post.occupied.currentQueue.isPaused && Point.fromWidget(post.occupied.guard).distanceTo(loc) < 4000) {
                    post.occupied.currentQueue.isPaused = true;
                    Delay.addDelay(() => {
                        if (post.occupied != undefined) IssuePointOrder(post.occupied.guard, "attack", loc.x, loc.y);
                    }, 3);
                    Delay.addDelay(() => {
                        if (post.occupied) {
                            IssuePointOrder(post.occupied.guard, "move", post.point.x, post.point.y);
                            post.occupied.currentQueue.isPaused = false;
                            Delay.addDelay(() => {
                                if (post.occupied) IssuePointOrder(post.occupied.guard, "attack", post.point.x, post.point.y);
                                //Make sure the unit dont run back too far
                            }, 1)
                        }
                    }, 30);
                }
            }
        }
    }

    private isHall(unitType: number) {
        let u = InverseFourCC(unitType);
        return (u == GameUnits.HALL_FORCE_1
            || u == GameUnits.HALL_FORCE_2
            || u == GameUnits.HALL_FORCE_BANDITS
        );
    }

}