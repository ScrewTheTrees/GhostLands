import {Hooks} from "../../TreeLib/Hooks";
import {Entity} from "../../TreeLib/Entity";
import {WorldState} from "../Enums/WorldState";
import {War, WarState} from "./War/War";
import {MapEvent} from "./Events/MapEvent";
import {AIManager} from "../AI/AIManager";
import {InputManager} from "../../TreeLib/InputManager/InputManager";
import {DummyCaster} from "../../TreeLib/DummyCasting/DummyCaster";
import {QuickSplice} from "../../TreeLib/Misc";

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
    public allWars: War[] = [];
    public currentEvent: MapEvent | null = null;
    public guardSpawnCounter: number = 0;
    public timeToWar: number = 120;
    public reset: number = 120;
    private aiManager: AIManager = AIManager.getInstance();

    constructor() {
        super();
        this._timerDelay = 0.5;
        this.aiManager.banditNorthSpawner.stockUpAllGuardPointsInstant();

        InputManager.addKeyboardPressCallback(OSKEY_Q, () => {
            this.startWar();
        });

        InputManager.addKeyboardPressCallback(OSKEY_W, () => {
            this.allWars.forEach((war) => {
                if (war.targets) {
                    war.targets.armies.force1?.units.forEach((soldier) => {
                        DummyCaster.castImmediately(FourCC("A002"), "berserk", soldier.soldier);
                    });
                    war.targets.armies.force2?.units.forEach((soldier) => {
                        DummyCaster.castImmediately(FourCC("A002"), "berserk", soldier.soldier);
                    });
                }
            });
        });
        InputManager.addKeyboardPressCallback(OSKEY_E, () => {
            this.allWars.forEach((war) => {
                war.countdown = 1;
                war.countdown = 1;
            });
        });


        InputManager.addKeyboardPressCallback(OSKEY_P, () => {
            this.endWar();
        });


        InputManager.addKeyboardPressCallback(OSKEY_Z, () => {
            this.aiManager.performAIReinforcements();
        });
        InputManager.addKeyboardPressCallback(OSKEY_X, () => {
            this.aiManager.performBanditRelocation();
            this.aiManager.performAIRelocation();
        });
    }

    public startWar() {
        this.worldState = WorldState.WAR;
        this.allWars.push(new War());
        this.timeToWar = 120;
    }

    public endWar() {
        this.worldState = WorldState.NEUTRAL;
        while (this.allWars.length > 0) {
            let value = this.allWars.pop();
            value?.endWar();
        }
        this.guardSpawnCounter = 0;
        this.timeToWar = 120;
    }

    step(): void {
        for (let i = 0; i < this.allWars.length; i++) {
            let war = this.allWars[i];
            if (war.state == WarState.END) {
                QuickSplice(this.allWars, i);
                i -= 1;
                if (this.allWars.length == 0) {
                    this.endWar();
                }
            }
        }

        if (this.worldState == WorldState.NEUTRAL) {
            this.guardSpawnCounter += this._timerDelay;
            this.timeToWar -= this._timerDelay;


            if (this.guardSpawnCounter == 20) {
                this.aiManager.performAIReinforcements();
            }
            if (this.guardSpawnCounter == 50) {
                this.aiManager.performBanditRelocation();
                this.aiManager.performAIRelocation();
            }

            if (this.guardSpawnCounter % 10 == 0) {
                print(this.guardSpawnCounter);
            }

            if (this.timeToWar <= 0) {
                this.startWar();
            }
        }

        if (this.guardSpawnCounter > this.reset) {
            this.guardSpawnCounter -= this.reset;
        }
    }
}