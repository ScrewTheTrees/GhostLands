import {Hooks} from "../../../TreeLib/Hooks";
import {ItemEventTracker} from "../../../TreeLib/Items/ItemEventTracker";
import {GetAllItemsOfTypeOnUnit, GetTotalItemStacks} from "../../../TreeLib/Utility/ItemFuncs";
import {GameItems} from "../../Enums/GameItems";
import {GetOrAddAbility} from "../../../TreeLib/Utility/UnitFuncs";
import {GameAbilities} from "../../Enums/GameAbilities";
import {Logger} from "../../../TreeLib/Logger";
import {Delay} from "../../../TreeLib/Utility/Delay";
import {StackerDto} from "../../../TreeLib/Items/StackerDto";

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
                    GetOrAddAbility(manipulated, FourCC(GameAbilities.ITEM_ARMOR_SHARD_ARMOR_BONUS));

                    if (stacks == 0) UnitRemoveAbility(manipulated, FourCC(GameAbilities.ITEM_ARMOR_SHARD_ARMOR_BONUS));
                    else SetUnitAbilityLevel(manipulated, FourCC(GameAbilities.ITEM_ARMOR_SHARD_ARMOR_BONUS), stacks);

                }, 0.01)
            };
            let weaponStack = (eventData: StackerDto) => {
                let manipulated = eventData.itemOwner;
                Delay.addDelay(() => {
                    let shards = GetAllItemsOfTypeOnUnit(manipulated, FourCC(GameItems.WEAPON_PARTS));
                    let stacks = GetTotalItemStacks(shards);
                    GetOrAddAbility(manipulated, FourCC(GameAbilities.ITEM_WEAPON_PARTS_BONUS));

                    if (stacks == 0) UnitRemoveAbility(manipulated, FourCC(GameAbilities.ITEM_WEAPON_PARTS_BONUS));
                    else SetUnitAbilityLevel(manipulated, FourCC(GameAbilities.ITEM_WEAPON_PARTS_BONUS), stacks);

                }, 0.01)
            };

            ItemEventTracker.getInstance().addAllInventoryEvents(armorStack);
            ItemEventTracker.getInstance().addAllInventoryEvents(weaponStack);

        }, Logger.critical);
    }


}