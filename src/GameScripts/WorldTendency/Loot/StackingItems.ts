import {Hooks} from "../../../TreeLib/Hooks";
import {ItemEventTracker} from "../../../TreeLib/Items/ItemEventTracker";
import {GetAllItemsOfTypeOnUnit, GetTotalItemStacks} from "../../../TreeLib/Utility/ItemFuncs";
import {GameItems} from "../../Enums/GameItems";
import {GetOrAddAbility} from "../../../TreeLib/Utility/UnitFuncs";
import {GameAbilities} from "../../Enums/GameAbilities";
import {Logger} from "../../../TreeLib/Logger";
import {Delay} from "../../../TreeLib/Utility/Delay";
import {StackerDto} from "../../../TreeLib/Items/StackerDto";
import {WeaponIndex} from "../../../TreeLib/Structs/WeaponIndex";

export class StackingItems {
    private static instance: StackingItems;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new StackingItems();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        xpcall(() => {

            let armorStack = (eventData: StackerDto) => {
                let manipulated = eventData.itemOwner;
                Delay.addDelay(() => {
                    let shards = GetAllItemsOfTypeOnUnit(manipulated, FourCC(GameItems.ARMOR_SHARDS));
                    let stacks = GetTotalItemStacks(shards);
                    let ability = GetOrAddAbility(manipulated, FourCC(GameAbilities.ITEM_ARMOR_SHARD_ARMOR_BONUS))
                    let oldStacks = BlzGetAbilityRealLevelField(ability, ABILITY_RLF_DEFENSE_BONUS_UTS3, 0);
                    let diffStacks = stacks - oldStacks;

                    BlzSetUnitArmor(manipulated, BlzGetUnitArmor(manipulated) + diffStacks);
                    BlzSetAbilityRealLevelField(ability, ABILITY_RLF_DEFENSE_BONUS_UTS3, 0, stacks);

                }, 0.01)
            };
            ItemEventTracker.getInstance().addAllInventoryEvents(armorStack);

            let damageStack = (eventData: StackerDto) => {
                let manipulated = eventData.itemOwner;
                Delay.addDelay(() => {
                    let shards = GetAllItemsOfTypeOnUnit(manipulated, FourCC(GameItems.WEAPON_PARTS));
                    let stacks = GetTotalItemStacks(shards);
                    let ability = GetOrAddAbility(manipulated, FourCC(GameAbilities.ITEM_WEAPON_PART_DAMAGE_BONUS))
                    let oldStacks = BlzGetAbilityRealLevelField(ability, ABILITY_RLF_DEFENSE_BONUS_UTS3, 0);
                    let diffStacks = stacks - oldStacks;

                    BlzSetUnitBaseDamage(manipulated, BlzGetUnitBaseDamage(manipulated, WeaponIndex.WEAPON_1) + diffStacks, WeaponIndex.WEAPON_1);
                    BlzSetAbilityRealLevelField(ability, ABILITY_RLF_DEFENSE_BONUS_UTS3, 0, stacks);

                }, 0.01)
            };
            ItemEventTracker.getInstance().addAllInventoryEvents(damageStack);

        }, Logger.critical);
    }


}