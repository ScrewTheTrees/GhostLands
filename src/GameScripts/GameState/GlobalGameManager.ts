import {Hooks} from "../../TreeLib/Hooks";
import {Entity} from "../../TreeLib/Entity";
import {WorldState} from "../Enums/WorldState";
import {War, WarState} from "./War/War";
import {MapEvent} from "./Events/MapEvent";
import {AIManager} from "../AI/AIManager";
import {InputManager} from "../../TreeLib/InputManager/InputManager";
import {Quick} from "../../TreeLib/Quick";
import {Logger} from "../../TreeLib/Logger";

export class GlobalGameManager extends Entity {
    private static instance: GlobalGameManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GlobalGameManager();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public worldState: WorldState = WorldState.NEUTRAL;
    public allWars: War[] = [];
    public currentEvents: MapEvent[] = [];
    public guardSpawnCounterDelay: number = 60;
    public guardSpawnCounter: number = 0;

    public timeToWarDelay: number = 120;
    public timeToWar: number = this.timeToWarDelay;

    private aiManager: AIManager = AIManager.getInstance();

    constructor() {
        super();
        this._timerDelay = 1;
        this.aiManager.banditNorthSpawner.stockUpAllGuardPointsInstant();
    }

    public startWar() {
        this.worldState = WorldState.WAR;
        this.allWars.push(new War());
        this.timeToWar = 300;
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

            if (this.guardSpawnCounter == 10) {
                this.aiManager.performAIReinforcements();
            }
            if (this.guardSpawnCounter == 40) {
                this.aiManager.performBanditRelocation();
                this.aiManager.performAIRelocation();
            }

            if (this.timeToWar <= 0) {
                this.startWar();
            }
        } else if (this.worldState == WorldState.WAR) {
            if (this.allWars.length == 0) {
                this.worldState = WorldState.NEUTRAL;
                this.guardSpawnCounter = 0;
                this.timeToWar = this.timeToWarDelay;
            }
        } else if (this.worldState == WorldState.EVENT) {
            this.worldState = WorldState.EVENT; //NO
            Logger.critical("Yeah no no events");
        }

        if (this.guardSpawnCounter > this.guardSpawnCounterDelay) {
            this.guardSpawnCounter -= this.guardSpawnCounterDelay;
        }
    }

    private updateWarList() {
        for (let i = 0; i < this.allWars.length; i++) {
            let war = this.allWars[i];
            if (war.state == WarState.END) {
                Quick.Slice(this.allWars, i);
                i -= 1;
            }
        }
    }
}