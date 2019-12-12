import {ArmySoldier} from "./ArmySoldier";
import {AIForceData} from "../../AI/AIForceData";
import {NamedRect} from "../../RectControl/NamedRect";
import {Occupant} from "../Occupant";

export class Army {
    public units: ArmySoldier[] = [];
    public forceData: AIForceData;
    public gathering: NamedRect;
    public targetCity: Occupant;

    constructor(forceData: AIForceData, gathering: NamedRect, targetCity: Occupant) {
        this.forceData = forceData;
        this.gathering = gathering;
        this.targetCity = targetCity;
    }
}