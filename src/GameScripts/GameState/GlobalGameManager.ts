import {Hooks} from "../../TreeLib/Hooks";
import {Entity} from "../../TreeLib/Entity";
import {WorldState} from "../Enums/WorldState";
import {War} from "./War/War";
import {MapEvent} from "./MapEvent";
import {AIManager} from "../AI/AIManager";
import {Delay} from "../../TreeLib/Utility/Delay";
import {InputManager} from "../../TreeLib/InputManager/InputManager";

export class GlobalGameManager extends Entity {
    private static instance: GlobalGameManager;
    public worldState: WorldState = WorldState.NEUTRAL;
    public currentWar: War | null = null;
    public currentEvent: MapEvent | null = null;
    public counter: number = 0;
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
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GlobalGameManager();
            Hooks.set("GlobalStatus", this.instance);
        }
        return this.instance;
    }

    public startWar() {
        this.worldState = WorldState.WAR;
        this.currentWar = new War();
    }

    step(): void {
        this.counter += this._timerDelay;
        this.timeToWar += this._timerDelay;

        if (this.counter == 30 && this.worldState == WorldState.NEUTRAL) {
            this.aiManager.performAIReinforcements();
        }
        if (this.counter == 70 && this.worldState == WorldState.NEUTRAL) {
            this.aiManager.performAIRelocation();
        }
        if (this.counter == 160 && this.worldState == WorldState.NEUTRAL) {
            this.aiManager.performBanditRelocation();
        }

        if (this.counter % 10 == 0) {
            print(this.counter);
        }

        /*if (this.timeToWar == 600 ) {
            this.startWar();
        }*/

        if (this.counter > this.reset) {
            this.counter -= this.reset;
        }
    }
}