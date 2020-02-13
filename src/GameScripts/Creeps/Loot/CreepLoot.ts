import {Hooks} from "../../../TreeLib/Hooks";
import {Players} from "../../../TreeLib/Structs/Players";
import {Point} from "../../../TreeLib/Utility/Point";
import {CreepLootTable} from "./CreepLootTable";
import {Logger} from "../../../TreeLib/Logger";


export class CreepLoot {
    private static instance: CreepLoot;
    public onCreepDie: trigger = CreateTrigger();
    public chances: number[] = [];

    constructor() {
        TriggerRegisterPlayerUnitEvent(this.onCreepDie, Players.NEUTRAL_HOSTILE, EVENT_PLAYER_UNIT_DEATH, null);
        TriggerAddAction(this.onCreepDie, () => this.onCreepDeath());

        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            this.chances[i] = 50;
        }
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepLoot();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    public onCreepDeath() {
        const dying = GetDyingUnit();
        const level = GetUnitLevel(dying);
        const position = Point.fromWidget(dying);

        const p = GetPlayerId(GetOwningPlayer(GetKillingUnit()));
        const chance = GetRandomReal(0, 100);
        const modChance = this.chances[p];

        Logger.generic("With a chance of ", chance, " < ", modChance);
        if (chance < modChance) {
            Logger.generic(">   passed the threshold");
            CreateItem(CreepLootTable.getTableByLevel(level).getRandomAsId(), position.x, position.y);
            this.chances[p] -= 30;
        } else {
            this.chances[p] += 10;
        }
    }
}

