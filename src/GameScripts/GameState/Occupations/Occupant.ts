import {Forces} from "../../Enums/Forces";
import {GuardPost} from "../../AI/GuardPost";
import {Rectifier} from "../../RectControl/Rectifier";
import {NamedRect} from "../../RectControl/NamedRect";
import {GetUnitClassFromUnitType, UnitClass} from "../../Enums/UnitClass";
import {Point} from "../../../TreeLib/Utility/Point";
import {Guard} from "../../AI/Guard";
import {ActionQueue} from "../../../TreeLib/ActionQueue/ActionQueue";
import {Quick} from "../../../TreeLib/Quick";
import {AIForceData} from "../../AI/AIForceData";

export class Occupant {
    public owner: Forces;
    public primaryRect: NamedRect;
    public guardPosts: GuardPost[] = [];
    public keepUnit: unit | null = null;
    public lastStock: number[] = [];

    constructor(owner: Forces, rectName: string, unitGuardArea: string) {
        this.owner = owner;
        this.primaryRect = Rectifier.getInstance().getRectByWEName(rectName);
        this.addGuardPostsByPrefix(unitGuardArea);
    }

    public reStock(force: AIForceData) {
        if (this.keepUnit == null) {
            return;
        }

        for (let i = 0; i < this.lastStock.length; i++) {
            let value = this.lastStock[i];
            RemoveUnitFromStock(this.keepUnit, value);
        }

        if (force != null) {
            let types = force.meleeUnits.getAllAvailable();
            types.push(...force.rangedUnits.getAllAvailable());
            types.push(...force.casterUnits.getAllAvailable());

            this.lastStock = [];
            for (let i = 0; i < types.length; i++) {
                let value = FourCC(types[i]);
                AddUnitToStock(this.keepUnit, value, 32, 32);
                Quick.Push(this.lastStock, value);
            }
        }
    }

    public addGuardPostsByPrefix(unitGuardArea: string) {
        let area = Rectifier.getInstance().getRectByWEName(unitGuardArea);
        let units = GetUnitsInRectAll(area.value);
        let u = FirstOfGroup(units);

        while (u != null) {
            let type: UnitClass = GetUnitClassFromUnitType(GetUnitTypeId(u));
            let point = Point.fromWidget(u);
            let post = new GuardPost(point, type);
            post.occupied = new Guard(u, this.owner, ActionQueue.createSimpleGuardPoint(u, point));
            this.guardPosts.push(post);

            GroupRemoveUnit(units, u);
            u = FirstOfGroup(units);
        }
    }

}