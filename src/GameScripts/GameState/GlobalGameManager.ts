import {Hooks} from "../../TreeLib/Hooks";
import {Entity} from "../../TreeLib/Entity";
import {WorldState} from "../Enums/WorldState";
import {War} from "./War/War";
import {MapEvent} from "./Events/MapEvent";
import {AIManager} from "../AI/AIManager";
import {Delay} from "../../TreeLib/Utility/Delay";
import {InputManager} from "../../TreeLib/InputManager/InputManager";

export class GlobalGameManager extends Entity {
    private static instance: GlobalGameManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GlobalGameManager();
            Hooks.set("GlobalStatus", this.instance);
        }
        return this.instance;
    }

    public worldState: WorldState = WorldState.NEUTRAL;
    public currentWar: War | null = null;
    public currentEvent: MapEvent | null = null;
    public guardSpawnCounter: number = 0;
    public timeToWar: number = 600;
    public reset: number = 300;
    private aiManager: AIManager = AIManager.getInstance();

    constructor() {
        super();
        this._timerDelay = 0.5;

        this.aiManager.performAIReinforcements();
        Delay.addDelay(() => {
            this.aiManager.performAIRelocation();
            this.aiManager.performBanditRelocation();
        }, 20);


        InputManager.addKeyboardPressCallback(OSKEY_N, () => {
            this.startWar();
        });

        InputManager.addKeyboardPressCallback(OSKEY_M, () => {
            this.endWar();
        });
    }

    public startWar() {
        this.worldState = WorldState.WAR;
        this.currentWar = new War();
    }

    public endWar() {
        this.worldState = WorldState.NEUTRAL;
        this.currentWar?.endWar();
    }

    step(): void {


        if (this.worldState == WorldState.NEUTRAL) {
            this.guardSpawnCounter += this._timerDelay;
            this.timeToWar -= this._timerDelay;


            if (this.guardSpawnCounter == 30) {
                this.aiManager.performAIReinforcements();
            }
            if (this.guardSpawnCounter == 70) {
                this.aiManager.performAIRelocation();
            }
            if (this.guardSpawnCounter == 160) {
                this.aiManager.performBanditRelocation();
            }

            if (this.guardSpawnCounter % 10 == 0) {
                print(this.guardSpawnCounter);
            }
        }

        /*if (this.timeToWar == 600 ) {
            this.startWar();
        }*/

        if (this.guardSpawnCounter > this.reset) {
            this.guardSpawnCounter -= this.reset;
        }
    }
}