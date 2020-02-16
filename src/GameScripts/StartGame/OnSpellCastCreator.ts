import {Hooks} from "../../TreeLib/Hooks";
import {OnSpellCast} from "../../TreeLib/DummyCasting/OnSpellCast";
import {OnCastContainer} from "../../TreeLib/DummyCasting/OnCastContainer";
import {Point} from "../../TreeLib/Utility/Point";
import {PlayerManager} from "../PlayerManager";
import {RGB} from "../../TreeLib/Utility/RGB";
import {GetColorByForce} from "../Enums/Forces";
import {ChooseOne} from "../../TreeLib/Misc";
import {TemporaryEffects} from "../../TreeLib/Effects/TemporaryEffects";
import {ColorFadeEffect} from "../../TreeLib/Effects/StepEffects/ColorFadeEffect";
import {SpellData} from "../../TreeLib/DummyCasting/SpellData";

export class OnSpellCastCreator {
    private static instance: OnSpellCastCreator;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new OnSpellCastCreator();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        let grandSpells = [FourCC("A00A"), FourCC("A007")];
        let largeSpells = [FourCC("A004")];

        OnSpellCast.getInstance().addSpell(new OnCastContainer(grandSpells,
            (cont) => this.onGrandSpell(cont),
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(largeSpells,
            (cont) => this.onLargeSpell(cont)
        ));

    }

    private onGrandSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let eff = AddSpecialEffect("Doodads\\Cityscape\\Props\\MagicRunes\\MagicRunes" + ChooseOne("0.mdl", "1.mdl", "2.mdl"), p.x, p.y);
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);

        BlzSetSpecialEffectColor(eff, rgb.red, rgb.green, rgb.blue);
        BlzSetSpecialEffectYaw(eff, GetRandomReal(0, 360));
        BlzSetSpecialEffectZ(eff, GetLocationZ(p.toLocationClean()) - 50);
        BlzSetSpecialEffectScale(eff, 2);
        BlzSetSpecialEffectTimeScale(eff, 0.25);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 120, rgb, new RGB(32, 32, 32)))
    }

    private onLargeSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let eff = AddSpecialEffect("Doodads\\Cityscape\\Props\\MagicRunes\\MagicRunes" + ChooseOne("0.mdl", "1.mdl", "2.mdl"), p.x, p.y);
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);

        BlzSetSpecialEffectColor(eff, rgb.red, rgb.green, rgb.blue);
        BlzSetSpecialEffectYaw(eff, GetRandomReal(0, 360));
        BlzSetSpecialEffectZ(eff, GetLocationZ(p.toLocationClean()) - 50);
        BlzSetSpecialEffectScale(eff, 1.5);
        BlzSetSpecialEffectTimeScale(eff, 0.25);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 120, rgb, new RGB(32, 32, 32)))
    }
}


