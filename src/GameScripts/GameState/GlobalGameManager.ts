import {Hooks} from "../../TreeLib/Hooks";
import {Entity} from "../../TreeLib/Entity";
import {WorldState} from "../Enums/WorldState";
import {War, WarState} from "./War/War";
import {MapEvent} from "./Events/MapEvent";
import {AIManager} from "../AI/AIManager";
import {InputManager} from "../../TreeLib/InputManager/InputManager";
import {DummyCaster} from "../../TreeLib/DummyCasting/DummyCaster";
import {Quick} from "../../TreeLib/Quick";
import {Logger} from "../../TreeLib/Logger";

export class GlobalGameManager extends Entity {
    private static instance: GlobalGameManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GlobalGameManager();
            Hooks.set("GlobalGameManager", this.instance);
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
        this._timerDelay = 1;
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
        this.allWars.forEach((war) => {
            war.endWar();
        });
    }

    step(): void {
        this.updateWarList();

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

            if (Math.round(this.guardSpawnCounter % 10) == 0) {
                print(this.guardSpawnCounter);
            }

            if (this.timeToWar <= 0) {
                this.startWar();
            }
        } else if (this.worldState == WorldState.WAR) {
            if (this.allWars.length == 0) {
                this.worldState = WorldState.NEUTRAL;
                this.guardSpawnCounter = 0;
                this.timeToWar = 120;
            }
        } else if (this.worldState == WorldState.EVENT) {
            this.worldState = WorldState.EVENT; //NO
            Logger.critical("Yeah no no events");
        }

        if (this.guardSpawnCounter > this.reset) {
            this.guardSpawnCounter -= this.reset;
        }
    }

    private updateWarList() {
        for (let i = 0; i < this.allWars.length; i++) {
            let war = this.allWars[i];
            if (war.state == WarState.END) {
                Quick.Splice(this.allWars, i);
                i -= 1;
            }
        }
    }
}