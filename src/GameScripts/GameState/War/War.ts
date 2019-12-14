import {Occupations} from "../Occupations";
import {Forces} from "../../Enums/Forces";
import {WarData} from "./WarData";
import {Logger} from "../../../TreeLib/Logger";
import {Warzone, Warzones} from "./Warzones";
import {Entity} from "../../../TreeLib/Entity";
import {Occupant} from "../Occupant";
import {ChooseOne} from "../../../TreeLib/Misc";
import {Army} from "./Army";
import {AIManager} from "../../AI/AIManager";

export class War extends Entity {
    public deadLock: boolean = false;
    public state: WarState = WarState.SETUP;
    public targets: WarContainer | null = null;

    public isFinished: boolean = false;

    //TODO: Replace print with Debug.Log();
    constructor() {
        super();
        print("THERE IS ONLY WAR!");
        this.targets = this.resolveTargets();
        this._timerDelay = 1;

        if (this.targets != null) {
            print("There is targets!");
            let targets = this.targets;
            let t1 = targets.targets.force1.force1gather.getCenter();
            let t2 = targets.targets.force2.force2gather.getCenter();

            let mgr = AIManager.getInstance();

            if (this.deadLock && targets.selectedBattlefield != null) {
                print("There is a deadlock, det finns bara krig.");
                targets.armies.force1 = new Army(mgr.force1Data, targets.selectedBattlefield.force1gather);
                targets.armies.force2 = new Army(mgr.force2Data, targets.selectedBattlefield.force2gather);
            } else {
                print("This is not a deadlock, single side conquer war.");
                targets.armies.force1 = new Army(mgr.force1Data, targets.targets.force1.force1gather);
                targets.armies.force2 = new Army(mgr.force2Data, targets.targets.force2.force2gather);
            }

        }
    }


    step() {

    }

    public endWar() {
        this.remove(); //Kill entity.
        this.isFinished = true;
    }

    private resolveTargets(): WarContainer | null {
        let container: WarContainer | null = null;

        let f1 = WarData.getInstance().force1EarlyTargets.pop();
        let f2 = WarData.getInstance().force2EarlyTargets.pop();
        let warzones = Warzones.getInstance();
        let f1bandits = warzones.getBanditWarzonesByForce(Forces.FORCE_1);
        let f2bandits = warzones.getBanditWarzonesByForce(Forces.FORCE_2);

        let force1 = Occupations.getInstance().getTownsOwnedBy(Forces.FORCE_1);
        let force2 = Occupations.getInstance().getTownsOwnedBy(Forces.FORCE_2);

        if (f1 != undefined && f2 != undefined) {
            print("Predefined war!");
            let f1zone = warzones.getWarzoneByForceAndCity(Forces.FORCE_1, f1);
            let f2zone = warzones.getWarzoneByForceAndCity(Forces.FORCE_2, f2);

            container = new WarContainer(new WarTargets(f1zone, f2zone));
        } else if (f1 != undefined || f2 != undefined) {
            Logger.critical("f1 and f2 are not both undefined or both defined, something went horribly horribly wrong, please refer to War.ts");
            this.endWar();
        } else if ((force1.length == 1 || force2.length == 1) && !(force1.length == 1 && force2.length == 1)) {
            container = this.getFinalWarzone(force1);
        } else if (f1bandits.length > 0 || f2bandits.length > 0) {
            container = this.getBanditWarzones(f1bandits, f2bandits);
        } else {
            print(`Generic war.`);
            container = this.getContestedWarzones();
            container.selectedBattlefield = ChooseOne(container.targets.force1, container.targets.force2)
        }

        if (container != null && !container.selectedBattlefield != null) {
            if (GetRandomInt(0, 1) == 0) {
                container.selectedBattlefield = container.targets.force1;
            } else {
                container.selectedBattlefield = container.targets.force2;
            }
        }

        return container;
    }

    private getBanditWarzones(f1bandits: Warzone[], f2bandits: Warzone[]) {
        print(`Prioritise bandits, force1: ${f1bandits.length}  and force2: ${f2bandits.length}`);
        let zones = this.getContestedWarzones();

        if (f1bandits.length > 0) zones.targets.force1 = f1bandits[GetRandomInt(0, f1bandits.length - 1)];
        if (f2bandits.length > 0) zones.targets.force2 = f2bandits[GetRandomInt(0, f2bandits.length - 1)];

        if (!(f1bandits.length > 0 && f2bandits.length > 0)) {
            print(`Not both players can fight the bandits, so it will be a war instead.`);
            if (f1bandits.length == 0) zones.selectedBattlefield = zones.targets.force1;
            else zones.selectedBattlefield = zones.targets.force2;
            this.deadLock = true;
        }
        return zones;
    }

    private getContestedWarzones(): WarContainer {
        let warzones = Warzones.getInstance();
        let zones1 = warzones.getContestedWarzonesByForce(Forces.FORCE_1);
        let zones2 = warzones.getContestedWarzonesByForce(Forces.FORCE_2);
        let f1zone = zones1[GetRandomInt(0, zones1.length - 1)];
        let f2zone = zones2[GetRandomInt(0, zones2.length - 1)];
        return new WarContainer(new WarTargets(f1zone, f2zone));
    }

    private getFinalWarzone(force1: Occupant[]): WarContainer {
        //If there is only 1 city left for every player we will set the warzone to the one outside for final standoff.
        print(`Its the final showdown.`);
        let cont = this.getContestedWarzones();
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
    public bandit: Army | null = null;
}

export enum WarState {
    SETUP = "SETUP",
    PREPARE_CLASH = "PREPARE_CLASH",
    CLASHING = "CLASHING",
    BREAK = "BREAK",
    PREPARE_FOR_SIEGE = "PREPARE_FOR_SIEGE",
    SIEGE = "SIEGE",
    END = "END",
}