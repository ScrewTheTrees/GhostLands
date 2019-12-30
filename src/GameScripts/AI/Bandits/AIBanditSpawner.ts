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
        let casters = Math.min(this.forceData.amountOfCasters, this.buffer + math.ceil(this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.CASTER) / 2) - this.countUnitOfGuardType(UnitClass.CASTER));
        let cavalry = Math.min(this.forceData.amountOfCavalry, math.ceil((this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.CAVALRY)) / 2) - this.countUnitOfGuardType(UnitClass.CAVALRY));
        let artillery = Math.min(this.forceData.amountOfArtillery, math.ceil((this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.ARTILLERY)) / 2) - this.countUnitOfGuardType(UnitClass.ARTILLERY));

        this.performRevival(melee, ranged, casters, cavalry, artillery);
    }
}