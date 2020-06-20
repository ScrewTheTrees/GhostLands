import {Hooks} from "../../Hooks";


export class Stacker {
    private static instance: Stacker;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Stacker();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    private itemPickupTrigger: trigger = CreateTrigger();
    private itemStackTrigger: trigger = CreateTrigger();
    private itemDropTrigger: trigger = CreateTrigger();

    constructor() {
        TriggerRegisterAnyUnitEventBJ(this.itemPickupTrigger, EVENT_PLAYER_UNIT_PICKUP_ITEM);
        TriggerAddAction(this.itemPickupTrigger, () => this.onItemPickup());
        TriggerRegisterAnyUnitEventBJ(this.itemStackTrigger, EVENT_PLAYER_UNIT_STACK_ITEM);
        TriggerAddAction(this.itemStackTrigger, () => this.onItemStack());
        TriggerRegisterAnyUnitEventBJ(this.itemDropTrigger, EVENT_PLAYER_UNIT_DROP_ITEM);
        TriggerAddAction(this.itemDropTrigger, () => this.onItemDrop());
    }

    private onItemPickup() {
        if (!BlzGetManipulatedItemWasAbsorbed()) {
            print("ON ITEM PICUP");
            print("GetManipulatedItemCharges ", GetItemCharges(GetManipulatedItem()));
        }
    }

    private onItemStack() {
        print("ON ITEM STACK");
        print("GetSourceItemCharges ", GetItemCharges(BlzGetStackingItemSource()));
        print("GetStackingItemCharges ", GetItemCharges(BlzGetStackingItemTarget()));
        print("BlzGetStackingItemTargetPreviousCharges ", BlzGetStackingItemTargetPreviousCharges());
    }

    private onItemDrop() {
        print("ON ITEM DROP");
        print("GetManipulatedItemCharges ", GetItemCharges(GetManipulatedItem()));
    }
}