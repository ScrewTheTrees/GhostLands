import {Point} from "../../TreeLib/Utility/Point";
import {UnitClass} from "../Enums/UnitClass";
import {Guard} from "../AI/Guard";

export class GuardPost {
    public point: Point;
    public postType: UnitClass;
    public occupied: Guard | undefined;

    constructor(point: Point, postType: UnitClass) {
        this.point = point;
        this.postType = postType;
    }

    public hasGuard(): boolean {
        return (this.occupied != undefined && !this.occupied.isDead());
    }

    public needNewGuard(): boolean {
        return (this.occupied == undefined || this.occupied.hasDespawned());
    }
}