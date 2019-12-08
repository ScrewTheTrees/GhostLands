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

    public getBySegment(segment: Segment): NamedRect[] {
        let rects: NamedRect[] = [];
        this.rects.forEach((value) => {
            let compare = new Segment(ShitEx.separateNumbers(value.name));
            if ((segment.segment1 == "" || segment.segment1 == compare.segment1)
                && (segment.segment2 == "" || segment.segment2 == compare.segment2)
                && (segment.segment3 == "" || segment.segment3 == compare.segment3)
                && (segment.segment1Index == 0 || segment.segment1Index == compare.segment1Index)
                && (segment.segment2Index == 0 || segment.segment2Index == compare.segment2Index)
                && (segment.segment3Index == 0 || segment.segment3Index == compare.segment3Index)
            ) {
                //We are in!
                rects.push(value);
            }
        });
        return rects;
    }

    public getBySegmentNames(segment1: string, segment2: string): NamedRect[] {
        let rects: NamedRect[] = [];
        this.rects.forEach((value) => {
            let segment = new Segment(ShitEx.separateNumbers(value.name));
            if (segment.segment1 == segment1
                && segment.segment2 == segment2) {
                //We are in!
                rects.push(value);
            }
        });

        return rects;
    }
}