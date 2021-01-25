import {TreeFrameIDS} from "../TreeFrameIDS";
import {TreeFrames} from "../TreeFrames";
import {ITreeFrame} from "./ITreeFrame";

export class TreeSimpleButton implements ITreeFrame {
    public mainFrame: framehandle;
    public frameText: framehandle;
    public frameTexture: framehandle;
    public onClickCallback?: () => void

    constructor(private service: TreeFrames, index: number, public parent: framehandle) {
        this.mainFrame = BlzCreateSimpleFrame(TreeFrameIDS.SimpleGenericButton, parent, index);
        this.frameText = BlzGetFrameByName(TreeFrameIDS.SimpleGenericButton_String, index);
        this.frameTexture = BlzGetFrameByName(TreeFrameIDS.SimpleGenericButton_Texture, index);

        BlzTriggerRegisterFrameEvent(service.onClickButton, this.mainFrame, FRAMEEVENT_CONTROL_CLICK);

        BlzFrameSetSize(this.frameText, 1, 1);
        BlzFrameSetSize(this.frameTexture, 1, 1);
        BlzFrameSetPoint(this.frameText, FRAMEPOINT_TOPLEFT, this.mainFrame, FRAMEPOINT_TOPLEFT, 0, 0);
        BlzFrameSetPoint(this.frameText, FRAMEPOINT_BOTTOMRIGHT, this.mainFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0);
        BlzFrameSetPoint(this.frameTexture, FRAMEPOINT_TOPLEFT, this.mainFrame, FRAMEPOINT_TOPLEFT, 0, 0);
        BlzFrameSetPoint(this.frameTexture, FRAMEPOINT_BOTTOMRIGHT, this.mainFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0);
    }

    public setPointRelative(childPoint: framepointtype, parentPoint: framepointtype, x: number = 0, y: number = 0): TreeSimpleButton {
        BlzFrameSetPoint(this.mainFrame, childPoint, this.parent, parentPoint, x, y);
        return this;
    }

    public setPointAbsolute(point: framepointtype, x: number = 0, y: number = 0): TreeSimpleButton {
        BlzFrameSetAbsPoint(this.mainFrame, point, x, y);
        return this;
    }

    public setCallback(onClickCallback: () => void) {
        this.onClickCallback = onClickCallback;
        return this;
    }

    public clearPoints() {
        BlzFrameClearAllPoints(this.mainFrame);
    }

    public setSize(width: number, height: number): TreeSimpleButton {
        BlzFrameSetSize(this.mainFrame, width, height);
        return this;
    }

    public setText(text: string): TreeSimpleButton {
        BlzFrameSetText(this.frameText, text);
        return this;
    }

    public setTexture(pathToTex: string): TreeSimpleButton {
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
        if (this.onClickCallback) this.onClickCallback();
    }
}