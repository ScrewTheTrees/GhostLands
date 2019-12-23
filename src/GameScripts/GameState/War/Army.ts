import {ArmySoldier} from "./ArmySoldier";
import {AIForceData} from "../../AI/AIForceData";
import {NamedRect} from "../../RectControl/NamedRect";
import {Point} from "../../../TreeLib/Utility/Point";
import {UnitQueue} from "../../../TreeLib/ActionQueue/Queues/UnitQueue";
import {ActionQueue} from "../../../TreeLib/ActionQueue/ActionQueue";
import {Delay} from "../../../TreeLib/Utility/Delay";
import {UnitActionExecuteCode} from "../../../TreeLib/ActionQueue/Actions/UnitActionExecuteCode";
import {PathManager} from "../../AI/PathManager";

export class Army {
    public units: ArmySoldier[] = [];
    public forceData: AIForceData;
    public gathering: NamedRect;
    public pathManager: PathManager = PathManager.getInstance();

    constructor(forceData: AIForceData, gathering: NamedRect) {
        this.forceData = forceData;
        this.gathering = gathering;

        Delay.addDelay(() => {
            this.makeMeleeSoldier();
        }, 1, this.forceData.amountOfMelee);
        Delay.addDelay(() => {
            Delay.addDelay(() => {
                this.makeRangedSoldier();
            }, 1, this.forceData.amountOfRanged)
        }, 5);

    }

    public makeMeleeSoldier() {
        return this.executeSoldierSpawn(this.forceData.meleeUnits.getRandom(), this.forceData.getRandomSpawnPoint());
    }

    public makeRangedSoldier() {
        return this.executeSoldierSpawn(this.forceData.rangedUnits.getRandom(), this.forceData.getRandomSpawnPoint());
    }

    public executeSoldierSpawn(unitType: number, spawnPoint: Point): ArmySoldier {
        let u = CreateUnit(this.forceData.aiPlayerArmy, unitType, spawnPoint.x, spawnPoint.y, spawnPoint.directionTo(new Point(0, 0)));
        SetUnitCreepGuard(u, false);
        RemoveGuardPosition(u);

        let queue = new UnitQueue(u);
        let armySoldier = new ArmySoldier(u, this.forceData.force, queue);
        this.units.push(armySoldier);

        this.sendSoldierToGathering(armySoldier);

        return armySoldier;
    }

    public sendAllSoldiersToGathering() {
        this.units.forEach((unit) => {
            this.sendSoldierToGathering(unit);
        });
    }

    public sendSoldierToGathering(recruit: ArmySoldier) {
        return this.sendSoldierToPoint(recruit, this.gathering.getRandomPoint());
    }

    public sendSoldierToPoint(armySoldier: ArmySoldier, point: Point) {
        point = point.copy();
        let path = this.pathManager.createPath(Point.fromWidget(armySoldier.soldier), point, this.forceData.force);
        //Prepare
        armySoldier.currentQueue = new UnitQueue(armySoldier.soldier, path[0]);
        ActionQueue.enableQueue(armySoldier.currentQueue);
        //Depart
        Delay.addDelay(() => {
            let queue = new UnitQueue(armySoldier.soldier, ...path);
            armySoldier.currentQueue = queue;
            queue.addAction(new UnitActionExecuteCode((u: unit) => {
                armySoldier.currentQueue = ActionQueue.createSimpleGuardPoint(u, point);
            }));

            ActionQueue.enableQueue(queue);

        }, 0.5);
    }

    public isArmyDead(): boolean {
        for (let i = 0; i < this.units.length; i++) {
            let unit = this.units[i];
            if (!unit.isDead()) {
                return false;
            }
        }
        return true;
    }
}