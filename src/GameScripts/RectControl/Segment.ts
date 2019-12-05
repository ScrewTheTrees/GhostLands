export class Segment {
    public readonly segment1: string;
    public readonly segment1Index: number;
    public readonly segment2: string;
    public readonly segment2Index: number;
    public readonly segment3: string;
    public readonly segment3Index: number;

    constructor(segments: string[]) {
        this.segment1 = segments[0].replace("gg_rct_", "") || "";
        this.segment1Index = tonumber(segments[1]) || 0;
        this.segment2 = segments[2] || "";
        this.segment2Index = tonumber(segments[3]) || 0;
        this.segment3 = segments[4] || "";
        this.segment3Index = tonumber(segments[5]) || 0;
    }
}