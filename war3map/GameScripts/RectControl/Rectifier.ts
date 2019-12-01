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

    getRectsByHeader(header: string) {
        let rects: NamedRect[] = [];
        this.rects.forEach((value) => {
            let segment = new Segment(ShitEx.separateNumbers(value.name));
            if (segment.header == header) {
                rects.push(value);
            }
        });

        return rects;
    }

    public getRectsByForceOfType(forceNum: number, type: string) {
        let rects: NamedRect[] = [];
        this.rects.forEach((value) => {
            let segment = new Segment(ShitEx.separateNumbers(value.name));
            if (segment.header == "force"
                && segment.headerIndex == forceNum
                && segment.subtitle == type) {
                //We are in!
                rects.push(value);
            }
        });

        return rects;
    }
}