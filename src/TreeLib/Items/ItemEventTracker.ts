import {Hooks} from "../Hooks";
import {Logger} from "../Logger";
import {StackerDto} from "./StackerDto";


export class ItemEventTracker {
    private static instance: ItemEventTracker;


    public static getInstance() {
        if (this.instance == null) {
            this.instance = new ItemEventTracker();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }


    private itemPickupTrigger: trigger = CreateTrigger();
    private itemStackTrigger: trigger = CreateTrigger();
    private itemDropTrigger: trigger = CreateTrigger();
    private itemSellTrigger: trigger = CreateTrigger();
    private itemBuyTrigger: trigger = CreateTrigger();

    public onPickupCallback: ((stackerDto: StackerDto) => void)[] = [];
    public onStackCallback: ((stackerDto: StackerDto) => void)[] = [];
    public onDropCallback: ((stackerDto: StackerDto) => void)[] = [];
    public onSellCallback: ((stackerDto: StackerDto) => void)[] = [];
    public onBuyCallback: ((stackerDto: StackerDto) => void)[] = [];

    constructor() {
        TriggerRegisterAnyUnitEventBJ(this.itemPickupTrigger, EVENT_PLAYER_UNIT_PICKUP_ITEM);
        TriggerAddAction(this.itemPickupTrigger, () => this.onItemPickup());
        TriggerRegisterAnyUnitEventBJ(this.itemStackTrigger, EVENT_PLAYER_UNIT_STACK_ITEM);
        TriggerAddAction(this.itemStackTrigger, () => this.onItemStack());
        TriggerRegisterAnyUnitEventBJ(this.itemDropTrigger, EVENT_PLAYER_UNIT_DROP_ITEM);
        TriggerAddAction(this.itemDropTrigger, () => this.onItemDrop());
        TriggerRegisterAnyUnitEventBJ(this.itemSellTrigger, EVENT_PLAYER_UNIT_PAWN_ITEM);
        TriggerAddAction(this.itemSellTrigger, () => this.onItemSell());
        TriggerRegisterAnyUnitEventBJ(this.itemBuyTrigger, EVENT_PLAYER_UNIT_SELL_ITEM);
        TriggerAddAction(this.itemBuyTrigger, () => this.onItemBuy());

    }

    public addPickupEvent(action: (stackerDto: StackerDto) => void) {
        this.onPickupCallback.push(action);
    }

    public addStackEvent(action: (stackerDto: StackerDto) => void) {
        this.onStackCallback.push(action);
    }

    public addDropEvent(action: (stackerDto: StackerDto) => void) {
        this.onDropCallback.push(action);
    }

    public addSellEvent(action: (stackerDto: StackerDto) => void) {
        this.onSellCallback.push(action);
    }

    public addBuyCallback(action: (stackerDto: StackerDto) => void) {
        this.onBuyCallback.push(action);
    }

    public addAllInventoryEvents(action: (stackerDto: StackerDto) => void) {
        this.addPickupEvent(action);
        this.addStackEvent(action);
        this.addDropEvent(action);
        this.addSellEvent(action);
        this.addBuyCallback(action);
    }

    private onItemPickup() {

        if (!BlzGetManipulatedItemWasAbsorbed()) {
            for (let callback of this.onPickupCallback) {
                xpcall(() => {
                    callback(new StackerDto(GetManipulatingUnit()));
                }, Logger.critical);
            }
        } else {
            for (let callback of this.onStackCallback) {
                xpcall(() => {
                    callback(new StackerDto(GetManipulatingUnit()));
                }, Logger.critical);
            }
        }
    }

    private onItemStack() {
        /*for (let callback of this.onStackCallback) {
            xpcall(() => {
                callback(new StackerDto(GetManipulatingUnit()));
            }, Logger.critical);
        }*/
    }

    private onItemDrop() {
        for (let callback of this.onDropCallback) {
            xpcall(() => {
                callback(new StackerDto(GetManipulatingUnit()));
            }, Logger.critical);
        }
    }

    private onItemSell() {
        for (let callback of this.onSellCallback) {
            xpcall(() => {
                callback(new StackerDto(GetManipulatingUnit()));
            }, Logger.critical);
        }
    }

    private onItemBuy() {
        for (let callback of this.onBuyCallback) {
            xpcall(() => {
                callback(new StackerDto(GetBuyingUnit()));
            }, Logger.critical);
        }
    }
}