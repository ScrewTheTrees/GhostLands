import {IsValidUnit} from "../../TreeLib/Misc";

export class Guard {
    private guard: unit;

    constructor(guard: unit) {
        this.guard = guard;
    }

    public isDead(): boolean {
        return IsUnitDeadBJ(this.guard);
    }

    public hasDespawned(): boolean {
        return !IsValidUnit(this.guard);
    }
}