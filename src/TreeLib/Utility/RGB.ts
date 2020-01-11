import {TreeMath} from "./TreeMath";

export class RGB {
    get blue(): number {
        return this._blue;
    }

    set blue(value: number) {
        this._blue = TreeMath.Clamp(value, 0, 255);
    }

    get green(): number {
        return this._green;
    }

    set green(value: number) {
        this._green = TreeMath.Clamp(value, 0, 255);
    }

    get red(): number {
        return this._red;
    }

    set red(value: number) {
        this._red = TreeMath.Clamp(value, 0, 255);
    }

    private _red: number;
    private _green: number;
    private _blue: number;

    constructor(red: number, green: number, blue: number) {
        this._red = red;
        this._green = green;
        this._blue = blue;
    }

    public static getFull() {
        return new RGB(255, 255, 255);
    }
}

export function RGBTextString(color: RGB, ...input: any[]) {
    let ret = "|cFF" + string.format('%02x', color.red) + string.format('%02x', color.green) + string.format('%02x', color.blue);
    for (let i = 0; i < input.length; i++) {
        ret += tostring(input[i]);
        ret += " ";
    }
    ret += "|r";
    return ret
}