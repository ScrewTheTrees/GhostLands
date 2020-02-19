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
        let greatRune = [FourCC("A00A"), FourCC("A007")];
        let largeRunes = [FourCC("A00J")];

        OnSpellCast.getInstance().addSpell(new OnCastContainer(greatRune,
            OnSpellCastCreator.onGrandSpell,
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(largeRunes,
            OnSpellCastCreator.onLargeSpell
        ));

    }

    private static onGrandSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let rune = "Doodads\\Cityscape\\Props\\MagicRunes\\MagicRunes" + ChooseOne("0.mdl", "1.mdl", "2.mdl");
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = OnSpellCastCreator.createFadingEffect(rune, p, rgb, 2);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 180, rgb, new RGB(32, 32, 32)))
    }

    private static onLargeSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let rune = "Doodads\\Cityscape\\Props\\MagicRunes\\MagicRunes" + ChooseOne("0.mdl", "1.mdl", "2.mdl");
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = OnSpellCastCreator.createFadingEffect(rune, p, rgb, 1.5);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 60, rgb, new RGB(32, 32, 32)))
    }


    private static createFadingEffect(modelName: string, p: Point, color: RGB, scale: number) {
        let eff = AddSpecialEffect(modelName, p.x, p.y);

        BlzSetSpecialEffectScale(eff, scale);
        BlzSetSpecialEffectColor(eff, color.red, color.green, color.blue);
        BlzSetSpecialEffectYaw(eff, GetRandomReal(0, 360));
        BlzSetSpecialEffectZ(eff, GetLocationZ(p.toLocationClean()) - (50 * scale));

        return eff;
    }
}


