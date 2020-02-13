import {Hooks} from "../../TreeLib/Hooks";
import {OnSpellCast} from "../../TreeLib/DummyCasting/OnSpellCast";
import {OnCastContainer} from "../../TreeLib/DummyCasting/OnCastContainer";
import {Point} from "../../TreeLib/Utility/Point";
import {PlayerManager} from "../PlayerManager";
import {RGB} from "../../TreeLib/Utility/RGB";
import {Forces} from "../Enums/Forces";
import {ChooseOne} from "../../TreeLib/Misc";
import {TemporaryEffects} from "../../TreeLib/Effects/TemporaryEffects";
import {ColorFadeEffect} from "../../TreeLib/Effects/StepEffects/ColorFadeEffect";

export class OnSpellCastCreator {
    private static instance: OnSpellCastCreator;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new OnSpellCastCreator();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    register() {
        OnSpellCast.getInstance().addSpell(new OnCastContainer([FourCC("A00A")], (cont) => {
            let p = Point.fromWidget(cont.castingUnit);
            let eff = AddSpecialEffect("Doodads\\Cityscape\\Props\\MagicRunes\\MagicRunes" + ChooseOne("0.mdl", "1.mdl", "2.mdl"), p.x, p.y);
            let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));

            let rgb = new RGB(0, 255, 0);

            if (forcesByPlayer == Forces.FORCE_1) {
                rgb = new RGB(255, 0, 0);

            } else if (forcesByPlayer == Forces.FORCE_2) {
                rgb = new RGB(0, 0, 255);
            }

            BlzSetSpecialEffectColor(eff, rgb.red, rgb.green, rgb.blue);
            BlzSetSpecialEffectYaw(eff, GetRandomReal(0, 360));
            BlzSetSpecialEffectZ(eff, GetLocationZ(p.toLocationClean()) - 50);
            BlzSetSpecialEffectTimeScale(eff, 0.25);
            BlzSetSpecialEffectScale(eff, 2);

            TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 120, rgb, new RGB(32, 32, 32)))

        }, (cont) => IsHeroUnitId(GetUnitTypeId(cont.castingUnit))));

    }
}


