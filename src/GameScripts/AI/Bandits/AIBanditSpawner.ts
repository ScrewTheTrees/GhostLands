import {AIForceData} from "../AIForceData";
import {Rectifier} from "../../RectControl/Rectifier";
import {BanditCamp} from "./BanditCamp";
import {AIGuardSpawner} from "../AIGuardSpawner";
import {UnitClass} from "../../Enums/UnitClass";

export class AIBanditSpawner extends AIGuardSpawner {

    constructor(forceData: AIForceData, camp: BanditCamp) {
        super(forceData, 3);
        this.forceData = forceData;

        if (camp == BanditCamp.CAMP_NORTH) {
            this.gathering = Rectifier.getInstance().getRectByWEName("banditcamp1gathering");
        } else if (camp == BanditCamp.CAMP_SOUTH) {
            this.gathering = Rectifier.getInstance().getRectByWEName("banditcamp2gathering");
        }
    }

    /**
     * OVERRIDE
     */
    public performUnitRevival() {
        let melee = Math.min(this.forceData.amountOfMelee, this.buffer + math.ceil(this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.MELEE) / 2) - this.countUnitOfGuardType(UnitClass.MELEE));
        let ranged = Math.min(this.forceData.amountOfRanged, this.buffer + math.ceil(this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.RANGED) / 2) - this.countUnitOfGuardType(UnitClass.RANGED));

        this.performRevival(melee, ranged);
    }
}