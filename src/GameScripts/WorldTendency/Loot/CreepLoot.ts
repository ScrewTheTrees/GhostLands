import {Hooks} from "../../../TreeLib/Hooks";
import {Players} from "../../../TreeLib/Structs/Players";
import {Point} from "../../../TreeLib/Utility/Point";
import {CreepLootTable} from "./CreepLootTable";
import {CreepLootQuality} from "./CreepLootQuality";

class CreepLootContainer {
    private loots: Map<CreepLootQuality, number> = new Map<CreepLootQuality, number>();

    constructor() {
        this.loots.set(CreepLootQuality.STANDARD, 50);
        this.loots.set(CreepLootQuality.STANDARDS_SLOW, 0);
        this.loots.set(CreepLootQuality.RARE, 0);
        this.loots.set(CreepLootQuality.EPIC, -50);
    }

    getByQuality(quality: CreepLootQuality): number {
        return this.loots.get(quality) || 0;
    }

    addToQuality(amount: number, quality: CreepLootQuality) {
        this.loots.set(quality, this.getByQuality(quality) + amount);
    }
}

export class CreepLoot {
    private static instance: CreepLoot;
    public onCreepDie: trigger = CreateTrigger();
    public chances: CreepLootContainer[] = [];

    constructor() {
        TriggerRegisterPlayerUnitEvent(this.onCreepDie, Players.NEUTRAL_HOSTILE, EVENT_PLAYER_UNIT_DEATH, null);
        TriggerAddAction(this.onCreepDie, () => this.onCreepDeath());

        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            this.chances[i] = new CreepLootContainer();
        }
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepLoot();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public getIndexLootTendency(p: number, quality: CreepLootQuality) {
        return this.chances[p].getByQuality(quality);
    }

    public getPlayerLootTendency(p: player, quality: CreepLootQuality) {
        return this.getIndexLootTendency(GetPlayerId(p), quality);
    }


    public onCreepDeath() {
        const dying = GetDyingUnit();
        const level = GetUnitLevel(dying);
        const position = Point.fromWidget(dying);

        const p = GetPlayerId(GetOwningPlayer(GetKillingUnit()));

        this.performItemDropLogic(CreepLootQuality.STANDARD, position, p, -40, 10);
        this.performItemDropLogic(CreepLootQuality.STANDARDS_SLOW, position, p, -50, 5);
        this.performItemDropLogic(CreepLootQuality.RARE, position, p, -100, 5);
        this.performItemDropLogic(CreepLootQuality.EPIC, position, p, -100, 1);
    }

    performItemDropLogic(quality: CreepLootQuality, position: Point, p: number, decrement: number, increment: number) {
        let diceChance = GetRandomReal(0, 100);
        let currentChanceThreshold = this.getIndexLootTendency(p, quality);

        if (diceChance < currentChanceThreshold) {
            CreateItem(CreepLootTable.getTableByQuality(quality).getRandomAsId(), position.x, position.y);
            this.chances[p].addToQuality(decrement, quality);
        } else {
            this.chances[p].addToQuality(increment, quality);
        }
    }
}

