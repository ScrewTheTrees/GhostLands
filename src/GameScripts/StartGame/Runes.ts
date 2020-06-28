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
import {GameAbilities} from "../Enums/GameAbilities";

export class Runes {
    private static instance: Runes;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Runes();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        let greatRune = [
            FourCC(GameAbilities.HERO_THUNDER_CLAP),
            FourCC(GameAbilities.HERO_SHOCKWAVE),
        ];
        let largeRunes = [
            FourCC(GameAbilities.HERO_HEALING_WAVE),
        ];
        let mediumRunes = [
            FourCC(GameAbilities.UNIT_FRENZY_TIER_1),
            FourCC(GameAbilities.ITEM_AREA_HEALING_TIER_1),
        ];
        let smallRunes = [
            FourCC(GameAbilities.UNIT_ABOLISH_MAGIC_TIER_1),
            FourCC(GameAbilities.UNIT_REJUVENATION_TIER_1),
            FourCC(GameAbilities.UNIT_SLOW_TIER_1),
            FourCC(GameAbilities.UNIT_FROST_ARMOR_TIER_1),
            FourCC(GameAbilities.UNIT_UNHOLY_FRENZY_TIER_1),
        ];
        let tinyRunes = [
            FourCC(GameAbilities.UNIT_HEAL_TIER_1),
        ];

        OnSpellCast.getInstance().addSpell(new OnCastContainer(greatRune,
            Runes.onGrandSpell,
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(largeRunes,
            Runes.onLargeSpell
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(mediumRunes,
            Runes.onMediumSpell
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(smallRunes,
            Runes.onSmallSpell
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(tinyRunes,
            Runes.onTinySpell
        ));

    }

    private static getRunePath() {
        return `Doodads\\Cityscape\\Props\\MagicRunes\\MagicRunes${ChooseOne("0.mdl", "1.mdl", "2.mdl")}`;
    }

    private static onGrandSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let rune = Runes.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = Runes.createFadingEffect(rune, p, rgb, 2);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 180, rgb, new RGB(32, 32, 32)))
    }

    private static onLargeSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let rune = Runes.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = Runes.createFadingEffect(rune, p, rgb, 1.5);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 60, rgb, new RGB(32, 32, 32)))
    }

    private static onMediumSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let rune = Runes.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = Runes.createFadingEffect(rune, p, rgb, 1);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 40, rgb, new RGB(32, 32, 32)))
    }

    private static onSmallSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let rune = Runes.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = Runes.createFadingEffect(rune, p, rgb, 0.75);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 20, rgb, new RGB(32, 32, 32)))
    }

    private static onTinySpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let rune = Runes.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = Runes.createFadingEffect(rune, p, rgb, 0.5);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 10, rgb, new RGB(32, 32, 32)))
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


