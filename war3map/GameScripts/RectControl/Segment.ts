export class Segment {
    public readonly header: string;
    public readonly headerIndex: number;
    public readonly subtitle: string;
    public readonly subtitleIndex: number;
    public readonly note: string;
    public readonly noteIndex: number;

    constructor(segments: string[]) {
        this.header = segments[0].replace("gg_rct_", "")  || "";
        this.headerIndex = tonumber(segments[1]) || 0;
        this.subtitle = segments[2] || "";
        this.subtitleIndex = tonumber(segments[1]) || 0;
        this.note = segments[3] || "";
        this.noteIndex = tonumber(segments[4]) || 0;
    }
}