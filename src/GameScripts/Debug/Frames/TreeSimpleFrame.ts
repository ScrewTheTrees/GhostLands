import {TreeFrameIDS} from "../TreeFrameIDS";
import {TreeFrames} from "../TreeFrames";
import {ITreeFrame} from "./ITreeFrame";

export class TreeSimpleFrame implements ITreeFrame {
    private service: TreeFrames;
    public parent: framehandle;
    public mainFrame: framehandle;
    public frameText: framehandle;
    public frameTexture: framehandle;

    constructor(service: TreeFrames, index: number, parent: framehandle) {
        this.service = service;
        this.parent = parent;
        this.mainFrame = BlzCreateSimpleFrame(TreeFrameIDS.SimpleGenericFrame, parent, index);
        this.frameText = BlzGetFrameByName(TreeFrameIDS.SimpleGenericFrame_String, index);
        this.frameTexture = BlzGetFrameByName(TreeFrameIDS.SimpleGenericFrame_Texture, index);

        BlzFrameSetSize(this.frameText, 1, 1);
        BlzFrameSetSize(this.frameTexture, 1, 1);
        BlzFrameSetPoint(this.frameText, FRAMEPOINT_TOPLEFT, this.mainFrame, FRAMEPOINT_TOPLEFT, 0, 0);
        BlzFrameSetPoint(this.frameText, FRAMEPOINT_BOTTOMRIGHT, this.mainFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0);
        BlzFrameSetPoint(this.frameTexture, FRAMEPOINT_TOPLEFT, this.mainFrame, FRAMEPOINT_TOPLEFT, 0, 0);
        BlzFrameSetPoint(this.frameTexture, FRAMEPOINT_BOTTOMRIGHT, this.mainFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0);
    }

    public setPointRelative(childPoint: framepointtype, parentPoint: framepointtype, x: number = 0, y: number = 0): TreeSimpleFrame {
        BlzFrameSetPoint(this.mainFrame, childPoint, this.parent, parentPoint, x, y);
        return this;
    }

    public setPointAbsolute(point: framepointtype, x: number = 0, y: number = 0): TreeSimpleFrame {
        BlzFrameSetAbsPoint(this.mainFrame, point, x, y);
        return this;
    }

    public clearPoints() {
        BlzFrameClearAllPoints(this.mainFrame);
    }

    public setSize(width: number, height: number): TreeSimpleFrame {
        BlzFrameSetSize(this.mainFrame, width, height);
        return this;
    }

    public setText(text: string): TreeSimpleFrame {
        BlzFrameSetText(this.frameText, text);
        return this;
    }

    public setTexture(pathToTex: string): TreeSimpleFrame {
        BlzFrameSetTexture(this.frameTexture, pathToTex, 0, false);
        return this;
    }

    public destroy() {
        BlzDestroyFrame(this.frameTexture);
        BlzDestroyFrame(this.frameText);
        BlzDestroyFrame(this.mainFrame);
        this.service.disconnectFrame(this);
    }

    onTrigger(): void {
        //DoNothing
    }
}