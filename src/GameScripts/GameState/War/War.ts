import {Occupations} from "../Occupations";
import {Forces} from "../../Enums/Forces";
import {WarData} from "./WarData";
import {Logger} from "../../../TreeLib/Logger";
import {Optional} from "../../../TreeLib/Utility/Optional";
import {Warzone, Warzones} from "./Warzones";
import {Entity} from "../../../TreeLib/Entity";
import {Occupant} from "../Occupant";
import {ChooseOne} from "../../../TreeLib/Misc";
import {Army} from "./Army";

export class War extends Entity {
    public deadLock: boolean = false;
    public state: WarState = WarState.SETUP;
    public targets: Optional<WarContainer>;

    public isFinished: boolean = false;

    //TODO: Replace print with Debug.Log();
    constructor() {
        super();
        print("THERE IS ONLY WAR!");
        this.targets = this.resolveTargets();
        this._timerDelay = 1;

        if (this.targets.isPresent()) {
            print("There is targets!");
            let targets = this.targets.get();
            let t1 = targets.targets.force1.force1gather.getCenter();
            let t2 = targets.targets.force2.force2gather.getCenter();
            CreateUnit(Player(0), FourCC("hpea"), t1.x, t1.y, 0);
            CreateUnit(Player(1), FourCC("hpea"), t2.x, t2.y, 0);

            if (this.deadLock) {
                print("There is a deadlock, det finns bara krig.");
            }
        }
    }


    step() {

    }

    public endWar() {
        this.remove(); //Kill entity.
        this.isFinished = true;
    }

    private resolveTargets(): Optional<WarContainer> {
        let container: Optional<WarContainer> = new Optional<WarContainer>(null);

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

            container.set(new WarContainer(new WarTargets(f1zone, f2zone)));
        } else if (f1 != undefined || f2 != undefined) {
            Logger.critical("f1 and f2 are not both undefined or both defined, something went horribly horribly wrong, please refer to War.ts");
            this.endWar();
        } else if ((force1.length == 1 || force2.length == 1) && !(force1.length == 1 && force2.length == 1)) {
            container.set(this.getFinalWarzone(force1));
        } else if (f1bandits.length > 0 || f2bandits.length > 0) {
            print(`Prioritise bandits, force1: ${f1bandits.length}  and force2: ${f2bandits.length}`);
            let zones = this.getContestedWarzones();

            if (f1bandits.length > 0) zones.targets.force1 = f1bandits[GetRandomInt(0, f1bandits.length - 1)];
            if (f2bandits.length > 0) zones.targets.force2 = f2bandits[GetRandomInt(0, f2bandits.length - 1)];

            if (!(f1bandits.length > 0 && f2bandits.length > 0)) {
                print(`Not both players can fight the bandits, so it will be a war instead.`);
                if (f1bandits.length == 0) zones.selectedBattlefield.set(zones.targets.force1);
                else zones.selectedBattlefield.set(zones.targets.force2);
                this.deadLock = true;
            }
            container.set(zones);
        } else {
            print(`Generic war.`);
            container.set(this.getContestedWarzones());
            container.get().selectedBattlefield = ChooseOne(container.get().targets.force1, container.get().targets.force2)
        }

        if (container.isPresent() && !container.get().selectedBattlefield.isPresent()) {
            if (GetRandomInt(0, 1) == 0) {
                container.get().selectedBattlefield = new Optional<Warzone>(container.get().targets.force1);
            } else {
                container.get().selectedBattlefield = new Optional<Warzone>(container.get().targets.force2);
            }
        }

        return container;
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
            cont.selectedBattlefield.set(zone);
        } else {
            print(`At player 2.`);
            let zone = Warzones.getInstance().getWarzoneByForceAndCity(Forces.FORCE_1, Occupations.getInstance().FORCE_2_BASE);
            cont.targets.force2 = zone;
            cont.selectedBattlefield.set(zone);
        }
        return cont;
    }
}

export class WarContainer {
    public targets: WarTargets;
    public selectedBattlefield: Optional<Warzone> = new Optional<Warzone>(null);
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
    public force1: Optional<Army> = new Optional<Army>(null);
    public force2: Optional<Army> = new Optional<Army>(null);
    public bandit: Optional<Army> = new Optional<Army>(null);
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