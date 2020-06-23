export class StackerDto {
    public manipulatedItem: item;
    constructor(public itemOwner: unit) {
        this.manipulatedItem = GetManipulatedItem();
    }
}