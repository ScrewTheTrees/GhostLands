import {StepEffect} from "./StepEffect";

export class SimpleEffect extends StepEffect {
    public gfx: effect;

    constructor(eff: effect, time: number) {
        super(time);
        this.gfx = eff;
    }

    public step() {

    }

    public destroy() {
        DestroyEffect(this.gfx);
    }
}