import {Hooks} from "../../TreeLib/Hooks";
import {NamedRect} from "./NamedRect";
import {ShitEx} from "../../TreeLib/ShitEx";
import {Segment} from "./Segment";

export class Rectifier {
    private static instance: Rectifier;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Rectifier();
            Hooks.set("Rectifier", this.instance);
        }
        return this.instance;
    }

    public rects: NamedRect[] = [];

    constructor() {
        for (let index in _G) {
            if (index.startsWith("gg_rct_")) {
                let value = _G[index];
                this.rects.push(new NamedRect(index, value));

            }
        }

        this.rects.sort((one, two) => (one.name < two.name ? -1 : 1));
    }

    public getRectByWEName(name: string): NamedRect {
        for (let i = 0; i < this.rects.length; i++) {
            let named = this.rects[i];
            if (named.name == "gg_rct_" + name) {
                return named;
            }
        }
        return new NamedRect("anonymous", Rect(-32, -32, 32, 32));
    }

    public getRectsStartsWithWEName(name: string): NamedRect[] {
        let rects: NamedRect[] = [];
        for (let i = 0; i < this.rects.length; i++) {
            let named = this.rects[i];
            if (named.name.startsWith("gg_rct_" + name)) {
                rects.push(named);
            }
        }
        return rects;
    }

    public getRectsByForceOfType(forceNum: number, type: string): NamedRect[] {
        let rects: NamedRect[] = [];
        this.rects.forEach((value) => {
            let segment = new Segment(ShitEx.separateNumbers(value.name));
            if (segment.segment1 == "force"
                && segment.segment1Index == forceNum
                && segment.segment2 == type) {
                //We are in!
                rects.push(value);
            }
        });

        return rects;
    }

    public getPathWaypoints(): NamedRect[] {
        let rects: NamedRect[] = [];
        this.rects.forEach((value) => {
            let segment = new Segment(ShitEx.separateNumbers(value.name));
            if (segment.segment1 == "path"
                && segment.segment2 == "waypoint") {
                //We are in!
                rects.push(value);
            }
        });

        return rects;
    }
}