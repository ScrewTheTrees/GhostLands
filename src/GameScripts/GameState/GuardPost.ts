import {Point} from "../../TreeLib/Utility/Point";
import {GuardType} from "../Enums/GuardType";
import {Guard} from "./Guard";

export class GuardPost {
    public point: Point;
    public postType: GuardType;
    public occupied: Guard | undefined;

    constructor(point: Point, postType: GuardType) {
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