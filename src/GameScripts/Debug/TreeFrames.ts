import {Hooks} from "../../TreeLib/Hooks";
import {TreeSimpleFrame} from "./Frames/TreeSimpleFrame";
import {TreeFrameIDS} from "./TreeFrameIDS";
import {Entity} from "../../TreeLib/Entity";
import {Quick} from "../../TreeLib/Quick";
import {ITreeFrame} from "./Frames/ITreeFrame";
import {TreeSimpleButton} from "./Frames/TreeSimpleButton";

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
    private normalFrame: framehandle;
    public allFrames: ITreeFrame[] = [];

    public currentContext: number = 11;
    public onClickButton: trigger = CreateTrigger();

    constructor() {
        super();
        this.hasLoaded = BlzLoadTOCFile("war3mapImported\\TreeFrames\\Toc.toc");
        this.fullScreenFrame = BlzCreateSimpleFrame(TreeFrameIDS.FullSimpleScreen, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 10);
        this.normalFrame = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0);
        TriggerAddAction(this.onClickButton, () => this.onClickButtonAction());

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

    public getNewIndex() {
        this.currentContext += 1;
        return this.currentContext;
    }

    public createSimpleFrame(parentFrame: framehandle = this.fullScreenFrame) {
        let frame = new TreeSimpleFrame(this, this.getNewIndex(), parentFrame);
        this.allFrames.push(frame);
        return frame;
    }

    public createSimpleButton(parentFrame: framehandle = this.fullScreenFrame) {
        let frame = new TreeSimpleButton(this, this.getNewIndex(), parentFrame);

        this.allFrames.push(frame);
        return frame;
    }

    /**
     * This does not clear up memory, for that, use the "remove" function on the frame.
     * @param simpleFrame
     */
    public disconnectFrame(simpleFrame: ITreeFrame) {
        let index = this.allFrames.indexOf(simpleFrame);
        if (index >= 0) {
            Quick.Slice(this.allFrames, index);
        }
    }

    private onClickButtonAction() {
        let triggerFrame = BlzGetTriggerFrame();
        for (let i = 0; i < this.allFrames.length; i++) {
            let frame = this.allFrames[i];
            if (frame.mainFrame == triggerFrame) {
                frame.onTrigger();
            }
        }
    }
}