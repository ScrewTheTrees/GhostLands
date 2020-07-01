import {WarData} from "./WarData";
import {Warzone, Warzones} from "./Warzones";
import {Forces} from "../../Enums/Forces";
import {Occupations} from "../Occupations/Occupations";
import {ChooseOne} from "../../../TreeLib/Misc";
import {Occupant} from "../Occupations/Occupant";
import {Army} from "./Army";
import {Logger} from "../../../TreeLib/Logger";

export class TargetResolver {

    public static resolveTargets(): WarContainer {
        let container: WarContainer;

        let f1 = WarData.getInstance().force1EarlyTargets.pop();
        let f2 = WarData.getInstance().force2EarlyTargets.pop();
        let warzones = Warzones.getInstance();
        let f1bandits = warzones.getBanditWarzonesByForce(Forces.FORCE_1);
        let f2bandits = warzones.getBanditWarzonesByForce(Forces.FORCE_2);

        let force1 = Occupations.getInstance().getTownsOwnedBy(Forces.FORCE_1);
        let force2 = Occupations.getInstance().getTownsOwnedBy(Forces.FORCE_2);

        if (f1 != undefined && f2 != undefined) {
            Logger.generic("Predefined war!");
            let f1zone = warzones.getWarzoneByForceAndCity(Forces.FORCE_1, f1);
            let f2zone = warzones.getWarzoneByForceAndCity(Forces.FORCE_2, f2);

            container = new WarContainer(new WarTargets(f1zone, f2zone));
        } else if ((force1.length == 1 || force2.length == 1) && !(force1.length == 1 && force2.length == 1)) {
            container = TargetResolver.getFinalWarzone(force1);
        } else if (f1bandits.length > 0 || f2bandits.length > 0) {
            container = TargetResolver.getBanditWarzones(f1bandits, f2bandits);
        } else {
            Logger.generic(`Generic war.`);
            container = TargetResolver.getContestedWarzones();
            container.selectedBattlefield = ChooseOne(container.targets.force1, container.targets.force2);
            container.deadLock = true;
        }

        return container;
    }

    private static getBanditWarzones(f1bandits: Warzone[], f2bandits: Warzone[]) {
        Logger.generic(`Prioritise bandits, force1: ${f1bandits.length}  and force2: ${f2bandits.length}`);
        let zones = TargetResolver.getContestedWarzones();

        if (f1bandits.length > 0) zones.targets.force1 = f1bandits[GetRandomInt(0, f1bandits.length - 1)];
        if (f2bandits.length > 0) zones.targets.force2 = f2bandits[GetRandomInt(0, f2bandits.length - 1)];

        if (f1bandits.length == 0 || f2bandits.length == 0) {
            Logger.generic(`Not both players can fight the bandits, so it will be a war instead.`);
            if (f1bandits.length == 0) zones.selectedBattlefield = zones.targets.force1;
            else zones.selectedBattlefield = zones.targets.force2;
            zones.deadLock = true;
        }
        return zones;
    }

    private static getContestedWarzones(): WarContainer {
        const warzones = Warzones.getInstance();
        const occupations = Occupations.getInstance();
        let zones1 = warzones.getContestedWarzonesByForce(Forces.FORCE_1);
        let zones2 = warzones.getContestedWarzonesByForce(Forces.FORCE_2);
        let f1zone = zones1[GetRandomInt(0, zones1.length - 1)];
        let f2zone = zones2[GetRandomInt(0, zones2.length - 1)];

        //Readjust high priority zones to be targeted by respective sides. (Also to dodge bullshit)
        if (occupations.CITY_1.owner != Forces.FORCE_1) {
            f1zone = warzones.getWarzoneByForceAndCity(Forces.FORCE_1, Occupations.getInstance().CITY_1);
        }
        if (occupations.CITY_2.owner != Forces.FORCE_2) {
            f2zone = warzones.getWarzoneByForceAndCity(Forces.FORCE_2, Occupations.getInstance().CITY_2);
        }

        return new WarContainer(new WarTargets(f1zone, f2zone));
    }

    private static getFinalWarzone(force1: Occupant[]): WarContainer {
        //If there is only 1 city left for every player we will set the warzone to the one outside for final standoff.
        print(`Its the final showdown.`);
        let cont = TargetResolver.getContestedWarzones();
        if (force1.length == 1) {
            print(`At player 1.`);
            let zone = Warzones.getInstance().getWarzoneByForceAndCity(Forces.FORCE_2, Occupations.getInstance().FORCE_1_BASE);
            cont.targets.force1 = zone;
            cont.selectedBattlefield = zone;
        } else {
            print(`At player 2.`);
            let zone = Warzones.getInstance().getWarzoneByForceAndCity(Forces.FORCE_1, Occupations.getInstance().FORCE_2_BASE);
            cont.targets.force2 = zone;
            cont.selectedBattlefield = zone;
        }
        return cont;
    }
}


export class WarContainer {
    public targets: WarTargets;
    public selectedBattlefield: Warzone | null = null;
    public armies: Armies = new Armies();
    public deadLock = false;

    constructor(targets: WarTargets) {
        this.targets = targets;
    }
}

export class WarTargets {
    constructor(public force1: Warzone, public force2: Warzone) {
    }
}

export class Armies {
    public force1: Army | null = null;
    public force2: Army | null = null;
}