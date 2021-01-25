export interface ITreeFrame {
    mainFrame: framehandle;
    destroy(): void;
    onTrigger(): void;
}