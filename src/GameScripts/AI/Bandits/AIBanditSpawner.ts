import {AIForceData} from "../AIForceData";
import {Rectifier} from "../../RectControl/Rectifier";
import {Units} from "../../Enums/Units";
import {RecruitContainer} from "../RecruitContainer";
import {UnitQueue} from "../../../TreeLib/ActionQueue/Queues/UnitQueue";
import {Delay} from "../../../TreeLib/Utility/Delay";
import {GetGuardTypeFromUnit, GuardType} from "../../Enums/GuardType";
import {BanditCamp} from "./BanditCamp";
import {AIUnitSpawner} from "../AIUnitSpawner";
import {InputManager} from "../../../TreeLib/InputManager/InputManager";

export class AIBanditSpawner extends AIUnitSpawner {

    constructor(forceData: AIForceData, camp: BanditCamp) {
        super(forceData, 3);
        this.forceData = forceData;

        if (camp == BanditCamp.CAMP_NORTH) {
            this.gathering = Rectifier.getInstance().getRectByWEName("banditcamp1gathering");
        } else if (camp == BanditCamp.CAMP_SOUTH) {
            this.gathering = Rectifier.getInstance().getRectByWEName("banditcamp2gathering");
        }
        InputManager.addKeyboardPressCallback(OSKEY_N, () => {
            this.currentWaveTime = this.waveTimer;
        });

        this.waveTimer = 120;
        this.currentWaveTime = -60
    }

    step() {
        this.updateTimeScale();

        this.currentSpawnTime += this._timerDelay * this.spawnTimeScale;
        this.currentWaveTime += this._timerDelay;
        if (this.currentSpawnTime >= this.spawnTimer && !this.paused) {
            this.currentSpawnTime -= this.spawnTimer;

            let spawnPoint = this.forceData.getRandomSpawnPoint();

            let u = CreateUnit(this.forceData.aiPlayer, Units.SOLDIER, spawnPoint.x, spawnPoint.y, GetRandomReal(0, 360));
            let u2 = CreateUnit(this.forceData.aiPlayer, Units.ARCHER, spawnPoint.x, spawnPoint.y, GetRandomReal(0, 360));
            SetUnitCreepGuard(u, false);
            RemoveGuardPosition(u);
            SetUnitCreepGuard(u2, false);
            RemoveGuardPosition(u2);

            let queue = new UnitQueue(u);
            let queue2 = new UnitQueue(u2);
            let recruit = new RecruitContainer(u, queue);
            let recruit2 = new RecruitContainer(u2, queue2);
            this.unitsInGather.push(recruit);
            this.unitsInGather.push(recruit2);

            this.sendRecruitToRect(recruit, this.gathering.value, 0);
            this.sendRecruitToRect(recruit2, this.gathering.value, 0);
        }
        if (this.currentWaveTime >= this.waveTimer) {
            this.currentWaveTime -= this.waveTimer;

            //this.replenishTroopsInAllCities();

            Delay.addDelay(() => {
                while (this.unitsInGather.length > 0) {
                    let container = this.unitsInGather.pop();
                    let delay = 0;
                    if (container) {
                        if (GetGuardTypeFromUnit(container.recruit) == GuardType.RANGED) {
                            delay = 5;
                        }
                    }

                    Delay.addDelay(() => {
                        if (container) {
                            this.sendRecruitToRect(container, _G.gg_rct_city3, 5);
                        }
                    }, delay);
                }
            }, 30);
        }
    }

    updateTimeScale() {
        let units = CountLivingPlayerUnitsOfTypeId(FourCC("h001"), this.forceData.aiPlayer)
            + CountLivingPlayerUnitsOfTypeId(FourCC("h002"), this.forceData.aiPlayer);
        this.spawnTimeScale = 1 / (1 + units);
    }
}