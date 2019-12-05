import {Point} from "../../TreeLib/Utility/Point";
import {GuardType} from "../Enums/GuardType";

export class GuardPost {
    public point: Point;
    public postType: GuardType;
    public occupied: unit | undefined;

    constructor(point: Point, postType: GuardType) {
        this.point = point;
        this.postType = postType;
    }
}