import {AIForceData} from "./AIForceData";
import {Rectifier} from "../RectControl/Rectifier";
import {Point} from "../../TreeLib/Utility/Point";
import {ActionQueue} from "../../TreeLib/ActionQueue/ActionQueue";
import {PathManager} from "./PathManager";
import {UnitQueue} from "../../TreeLib/ActionQueue/Queues/UnitQueue";
import {UnitActionExecuteCode} from "../../TreeLib/ActionQueue/Actions/UnitActionExecuteCode";
import {Delay} from "../../TreeLib/Utility/Delay";
import {Occupations} from "../GameState/Occupations";
import {Occupant} from "../GameState/Occupant";
import {GetGuardTypeFromUnit, UnitClass} from "../Enums/UnitClass";
import {Guard} from "../GameState/Guard";
import {NamedRect} from "../RectControl/NamedRect";
import {DummyCaster} from "../../TreeLib/DummyCasting/DummyCaster";

export class AIUnitSpawner {
    public forceData: AIForceData;
    public forceId: number;
    public gathering: NamedRect;

    public pathManager: PathManager = PathManager.getInstance();
    public occupations: Occupations = Occupations.getInstance();
    public buffer: number = 1;

    public unitsInGather: Guard[] = [];

    constructor(forceData: AIForceData, forceId: number) {
        this.forceData = forceData;
        this.forceId = forceId;
        this.gathering = Rectifier.getInstance().getRectsByForceOfType(forceId, "gathering")[0];
    }

    public performUnitRevival() {
        let melee = Math.min(10, this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.MELEE) - this.countUnitOfGuardType(UnitClass.MELEE));
        let ranged = Math.min(10, this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.RANGED) - this.countUnitOfGuardType(UnitClass.RANGED));

        Delay.addDelay(() => {
            DummyCaster.castImmediately(FourCC("A002"), "berserk", this.makeMeleeGuard().guard);
            DummyCaster.castImmediately(FourCC("A002"), "berserk", this.makeMeleeGuard().guard);
        }, 1, math.ceil(melee / 2));
        Delay.addDelay(() => {
            Delay.addDelay(() => {
                DummyCaster.castImmediately(FourCC("A002"), "berserk", this.makeRangedGuard().guard);
                DummyCaster.castImmediately(FourCC("A002"), "berserk", this.makeRangedGuard().guard);
            }, 2, math.ceil(ranged / 2));
        }, 3);
    }

    public makeMeleeGuard() {
        return this.executeGuardSpawn(this.forceData.meleeUnits.getRandom(), this.forceData.getRandomSpawnPoint());
    }

    public makeRangedGuard() {
        return this.executeGuardSpawn(this.forceData.rangedUnits.getRandom(), this.forceData.getRandomSpawnPoint());
    }

    public executeGuardSpawn(unitType: number, spawnPoint: Point): Guard {
        let u = CreateUnit(this.forceData.aiPlayer, unitType, spawnPoint.x, spawnPoint.y, spawnPoint.directionTo(new Point(0, 0)));
        SetUnitCreepGuard(u, false);
        RemoveGuardPosition(u);

        let queue = new UnitQueue(u);
        let guard = new Guard(u, this.forceData.force, queue);
        this.unitsInGather.push(guard);

        this.sendRecruitToRect(guard, this.gathering.value, 0);

        return guard;
    }

    public replenishTroopsInAllCities() {
        let occupants = this.occupations.getAllOccupants();
        for (let i = 0; i < occupants.length; i++) {
            let occupant = occupants[i];
            if (occupant.owner == this.forceData.force) {
                this.replenishTroopsInCity(occupant);
            }
        }
    }

    public replenishTroopsInCity(occupant: Occupant) {
        for (let j = 0; j < occupant.guardPosts.length; j++) {
            let guard = occupant.guardPosts[j];
            if (guard.needNewGuard()) {
                let unit = this.popUnitByGuardType(guard.postType);
                if (unit != null) {
                    ActionQueue.getInstance().disableQueue(unit.currentQueue);
                    guard.occupied = new Guard(unit.guard, this.forceData.force, unit.currentQueue);
                    this.sendRecruitToPoint(guard.occupied, guard.point);
                }
            }
        }
    }

    public popUnitByGuardType(postType: UnitClass): Guard | null {
        for (let i = 0; i < this.unitsInGather.length; i++) {
            let u = this.unitsInGather[i];
            if (GetGuardTypeFromUnit(u.guard) == postType) {
                this.unitsInGather.splice(i, 1);
                return u;
            }
        }

        return null;
    }

    public countUnitOfGuardType(guardType: UnitClass): number {
        let num = 0;
        for (let i = 0; i < this.unitsInGather.length; i++) {
            let u = this.unitsInGather[i];
            if (GetGuardTypeFromUnit(u.guard) == guardType) {
                num += 1;
            }
        }
        return num;
    }

    public sendRecruitToRect(recruit: Guard, rct: rect, delay?: number) {
        return this.sendRecruitToPoint(recruit, Point.fromLocationClean(GetRandomLocInRect(rct)), delay);
    }

    public sendRecruitToPoint(recruit: Guard, point: Point, delay: number = 5) {
        point = point.copy();
        let path = this.pathManager.createAttackPath(Point.fromWidget(recruit.guard), point, this.forceData.force);
        //Prepare
        recruit.currentQueue = new UnitQueue(recruit.guard, path[0]);
        ActionQueue.enableQueue(recruit.currentQueue);
        //Depart
        Delay.addDelay(() => {
            let queue = new UnitQueue(recruit.guard, ...path);
            recruit.currentQueue = queue;
            queue.addAction(new UnitActionExecuteCode((u: unit) => {
                recruit.currentQueue = ActionQueue.createSimpleGuardPoint(u, point);
            }));

            ActionQueue.enableQueue(queue);

        }, delay);
    }
}