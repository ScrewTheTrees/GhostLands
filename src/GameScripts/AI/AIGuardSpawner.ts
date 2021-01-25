import {AIForceData} from "./AIForceData";
import {Rectifier} from "../RectControl/Rectifier";
import {Point} from "../../TreeLib/Utility/Point";
import {ActionQueue} from "../../TreeLib/ActionQueue/ActionQueue";
import {PathManager} from "../PathManager";
import {UnitQueue} from "../../TreeLib/ActionQueue/Queues/UnitQueue";
import {UnitActionExecuteCode} from "../../TreeLib/ActionQueue/Actions/UnitActionExecuteCode";
import {Delay} from "../../TreeLib/Utility/Delay";
import {Occupations} from "../GameState/Occupations/Occupations";
import {Occupant} from "../GameState/Occupations/Occupant";
import {GetDelayFromUnitClass, GetGuardTypeFromUnit, UnitClass} from "../Enums/UnitClass";
import {Guard} from "./Guard";
import {NamedRect} from "../RectControl/NamedRect";
import {Quick} from "../../TreeLib/Quick";
import {CreateUnitHandleSkin} from "../flavor/Skinner";
import {Forces, GetIDByForce} from "../Enums/Forces";

export class AIGuardSpawner {
    public forceData: AIForceData;
    public gathering: NamedRect;

    public pathManager: PathManager = PathManager.getInstance();
    public occupations: Occupations = Occupations.getInstance();
    public buffer: number = 0;

    public unitsInGather: Guard[] = [];

    constructor(forceData: AIForceData) {
        this.forceData = forceData;
        this.gathering = Rectifier.getInstance().getRectsByForceOfType(GetIDByForce(forceData.force), "gathering")[0];
    }

    public performUnitRevival() {
        let melee = this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.MELEE) - this.countUnitOfGuardType(UnitClass.MELEE);
        let ranged = this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.RANGED) - this.countUnitOfGuardType(UnitClass.RANGED);
        let caster = this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.CASTER) - this.countUnitOfGuardType(UnitClass.CASTER);
        let cavalry = this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.CAVALRY) - this.countUnitOfGuardType(UnitClass.CAVALRY);
        let artillery = this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.ARTILLERY) - this.countUnitOfGuardType(UnitClass.ARTILLERY);

        this.performRevival(melee, ranged, caster, cavalry, artillery);
    }

    public performRevival(melee: number, ranged: number, caster: number, cavalry: number, artillery: number) {
        if (melee > 0) {
            Delay.addDelay(() => {
                this.executeGuardSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.MELEE), this.forceData.getRandomSpawnPoint());
            }, 1, melee);
        }
        if (artillery > 0) {
            Delay.addDelay(() => {
                this.executeGuardSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.ARTILLERY), this.forceData.getRandomSpawnPoint());
            }, 1, artillery);
        }

        Delay.addDelay(() => {
            if (ranged > 0) {
                Delay.addDelay(() => {
                    this.executeGuardSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.RANGED), this.forceData.getRandomSpawnPoint());
                }, 1, ranged);
            }
            if (caster > 0) {
                Delay.addDelay(() => {
                    this.executeGuardSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.CASTER), this.forceData.getRandomSpawnPoint());
                }, 1, caster);
            }
        }, GetDelayFromUnitClass(UnitClass.RANGED));

        if (cavalry > 0) {
            Delay.addDelay(() => {
                Delay.addDelay(() => {
                    this.executeGuardSpawn(this.forceData.getUnitTypeOfUnitClass(UnitClass.CAVALRY), this.forceData.getRandomSpawnPoint());
                }, 1, math.ceil(cavalry));
            }, GetDelayFromUnitClass(UnitClass.CAVALRY))
        }
    }

    public executeGuardSpawn(unitType: number, spawnPoint: Point): Guard {
        let u = CreateUnitHandleSkin(this.forceData.aiPlayer, unitType, spawnPoint.x, spawnPoint.y, spawnPoint.directionTo(new Point(0, 0)));
        SetUnitCreepGuard(u, false);
        RemoveGuardPosition(u);

        let queue = new UnitQueue(u);
        let guard = new Guard(u, this.forceData.force, queue);
        Quick.Push(this.unitsInGather, guard);

        this.sendRecruitToRect(guard, this.gathering.value, 0);

        return guard;
    }

    public replenishTroopsInAllCities() {
        let occupants = this.occupations.getTownsOwnedBy(this.forceData.force);
        for (let i = 0; i < occupants.length; i++) {
            let occupant = occupants[i];
            this.replenishTroopsInCity(occupant);
        }
    }

    public replenishTroopsInCity(occupant: Occupant) {
        for (let j = 0; j < occupant.guardPosts.length; j++) {
            let guard = occupant.guardPosts[j];
            if (guard.needNewGuard()) {
                let unit = this.popUnitByGuardType(guard.postType);
                Delay.addDelay(() => {
                    if (unit != null) {
                        ActionQueue.getInstance().disableQueue(unit.currentQueue);
                        guard.occupied = unit;
                        this.sendRecruitToPoint(guard.occupied, guard.point);
                    }
                }, GetDelayFromUnitClass(guard.postType));
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

    public sendRecruitToPoint(recruit: Guard, point: Point, delay: number = 10) {
        point = point.copy();
        let path = this.pathManager.createPath(Point.fromWidget(recruit.guard), point, this.forceData.force);
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


    public stockUpAllGuardPointsInstant() {
        let occupations = Occupations.getInstance().getTownsOwnedBy(this.forceData.force);
        occupations.forEach((occupant) => {
            occupant.guardPosts.forEach((guardPost) => {
                if (guardPost.needNewGuard()) {
                    let pos = guardPost.point;
                    let unit = CreateUnitHandleSkin(this.forceData.aiPlayer, this.forceData.getUnitTypeOfUnitClass(guardPost.postType), pos.x, pos.y, 0);
                    let queue = ActionQueue.createSimpleGuardPoint(unit, pos);
                    guardPost.occupied = new Guard(unit, this.forceData.force, queue);
                }
            });
        });
    }
}