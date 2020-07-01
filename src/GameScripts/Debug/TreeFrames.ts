import {Hooks} from "../../TreeLib/Hooks";
import {TreeSimpleFrame} from "./TreeSimpleFrame";
import {TreeFrameIDS} from "./TreeFrameIDS";
import {Entity} from "../../TreeLib/Entity";

export class TreeFrames extends Entity {
    private static instance: TreeFrames;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new TreeFrames();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public hasLoaded: boolean = false;

    public fullScreenFrame: framehandle;
    public currentContext: number = 0;
    public allSimpleFrames: TreeSimpleFrame[] = [];

    constructor() {
        super();
        this.hasLoaded = BlzLoadTOCFile("war3mapImported\\TreeFrames\\Toc.toc");

        this.fullScreenFrame = BlzCreateSimpleFrame(TreeFrameIDS.FullSimpleScreen, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0);
        BlzFrameClearAllPoints(this.fullScreenFrame);
        BlzFrameSetAbsPoint(this.fullScreenFrame, FRAMEPOINT_BOTTOM, 0.4, 0);
        BlzFrameSetSize(this.fullScreenFrame, this.getWidescreenFrameMultiplicationValue(), 0.6);
    }

    step() {
        BlzFrameSetSize(this.fullScreenFrame, this.getWidescreenFrameMultiplicationValue(), 0.6);
    }

    public getWidescreenFrameMultiplicationValue() {
        return 0.6 * (BlzGetLocalClientWidth() / BlzGetLocalClientHeight());
    }

}