import {NamedRect} from "../../RectControl/NamedRect";
import {Logger} from "../../../TreeLib/Logger";
import {Players} from "../../../TreeLib/Structs/Players";
import {Quick} from "../../../TreeLib/Quick";
import {IsValidUnit} from "../../../TreeLib/Misc";
import {CreepCampTypes} from "./CreepCampTypes";
import {GetCreepTableByCreepCampType} from "./CreepCampSpawnTable";
import {CreateUnitHandleSkin} from "../../flavor/Skinner";
import {TreeMath} from "../../../TreeLib/Utility/TreeMath";

export class NeutralCreepCamp {
    public location: NamedRect;
    public campType: CreepCampTypes;
    public creeps: unit[];
    public noOfCreeps: number;

    public secondTimer: number = 600;
    public secondTimerReset: number = 600;

    constructor(location: NamedRect, creeps: unit[], campType: CreepCampTypes, noOfCreeps: number) {
        this.location = location;
        this.creeps = creeps;
        this.campType = campType;
        this.noOfCreeps = noOfCreeps;

        Logger.verbose(`Created creep camp of ${creeps.length} creeps at: ${location.getCenter().toString()} of ${this.campType}`);
    }

    public isCampDead() {
        return this.creeps.length == 0;
    }

    public respawn() {
        let num = GetRandomInt(this.noOfCreeps, this.noOfCreeps);

        for (let i = 0; i < num; i++) {
            let point = this.location.getRandomPoint();
            let u = CreateUnitHandleSkin(Players.NEUTRAL_HOSTILE, GetCreepTableByCreepCampType(this.campType).getRandomAsId(), point.x, point.y, TreeMath.RandAngle());
            SetUnitAcquireRange(u, 200);
            Quick.Push(this.creeps, u);
        }

        this.secondTimer = this.secondTimerReset;
    }

    public update(_timerDelay: number) {
        for (let i = this.creeps.length -  1; i >= 0; i--) {
            let value = this.creeps[i];
            if (!IsValidUnit(value)) {
                Quick.Slice(this.creeps, i);
            }
        }
        if (this.isCampDead()) {
            this.secondTimer -= _timerDelay;
        }
    }
}