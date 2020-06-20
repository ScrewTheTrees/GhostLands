import {Hooks} from "../../Hooks";
import {Logger} from "../../Logger";
import {StackerDto} from "./StackerDto";


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

    public onPickupCallback: ((stackerDto: StackerDto) => void)[] = [];
    public onStackCallback: ((stackerDto: StackerDto) => void)[] = [];
    public onDropCallback: ((stackerDto: StackerDto) => void)[] = [];

    constructor() {
        TriggerRegisterAnyUnitEventBJ(this.itemPickupTrigger, EVENT_PLAYER_UNIT_PICKUP_ITEM);
        TriggerAddAction(this.itemPickupTrigger, () => this.onItemPickup());
        TriggerRegisterAnyUnitEventBJ(this.itemStackTrigger, EVENT_PLAYER_UNIT_STACK_ITEM);
        TriggerAddAction(this.itemStackTrigger, () => this.onItemStack());
        TriggerRegisterAnyUnitEventBJ(this.itemDropTrigger, EVENT_PLAYER_UNIT_DROP_ITEM);
        TriggerAddAction(this.itemDropTrigger, () => this.onItemDrop());
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
}