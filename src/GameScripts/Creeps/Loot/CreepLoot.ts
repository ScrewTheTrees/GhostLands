import {Hooks} from "../../../TreeLib/Hooks";
import {Players} from "../../../TreeLib/Structs/Players";
import {Point} from "../../../TreeLib/Utility/Point";
import {CreepLootTable} from "./CreepLootTable";


export class CreepLoot {
    private static instance: CreepLoot;
    public onCreepDie: trigger = CreateTrigger();

    constructor() {
        TriggerRegisterPlayerUnitEvent(this.onCreepDie, Players.NEUTRAL_HOSTILE, EVENT_PLAYER_UNIT_DEATH, null);
        TriggerAddAction(this.onCreepDie, () => this.onCreepDeath())
    }

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new CreepLoot();
            Hooks.set("CreepLoot", this.instance);
        }
        return this.instance;
    }

    public onCreepDeath() {
        let dying = GetDyingUnit();
        let level = GetUnitLevel(dying);
        let position = Point.fromWidget(dying);

        let chance = GetRandomInt(0, 100);

        if (chance > 80) {
            CreateItem(CreepLootTable.getTableByLevel(level).getRandomAsId(), position.x, position.y);
        }
    }
}

