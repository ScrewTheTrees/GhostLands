import {ArmySoldier} from "./ArmySoldier";
import {AIForceData} from "../../AI/AIForceData";
import {NamedRect} from "../../RectControl/NamedRect";
import {Point} from "../../../TreeLib/Utility/Point";
import {UnitQueue} from "../../../TreeLib/ActionQueue/Queues/UnitQueue";
import {ActionQueue} from "../../../TreeLib/ActionQueue/ActionQueue";
import {Delay} from "../../../TreeLib/Utility/Delay";
import {PathManager} from "../../PathManager";
import {UnitClass} from "../../Enums/UnitClass";
import {Quick} from "../../../TreeLib/Quick";
import {CreateUnitHandleSkin} from "../../flavor/Skinner";
import {ArmyPlatoon} from "./ArmyPlatoon";
import {UnitGroupQueue} from "../../../TreeLib/ActionQueue/Queues/UnitGroupQueue";
import {UnitGroupActionExecuteCode} from "../../../TreeLib/ActionQueue/Actions/UnitGroupActionExecuteCode";
import {Rectifier} from "../../RectControl/Rectifier";
import {GetIDByForce} from "../../Enums/Forces";

export class Army {
    public platoons: ArmyPlatoon[] = [];
    public forceData: AIForceData;
    public gathering: NamedRect;
    public pathManager: PathManager = PathManager.getInstance();

    constructor(forceData: AIForceData, gathering: NamedRect) {
        this.forceData = forceData;
        this.gathering = gathering;

        this.performRevival(this.forceData.amountOfMelee, this.forceData.amountOfRanged, this.forceData.amountOfCasters, this.forceData.amountOfCavalry, this.forceData.amountOfArtillery);
    }

    public performRevival(melee: number, ranged: number, caster: number, cavalry: number, artillery: number) {
        Delay.addDelay(() => {
            this.makeMeleeSoldier();
        }, 1, math.ceil(melee));
        Delay.addDelay(() => {
            this.makeArtillerySoldier();
        }, 1, math.ceil(artillery));

        Delay.addDelay(() => {
            Delay.addDelay(() => {
                this.makeRangedSoldier();
            }, 1, math.ceil(ranged));
            Delay.addDelay(() => {
                this.makeCasterSoldier();
            }, 1, math.ceil(caster));
        }, 1.30);

        Delay.addDelay(() => {
            Delay.addDelay(() => {
                this.makeCavalrySoldier();
            }, 1, math.ceil(cavalry));
        }, 1.60)
    }

    public makeMeleeSoldier() {
        return this.executeSoldierSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.MELEE), this.forceData.getRandomSpawnPoint());
    }

    public makeRangedSoldier() {
        return this.executeSoldierSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.RANGED), this.forceData.getRandomSpawnPoint());
    }

    public makeCasterSoldier() {
        return this.executeSoldierSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.CASTER), this.forceData.getRandomSpawnPoint());
    }

    public makeCavalrySoldier() {
        return this.executeSoldierSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.CAVALRY), this.forceData.getRandomSpawnPoint());
    }

    public makeArtillerySoldier() {
        return this.executeSoldierSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.ARTILLERY), this.forceData.getRandomSpawnPoint());
    }

    public executeSoldierSpawn(unitType: number, spawnPoint: Point): ArmySoldier {
        let u = CreateUnitHandleSkin(this.forceData.aiPlayerArmy, unitType, spawnPoint.x, spawnPoint.y, spawnPoint.directionTo(new Point(0, 0)));
        SetUnitCreepGuard(u, false);
        RemoveGuardPosition(u);

        let queue = new UnitQueue(u);
        let armySoldier = new ArmySoldier(u, this.forceData.force, queue);
        let platoon = this.getUnsatisfiedPlatoon();
        Quick.Push(platoon.soldiers, armySoldier);

        this.sendSoldierToPlaceholder(armySoldier);

        return armySoldier;
    }

    private getUnsatisfiedPlatoon() {
        for (let i = 0; i < this.platoons.length; i++) {
            let plat = this.platoons[i];
            if (!plat.isFull()) {
                return plat;
            }
        }
        //No platoon
        let plat = new ArmyPlatoon(this.forceData.force, new UnitGroupQueue([]));
        Quick.Push(this.platoons, plat);
        return plat;
    }

    public sendAllSoldiersToGathering() {
        let i = 0;
        this.platoons.forEach((platoon) => {
            i += 4;
            Delay.addDelay(() => {
                this.sendPlatoonToGathering(platoon);
            }, i);
        });
    }

    public sendPlatoonToGathering(platoon: ArmyPlatoon) {
        return this.sendPlatoonToPoint(platoon, this.gathering.getRandomPoint());
    }

    public sendSoldierToPlaceholder(soldier: ArmySoldier) {
        let path = this.pathManager.createPath(Point.fromWidget(soldier.soldier), Rectifier.getInstance().getRectsByForceOfType(GetIDByForce(this.forceData.force), "gathering")[0].getRandomPoint(), this.forceData.force);
        soldier.currentQueue = new UnitQueue(soldier.soldier, ...path);
        ActionQueue.enableQueue(soldier.currentQueue);
    }

    public sendPlatoonToPoint(platoon: ArmyPlatoon, point: Point, delay: number = 0.01) {
        point = point.copy();
        let path = this.pathManager.createPathGroup(platoon.getPlatoonPoint(), point, this.forceData.force);
        //Prepare
        platoon.currentQueue = new UnitGroupQueue(platoon.getUnitList(), path[0]);
        ActionQueue.enableQueue(platoon.currentQueue);
        //Depart
        Delay.addDelay(() => {
            let queue = new UnitGroupQueue(platoon.getUnitList(), ...path);
            platoon.currentQueue = queue;
            queue.addAction(new UnitGroupActionExecuteCode((u: unit[]) => {
                platoon.currentQueue = ActionQueue.createGroupGuardPoint(u, point);
            }));

            ActionQueue.enableQueue(queue);

        }, delay);
    }

    public isArmyDead(): boolean {
        for (let i = 0; i < this.platoons.length; i++) {
            let unit = this.platoons[i];
            if (!unit.isDead()) {
                return false;
            } else {
                Quick.Slice(this.platoons, i);
                i -= 1;
            }
        }
        return true;
    }
}