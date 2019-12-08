import {AIForceData} from "../AIForceData";
import {Rectifier} from "../../RectControl/Rectifier";
import {BanditCamp} from "./BanditCamp";
import {AIUnitSpawner} from "../AIUnitSpawner";

export class AIBanditSpawner extends AIUnitSpawner {

    constructor(forceData: AIForceData, camp: BanditCamp) {
        super(forceData, 3);
        this.forceData = forceData;

        if (camp == BanditCamp.CAMP_NORTH) {
            this.gathering = Rectifier.getInstance().getRectByWEName("banditcamp1gathering");
        } else if (camp == BanditCamp.CAMP_SOUTH) {
            this.gathering = Rectifier.getInstance().getRectByWEName("banditcamp2gathering");
        }
    }
}