import {Hooks} from "../TreeLib/Hooks";
import {PlayerUnitManager} from "./StartGame/PlayerUnitManager";
import {StackingItems} from "./WorldTendency/Loot/StackingItems";
import {Runes} from "./StartGame/Runes";
import { HeroPicker } from "./StartGame/HeroPicker";
import {DamageDetectionSystem} from "../TreeLib/DDS/DamageDetectionSystem";


export class GameConfigContainer {
    private static instance: GameConfigContainer;
    public playerUnitManager?: PlayerUnitManager;
    public stackingItems?: StackingItems;
    public runes?: Runes;
    public heroPicker?: HeroPicker;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GameConfigContainer();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public start() {
        this.playerUnitManager = PlayerUnitManager.getInstance();
        this.stackingItems = StackingItems.getInstance()
        this.runes = Runes.getInstance();
        this.heroPicker = HeroPicker.getInstance();

        DamageDetectionSystem.registerBeforeDamageCalculation((hit) => {
            if (BlzGetEventIsAttack()) {
                hit.eventDamage = math.max(1, hit.eventDamage - BlzGetUnitArmor(hit.targetUnit));
            }
        });
    }
}