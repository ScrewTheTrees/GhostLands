import {Forces} from "../Enums/Forces";
import {GuardPost} from "./GuardPost";
import {Rectifier} from "../RectControl/Rectifier";
import {NamedRect} from "../RectControl/NamedRect";
import {Segment} from "../RectControl/Segment";
import {ShitEx} from "../../TreeLib/ShitEx";
import {GetGuardTypeFromString, GuardType} from "../Enums/GuardType";
import {Point} from "../../TreeLib/Utility/Point";

export class Occupant {
    public owner: Forces;
    public primaryRect: NamedRect;
    public guardPosts: GuardPost[] = [];

    constructor(owner: Forces, rectName: string, postPrefix: string) {
        this.owner = owner;
        this.primaryRect = Rectifier.getInstance().getRectByWEName(rectName);
        let posts = Rectifier.getInstance().getRectsStartsWithWEName(postPrefix);
        for (let i = 0; i < posts.length; i++) {
            let theRect = posts[i];
            let segments = new Segment(ShitEx.separateNumbers(theRect.name));
            let type: GuardType = GetGuardTypeFromString(segments.segment3);
            this.guardPosts.push(new GuardPost(Point.fromRectCenter(theRect.value), type));
        }
    }
}