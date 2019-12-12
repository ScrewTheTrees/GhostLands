import {Point} from "../../TreeLib/Utility/Point";

export class NamedRect {
    constructor(public name: string, public value: rect) {
    }

    getCenter(): Point {
        return Point.fromRectCenter(this.value);
    }

    getRandomPoint(): Point {
        return Point.fromLocationClean(GetRandomLocInRect(this.value));
    }
}