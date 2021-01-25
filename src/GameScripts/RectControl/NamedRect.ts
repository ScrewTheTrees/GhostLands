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

    isPointInRect(pos: Point): boolean {
        return RectContainsCoords(this.value, pos.x, pos.y);
    }

    isUnitInRect(u: unit): boolean {
        return RectContainsCoords(this.value, GetWidgetX(u), GetWidgetY(u));
    }
}