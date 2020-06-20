export function GetAllItemsOfTypeOnUnit(target: unit, itemType: number): item[] {
    let retvar: item[] = [];
    let size = UnitInventorySize(target);
    for (let i = 0; i < size; i++) {
        let item = UnitItemInSlot(target, i);
        if (item == null) continue;

        if (GetItemTypeId(item) == itemType) {
            retvar.push(item);
        }
    }
    return retvar;
}

export function GetTotalItemStacks(items: item[]) {
    let stacks = 0;
    for (let it of items) {
        stacks += GetItemCharges(it);
    }
    return stacks;
}