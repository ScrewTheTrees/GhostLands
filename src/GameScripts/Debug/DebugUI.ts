import {Hooks} from "../../TreeLib/Hooks";
import {Entity} from "../../TreeLib/Entity";
import {GlobalGameManager} from "../GameState/GlobalGameManager";
import {War, WarState} from "../GameState/War/War";
import {RGB, RGBTextString} from "../../TreeLib/Utility/RGB";
import {CreepLoot} from "../WorldTendency/Loot/CreepLoot";
import {PlayerPowerTendency} from "../WorldTendency/Power/PlayerPowerTendency";
import {WorldState} from "../Enums/WorldState";
import {CreepLootQuality} from "../WorldTendency/Loot/CreepLootQuality";
import {TreeFrames} from "./TreeFrames";
import {TreeSimpleFrame} from "./TreeSimpleFrame";
import {FramePoints} from "./FramePoints";
import {TreeSimpleButton} from "./TreeSimpleButton";

export class DebugUI extends Entity {
    private static instance: DebugUI;


    public static getInstance() {
        if (this.instance == null) {
            this.instance = new DebugUI();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private fullExpandedFrame: framehandle;
    private sidebar: TreeSimpleFrame;
    private testButtonFrame: TreeSimpleButton;

    constructor() {
        super();
        this._timerDelay = 0.25;

        BlzLoadTOCFile("war3mapImported\\TreeFrames\\Toc.toc");


        let frameWorld = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0);
        this.fullExpandedFrame = BlzCreateSimpleFrame("FullSimpleScreen", frameWorld, 0);
        BlzFrameClearAllPoints(this.fullExpandedFrame);
        BlzFrameSetAbsPoint(this.fullExpandedFrame, FRAMEPOINT_BOTTOM, 0.4, 0);
        BlzFrameSetSize(this.fullExpandedFrame, this.getTotalFrameWidth(), 0.6);

        this.sidebar = TreeFrames.getInstance().createSimpleFrame()
            .setPointRelative(FramePoints.TopLeft, FramePoints.TopRight, -0.25, -0.03)
            .setPointRelative(FramePoints.BottomRight, FramePoints.BottomRight, 0, 0.2);

        this.testButtonFrame = TreeFrames.getInstance().createSimpleButton(this.sidebar.mainFrame)
            .setCallback(() => this.pressButton1())
            .setPointRelative(FRAMEPOINT_BOTTOMLEFT, FRAMEPOINT_BOTTOMLEFT, 0, 0)
            .setSize(0.06, 0.025);

    }

    step() {
        this.reRender();
    }

    public getTotalFrameWidth() {
        return 0.6 * (BlzGetLocalClientWidth() / BlzGetLocalClientHeight());
    }

    private reRender() {
        let gameManager = GlobalGameManager.getInstance();
        let loot = CreepLoot.getInstance();
        let playerPowerTendency = PlayerPowerTendency.getInstance();

        BlzFrameSetSize(this.fullExpandedFrame, this.getTotalFrameWidth(), 0.6);

        this.sidebar.setText(`--WORLD STATE
worldState: ${RGBTextString(RGB.red, gameManager.worldState)}
timeToWar: ${RGBTextString(RGB.red, gameManager.timeToWar)}
guardSpawnCounter: ${RGBTextString(RGB.red, gameManager.guardSpawnCounter)} < ${RGBTextString(RGB.green, gameManager.guardSpawnCounterDelay)}

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


        this.testButtonFrame.setText(this.getButton1Text());
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