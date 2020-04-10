import {Hooks} from "../../../TreeLib/Hooks";
import {Entity} from "../../../TreeLib/Entity";

export class PlayerIncomeTendency extends Entity {
    private static instance: PlayerIncomeTendency;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerIncomeTendency();
            Hooks.set(this.name, this.instance);
        }
        return this.instance;
    }

    constructor() {
        super();
        this._timerDelay = 1;
    }

    step() {
        for (let i = 0; i < GetBJMaxPlayers(); i++) {
            let p = Player(i);
            SetPlayerState(p, PLAYER_STATE_RESOURCE_GOLD, GetPlayerState(p, PLAYER_STATE_RESOURCE_GOLD) + 1)
        }
    }

}