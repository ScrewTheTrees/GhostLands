import {Hooks} from "../../../TreeLib/Hooks";
import {Point} from "../../../TreeLib/Utility/Point";
import {AIManager} from "../../AI/AIManager";
import {Logger} from "../../../TreeLib/Logger";
import {Occupations} from "./Occupations";
import {CreateUnitHandleSkin} from "../../flavor/Skinner";

export class OccupationBaseSpawner {
    private static instance: OccupationBaseSpawner;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new OccupationBaseSpawner();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private onOccupantDie: trigger = CreateTrigger();

    constructor() {
        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            TriggerRegisterPlayerUnitEvent(this.onOccupantDie, Player(i), EVENT_PLAYER_UNIT_DEATH, null);
        }
        TriggerAddAction(this.onOccupantDie, () => this.onHallUnitDie(GetDyingUnit(), GetKillingUnit()));
        this.createInitialUnits();
    }

    private createInitialUnits() {
        let occupations = Occupations.getInstance();
        let occupants = occupations.getAllOccupants();

        for (let i = 0; i < occupants.length; i++) {
            let occu = occupants[i];
            let loc = occu.primaryRect.getCenter();
            occu.keepUnit = CreateUnitHandleSkin(occupations.getHallPlayerByForce(occu.owner), occupations.getHallByForce(occu.owner), loc.x, loc.y, bj_UNIT_FACING);
            occu.reStock(AIManager.getInstance().getDataByForces(occu.owner));
        }
    }

    private onHallUnitDie(dyingUnit: unit, killingUnit: unit) {
        xpcall(() => {
            let occupations = Occupations.getInstance();
            let occupants = occupations.getAllOccupants();
            for (let i = 0; i < occupants.length; i++) {
                let value = occupants[i];
                if (value.keepUnit == dyingUnit) {
                    let newForce = occupations.getForceByPlayer(GetOwningPlayer(killingUnit));
                    value.owner = newForce;

                    let newPlayer = occupations.getHallPlayerByForce(newForce);
                    let newUnitType = occupations.getHallByForce(newForce);
                    let where = Point.fromLocationClean(GetUnitLoc(dyingUnit));

                    let building = CreateUnitHandleSkin(newPlayer, newUnitType, where.x, where.y, bj_UNIT_FACING);
                    value.keepUnit = building;
                    value.reStock(AIManager.getInstance().getDataByForces(value.owner));

                    SetWidgetLife(building, 50);

                    Logger.generic("Finished starting a new town hall.");
                }
            }
        }, Logger.critical);
    }
}