import {AIForceData} from "../AIForceData";
import {Rectifier} from "../../RectControl/Rectifier";
import {BanditCamp} from "./BanditCamp";
import {AIGuardSpawner} from "../AIGuardSpawner";
import {UnitClass} from "../../Enums/UnitClass";

export class AIBanditSpawner extends AIGuardSpawner {

    constructor(forceData: AIForceData, camp: BanditCamp) {
        super(forceData);
        this.forceData = forceData;

        if (camp == BanditCamp.CAMP_NORTH) {
            this.gathering = Rectifier.getInstance().getRectByWEName("banditcamp1gathering");
        } else if (camp == BanditCamp.CAMP_SOUTH) {
            this.gathering = Rectifier.getInstance().getRectByWEName("banditcamp2gathering");
        }

        this.buffer = 3;
    }

    /**
     * OVERRIDE
     */
    public performUnitRevival() {
        let melee = Math.min(this.forceData.amountOfMelee, this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.MELEE)) - this.countUnitOfGuardType(UnitClass.MELEE);
        let ranged = Math.min(this.forceData.amountOfRanged, this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.RANGED)) - this.countUnitOfGuardType(UnitClass.RANGED);
        let casters = Math.min(this.forceData.amountOfCasters, this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.CASTER)) - this.countUnitOfGuardType(UnitClass.CASTER);
        let cavalry = Math.min(this.forceData.amountOfCavalry, this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.CAVALRY)) - this.countUnitOfGuardType(UnitClass.CAVALRY);
        let artillery = Math.min(this.forceData.amountOfArtillery, this.buffer + this.occupations.getNeededGuardsByForce(this.forceData.force, UnitClass.ARTILLERY)) - this.countUnitOfGuardType(UnitClass.ARTILLERY);

        this.performRevival(melee, ranged, casters, cavalry, artillery);
    }
}