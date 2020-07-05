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
import {Quick} from "../../TreeLib/Quick";
import {GameBuffs} from "../Enums/GameBuffs";
import {Entity} from "../../TreeLib/Entity";
import {Delay} from "../../TreeLib/Utility/Delay";

export class Runes extends Entity {
    private static instance: Runes;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Runes();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public unitsWithMagicalMovespeed: { unit: unit, point: Point }[] = [];

    constructor() {
        super();
        this._timerDelay = 0.1;
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
            FourCC(GameAbilities.HERO_SHADOW_STRIKE),
            FourCC(GameAbilities.HERO_HOLY_LIGHT),
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

        let movespeedBuffs = [
            FourCC(GameAbilities.ITEM_SCROLL_OF_HASTE_TIER_1),
        ]

        OnSpellCast.getInstance().addSpell(new OnCastContainer(greatRune,
            (...args) => this.onGrandSpell(...args)
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(largeRunes,
            (...args) => this.onLargeSpell(...args)
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(mediumRunes,
            (...args) => this.onMediumSpell(...args)
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(smallRunes,
            (...args) => this.onSmallSpell(...args)
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(tinyRunes,
            (...args) => this.onTinySpell(...args)
        ));
        OnSpellCast.getInstance().addSpell(new OnCastContainer(movespeedBuffs,
            (...args) => this.onAOESpeedBuff(...args)
        ));

    }

    public step(): void {
        this.updateMagicalMovespeed();
    }

    private updateMagicalMovespeed() {
        for (let i = 0; i < this.unitsWithMagicalMovespeed.length; i++) {
            let u = this.unitsWithMagicalMovespeed[i];
            if (!UnitHasBuffBJ(u.unit, FourCC(GameBuffs.MAGICAL_SPEED_BONUS))) {
                Quick.Slice(this.unitsWithMagicalMovespeed, i);
                i -= 1;
                continue;
            }
            if (Point.fromWidget(u.unit).distanceTo(u.point) > 10) {
                let p = Point.fromWidget(u.unit);
                let eff = AddSpecialEffect(this.getSmokePath(), p.x, p.y);
                BlzSetSpecialEffectScale(eff, 0.5);
                BlzSetSpecialEffectYaw(eff, GetRandomReal(0, 360));
                BlzSetSpecialEffectZ(eff, GetLocationZ(p.toLocationClean()));

                TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 120, RGB.getFull(), new RGB(0,0,0)));
            }
            u.point = Point.fromWidget(u.unit);
        }
    }

    private getRunePath() {
        return `Doodads\\Cityscape\\Props\\MagicRunes\\MagicRunes${ChooseOne("0.mdl", "1.mdl", "2.mdl")}`;
    }

    private getSmokePath() {
        return `Doodads\\LordaeronSummer\\Props\\SmokeSmudge\\SmokeSmudge.mdl`;
    }

    private onGrandSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let runePath = this.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = this.createSimpleEffectRune(runePath, p, rgb, 2);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 180, rgb, new RGB(32, 32, 32)))
    }

    private onLargeSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let runePath = this.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = this.createSimpleEffectRune(runePath, p, rgb, 1.5);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 60, rgb, new RGB(32, 32, 32)))
    }

    private onMediumSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let runePath = this.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = this.createSimpleEffectRune(runePath, p, rgb, 1);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 40, rgb, new RGB(32, 32, 32)))
    }

    private onSmallSpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let runePath = this.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = this.createSimpleEffectRune(runePath, p, rgb, 0.75);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 20, rgb, new RGB(32, 32, 32)))
    }

    private onTinySpell(cont: SpellData) {
        let p = Point.fromWidget(cont.castingUnit);
        let runePath = this.getRunePath();
        let forcesByPlayer = PlayerManager.getInstance().getForcesByPlayer(GetOwningPlayer(cont.castingUnit));
        let rgb = GetColorByForce(forcesByPlayer);
        let eff = this.createSimpleEffectRune(runePath, p, rgb, 0.5);

        TemporaryEffects.getInstance().addEffect(new ColorFadeEffect(eff, 10, rgb, new RGB(32, 32, 32)))
    }

    private onAOESpeedBuff(cont: SpellData) {
        Delay.addDelay(() => {
            let p = Point.fromWidget(cont.castingUnit);
            let units = Quick.GroupToUnitArrayDestroy(GetUnitsInRangeOfLocAll(1800, p.toLocationClean()));
            for (let u of units) {
                if (UnitHasBuffBJ(cont.castingUnit, FourCC(GameBuffs.MAGICAL_SPEED_BONUS))) {
                    this.unitsWithMagicalMovespeed.push({unit: u, point: Point.fromWidget(u)});
                }
            }
        }, 0.5);
    }

    private createSimpleEffectRune(modelName: string, p: Point, color: RGB, scale: number) {
        let eff = AddSpecialEffect(modelName, p.x, p.y);

        BlzSetSpecialEffectScale(eff, scale);
        BlzSetSpecialEffectColor(eff, color.red, color.green, color.blue);
        BlzSetSpecialEffectYaw(eff, GetRandomReal(0, 360));
        BlzSetSpecialEffectZ(eff, GetLocationZ(p.toLocationClean()) - (50 * scale));

        return eff;
    }
}


