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
import {Occupations} from "../GameState/Occupations/Occupations";
import {Warzones} from "../GameState/War/Warzones";
import {AsyncEvent} from "../GameState/Events/AsyncEvent";

export class DebugUI extends Entity {
    private static instance: DebugUI;


    public static getInstance() {
        if (this.instance == null) {
            this.instance = new DebugUI();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    private sidebar: TreeSimpleFrame;
    private testButtonFrame: TreeSimpleButton;

    constructor() {
        super();
        this._timerDelay = 0.25;

        this.sidebar = TreeFrames.getInstance().createSimpleFrame()
            .setPointRelative(FramePoints.TopLeft, FramePoints.TopRight, -0.25, -0.03)
            .setPointRelative(FramePoints.BottomRight, FramePoints.BottomRight, 0, 0.2);

        this.testButtonFrame = TreeFrames.getInstance().createSimpleButton(this.sidebar.mainFrame)
            .setCallback(() => this.pressButton1())
            .setPointRelative(FRAMEPOINT_BOTTOMLEFT, FRAMEPOINT_BOTTOMLEFT, 0, 0)
            .setSize(0.06, 0.025);

        for (let occu of Occupations.getInstance().getAllOccupants()) {
            let tag = CreateTextTag();
            SetTextTagPos(tag, occu.primaryRect.getCenter().x, occu.primaryRect.getCenter().y, 16);
            SetTextTagText(tag, occu.primaryRect.name, 0.024);
            SetTextTagVisibility(tag, true);
        }

        for (let zone of Warzones.getInstance().allWarzones) {
            let tag = CreateTextTag();
            SetTextTagPos(tag, zone.center.getCenter().x, zone.center.getCenter().y, 16);
            SetTextTagText(tag, zone.center.name, 0.024);
            SetTextTagVisibility(tag, true);
            tag = CreateTextTag();
            SetTextTagPos(tag, zone.force1gather.getCenter().x, zone.force1gather.getCenter().y, 16);
            SetTextTagText(tag, zone.force1gather.name, 0.024);
            SetTextTagVisibility(tag, true);
            tag = CreateTextTag();
            SetTextTagPos(tag, zone.force2gather.getCenter().x, zone.force2gather.getCenter().y, 16);
            SetTextTagText(tag, zone.force2gather.name, 0.024);
            SetTextTagVisibility(tag, true);
        }

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

        let text = `--WORLD STATE\n`;
        text += `worldState: ${RGBTextString(RGB.red, gameManager.worldState)}\n`;
        text += `timeToWar: ${RGBTextString(RGB.red, gameManager.timeToWar)}\n`;
        text += `guardSpawnCounter: ${RGBTextString(RGB.red, gameManager.guardSpawnCounter)} < ${RGBTextString(RGB.green, gameManager.guardSpawnCounterDelay)}\n`;
        text += `\n`;
        text += `--WAR\n`;
        text += `allWarsTotal: ${RGBTextString(RGB.red, gameManager.allWars.length)}\n`
        text += `${this.extractAllWarData(gameManager.allWars)}\n`;
        text += `\n`;
        text += `--Events\n`;
        text += `current World Event: ${RGBTextString(RGB.red, gameManager.currentMapEvent)}\n`;
        text += `currentAsyncEvents: ${RGBTextString(RGB.red, gameManager.asyncEvents.length)}\n`;
        text += `${this.extractAllEventData(gameManager.asyncEvents)}\n`;
        text += `\n`;
        text += `--Tendency\n`;
        text += `localLootTendency[STANDARD]: ${RGBTextString(RGB.red, loot.getPlayerLootTendency(GetLocalPlayer(), CreepLootQuality.STANDARD))}\n`;
        text += `localLootTendency[STANDARDS_SLOW]: ${RGBTextString(RGB.red, loot.getPlayerLootTendency(GetLocalPlayer(), CreepLootQuality.STANDARDS_SLOW))}\n`;
        text += `localLootTendency[RARE]: ${RGBTextString(RGB.red, loot.getPlayerLootTendency(GetLocalPlayer(), CreepLootQuality.RARE))}\n`;
        text += `localLootTendency[EPIC]: ${RGBTextString(RGB.red, loot.getPlayerLootTendency(GetLocalPlayer(), CreepLootQuality.EPIC))}\n`;
        text += `globalPower: ${RGBTextString(RGB.red, playerPowerTendency.globalPower)}\n`;
        text += `localPowerLevel: ${RGBTextString(RGB.red, playerPowerTendency.getPlayerPowerLevel(GetLocalPlayer()))}\n`;
        text += `localXPTendency: ${RGBTextString(RGB.red, playerPowerTendency.getPlayerXPTendency(GetLocalPlayer()))} / `;
        text += `${RGBTextString(RGB.green, playerPowerTendency.getPlayerActualXPTendency(GetLocalPlayer()))}\n`;


        this.sidebar.setText(text)
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

        let str = `-> War ${index}
state: ${RGBTextString(RGB.red, war.state)}
countdown: ${RGBTextString(RGB.red, war.countdown)}
siegeTimer: ${RGBTextString(RGB.red, war.siegeTimer)}
force1 target name: ${RGBTextString(RGB.teal, war.targets.targets.force1.force1gather.name)}
force2 target name: ${RGBTextString(RGB.teal, war.targets.targets.force2.force2gather.name)}
selectedBattlefield: ${RGBTextString(RGB.teal, selectedBattlefield)}
force1 units: ${war.targets.armies.force1?.getUnitsAlive()}
force2 units: ${war.targets.armies.force2?.getUnitsAlive()}
`;

        if (war.targets.selectedBattlefield)
            str += `force1 gather: : ${RGBTextString(RGB.teal, war.targets.selectedBattlefield.force1gather.name)}
force2 gather: : ${RGBTextString(RGB.teal, war.targets.selectedBattlefield.force2gather.name)}
            `;

        return str;
    }

    extractAllEventData(events: AsyncEvent[]) {
        let build = "";
        for (let i = 0; i < events.length; i++) {
            let war = events[i];
            build += this.extractEventData(war, i) + "\n";
        }
        return build;
    }


    private extractEventData(event: AsyncEvent, index: number) {
        let str = `-> Event ${index}
state: ${RGBTextString(RGB.red, event.name)}
`;

        return str;
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