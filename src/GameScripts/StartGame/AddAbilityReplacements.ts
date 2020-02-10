import {Hooks} from "../../TreeLib/Hooks";

export class AddAbilityReplacements {
    private static instance: AddAbilityReplacements;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new AddAbilityReplacements();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    register() {
        //OnSpellCast.makeBasicTargetReplacement(FourCC("A004"), FourCC("A003"), "ensnare");
    }
}