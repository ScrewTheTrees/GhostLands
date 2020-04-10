import {Hooks} from "../TreeLib/Hooks";
import {Entity} from "../TreeLib/Entity";
import {GlobalGameManager} from "./GameState/GlobalGameManager";
import {War, WarState} from "./GameState/War/War";
import {RGB, RGBTextString} from "../TreeLib/Utility/RGB";
import {CreepLoot} from "./WorldTendency/Loot/CreepLoot";
import {PlayerPowerTendency} from "./WorldTendency/Power/PlayerPowerTendency";
import {WorldState} from "./Enums/WorldState";
import {CreepLootQuality} from "./WorldTendency/Loot/CreepLootQuality";

export class DebugUI extends Entity {
    private static instance: DebugUI;


    public static getInstance() {
        if (this.instance == null) {
            this.instance = new DebugUI();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private sideBarWarText: framehandle;
    private sidebar: framehandle;
    private testButtonFrame: framehandle;
    private testButtonFrame2: framehandle;
    private testButtonFrame3: framehandle;


    private button1Trig = CreateTrigger();

    constructor() {
        super();
        this._timerDelay = 0.25;

        BlzLoadTOCFile("war3mapImported\\Toc.toc");


        let frameWorld = BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0);
        this.sidebar = BlzCreateFrame("GenericBackdrop", frameWorld, 1, 0);
        this.sideBarWarText = BlzCreateFrame("CText_8", this.sidebar, 1, 0);


        this.testButtonFrame = BlzCreateFrame("TestFrame", this.sidebar, 1, 0);
        this.testButtonFrame2 = BlzCreateFrame("TestFrame", this.sidebar, 1, 0);
        this.testButtonFrame3 = BlzCreateFrame("TestFrame", this.sidebar, 1, 0);


        BlzFrameSetSize(this.sidebar, 0.20, 1);
        BlzFrameSetPoint(this.sidebar, FRAMEPOINT_TOPRIGHT, frameWorld, FRAMEPOINT_TOPRIGHT, 0, -0.03);
        BlzFrameSetPoint(this.sidebar, FRAMEPOINT_BOTTOMRIGHT, frameWorld, FRAMEPOINT_BOTTOMRIGHT, 0, 0.2);
        BlzFrameSetAlpha(this.sidebar, 100);

        BlzFrameSetSize(this.sideBarWarText, 0.80, 0.80);
        BlzFrameSetPoint(this.sideBarWarText, FRAMEPOINT_TOPLEFT, this.sidebar, FRAMEPOINT_TOPLEFT, 0.008, -0.008);
        BlzFrameSetPoint(this.sideBarWarText, FRAMEPOINT_BOTTOMRIGHT, this.sidebar, FRAMEPOINT_BOTTOMRIGHT, 0.008, -0.008);
        BlzFrameSetAlpha(this.sideBarWarText, 255);

        BlzFrameSetSize(this.testButtonFrame, 0.06, 0.025);
        BlzFrameSetPoint(this.testButtonFrame, FRAMEPOINT_BOTTOMLEFT, this.sidebar, FRAMEPOINT_BOTTOMLEFT, 0, 0);
        BlzFrameSetAlpha(this.testButtonFrame, 255);
        BlzTriggerRegisterFrameEvent(this.button1Trig, this.testButtonFrame, FRAMEEVENT_CONTROL_CLICK);
        TriggerAddAction(this.button1Trig, () => this.pressButton1());

        BlzFrameSetSize(this.testButtonFrame2, 0.06, 0.025);
        BlzFrameSetPoint(this.testButtonFrame2, FRAMEPOINT_BOTTOMLEFT, this.sidebar, FRAMEPOINT_BOTTOMLEFT, 0.06, 0);
        BlzFrameSetAlpha(this.testButtonFrame2, 255);

        BlzFrameSetSize(this.testButtonFrame3, 0.06, 0.025);
        BlzFrameSetPoint(this.testButtonFrame3, FRAMEPOINT_BOTTOMLEFT, this.sidebar, FRAMEPOINT_BOTTOMLEFT, 0.12, 0);
        BlzFrameSetAlpha(this.testButtonFrame3, 255);

    }

    step() {
        this.reRender();
    }

    private reRender() {
        let gameManager = GlobalGameManager.getInstance();
        let loot = CreepLoot.getInstance();
        let playerPowerTendency = PlayerPowerTendency.getInstance();

        BlzFrameSetText(this.sideBarWarText, `--WORLD STATE
worldState: ${RGBTextString(RGB.red, gameManager.worldState)}
timeToWar: ${RGBTextString(RGB.red, gameManager.timeToWar)}
guardSpawnCounter: ${RGBTextString(RGB.red, gameManager.guardSpawnCounter)} < ${RGBTextString(RGB.green, gameManager.reset)}

--WAR
allWarsTotal: ${RGBTextString(RGB.red, gameManager.allWars.length)}
${this.extractAllWarData(gameManager.allWars)}
currentEventsTotal: ${RGBTextString(RGB.red, gameManager.currentEvents.length)}

--Tendency
localLootTendency[STANDARD]: ${RGBTextString(RGB.red, loot.getPlayerLootTendency(GetLocalPlayer(), CreepLootQuality.STANDARD))}
localLootTendency[STANDARDS_SLOW]: ${RGBTextString(RGB.red, loot.getPlayerLootTendency(GetLocalPlayer(), CreepLootQuality.STANDARDS_SLOW))}
localLootTendency[RARE]: ${RGBTextString(RGB.red, loot.getPlayerLootTendency(GetLocalPlayer(), CreepLootQuality.RARE))}
localLootTendency[EPIC]: ${RGBTextString(RGB.red, loot.getPlayerLootTendency(GetLocalPlayer(), CreepLootQuality.EPIC))}
globalPower: ${RGBTextString(RGB.red, playerPowerTendency.globalPower)}
localPowerLevel: ${RGBTextString(RGB.red, playerPowerTendency.getPlayerPowerLevel(GetLocalPlayer()))}
localXPTendency: ${RGBTextString(RGB.red, playerPowerTendency.getPlayerXPTendency(GetLocalPlayer()))} / ${RGBTextString(RGB.green, playerPowerTendency.getPlayerActualXPTendency(GetLocalPlayer()))}
`);

        BlzFrameSetText(this.testButtonFrame, this.getButton1Text());
        BlzFrameSetText(this.testButtonFrame2, "Dong");
        BlzFrameSetText(this.testButtonFrame3, "Kid");
    }

    extractAllWarData(wars: War[]) {
        let build = "";
        for (let i = 0; i < wars.length; i++) {
            let war = wars[i];
            build += this.extractWarData(war, i) + "\n";
        }
        return build;
    }

    extractWarData(war: War, index: number) {
        let selectedBattlefield = "none";
        if (war.targets.selectedBattlefield) {
            selectedBattlefield = war.targets.selectedBattlefield.center.name;
        }

        return `-> War ${index}
state: ${RGBTextString(RGB.red, war.state)}
countdown: ${RGBTextString(RGB.red, war.countdown)}
siegeTimer: ${RGBTextString(RGB.red, war.siegeTimer)}
force1 target name: ${RGBTextString(RGB.teal, war.targets.targets.force1.center.name)}
force2 target name: ${RGBTextString(RGB.teal, war.targets.targets.force2.center.name)}
selectedBattlefield: ${RGBTextString(RGB.teal, selectedBattlefield)}`;
    }

    getButton1Text() {
        let gameManager = GlobalGameManager.getInstance();
        if (gameManager.worldState == WorldState.NEUTRAL) {
            return "Start war"
        } else if (gameManager.allWars.length > 0 && (gameManager.allWars[0].state == WarState.PREPARE_CLASH || gameManager.allWars[0].state == WarState.PREPARE_FOR_SIEGE)) {
            return "Advance Stage";
        }

        return "What?";
    }

    pressButton1() {
        let gameManager = GlobalGameManager.getInstance();
        if (gameManager.worldState == WorldState.NEUTRAL) {
            gameManager.startWar();
        } else if (gameManager.allWars.length > 0 && (gameManager.allWars[0].state == WarState.PREPARE_CLASH || gameManager.allWars[0].state == WarState.PREPARE_FOR_SIEGE)) {
            gameManager.allWars.forEach((war) => war.countdown = 1);
        }


        this.reRender();
    }
}