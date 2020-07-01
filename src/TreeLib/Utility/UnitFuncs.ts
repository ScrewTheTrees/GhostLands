export function GetOrAddAbility(target: unit, abilityType: number): ability {
    let unitAbility = BlzGetUnitAbility(target, abilityType);
    if (unitAbility != null) return unitAbility;

    UnitAddAbility(target, abilityType);
    return BlzGetUnitAbility(target, abilityType);
}