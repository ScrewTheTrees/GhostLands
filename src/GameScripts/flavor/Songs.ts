import {Hooks} from "../../TreeLib/Hooks";

export class Songs {
    private static instance: Songs;
    public OST_COUNTDOWN_WAR = "war3mapImported\\ost\\countdown_war.mp3";
    public OST_COUNTDOWN_SIEGE = "war3mapImported\\ost\\countdown_war.mp3";

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new Songs();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    public setBackgroundOst(ost: string) {
        SetMapMusic(ost, true, 0);
        PlayMusicEx(ost, 0, 1);
    }

    public resetBackgroundOst() {
        this.setBackgroundOst("music");
    }
}