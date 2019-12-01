import {Hooks} from "../TreeLib/Hooks";
import {Players} from "../TreeLib/Structs/Players";

export class PlayerManager {
    private static instance: PlayerManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerManager();
            Hooks.set("PlayerManager", this.instance);
        }
        return this.instance;
    }

    public team1Minions: player[] = [];
    public team2Minions: player[] = [];

    public team1MinionsAll: player[] = [];
    public team2MinionsAll: player[] = [];

    public team1Player: player = Players.MINT;
    public team1PlayerArmy: player = Players.LAVENDER;
    public team1PlayerExtra: player = Players.COAL;

    public team2Player: player = Players.SNOW;
    public team2PlayerArmy: player = Players.EMERALD;
    public team2PlayerExtra: player = Players.PEANUT;

    public event1Player: player = Players.WHEAT;
    public event2Player: player = Players.PEACH;

    public playerLeavesTrigger: trigger = CreateTrigger();

    constructor() {
        for (let i = 0; i < 8; i++) {
            this.team1MinionsAll.push(Player(i));
        }
        for (let i = 8; i < 16; i++) {
            this.team2MinionsAll.push(Player(i));
        }

        for (let i = 0; i < this.team1MinionsAll.length; i++) {
            let p = this.team1MinionsAll[i];
            if (GetPlayerController(p) == MAP_CONTROL_USER && GetPlayerSlotState(p) == PLAYER_SLOT_STATE_PLAYING) {
                this.team1Minions.push(p);
            }
        }

        for (let i = 0; i < this.team2MinionsAll.length; i++) {
            let p = this.team2MinionsAll[i];
            if (GetPlayerController(p) == MAP_CONTROL_USER && GetPlayerSlotState(p) == PLAYER_SLOT_STATE_PLAYING) {
                this.team2Minions.push(p);
            }
        }
        for (let i = 0; i < GetPlayerNeutralAggressive(); i++) {
            TriggerRegisterPlayerEventLeave(this.playerLeavesTrigger, Player(i));
        }

        TriggerAddAction(this.playerLeavesTrigger, () => this.onPlayerLeave());
    }

    private onPlayerLeave() {
        let p = GetTriggerPlayer();
        let index = this.team1Minions.indexOf(p);
        if (index >= 0) {
            this.team1Minions.splice(index, 1);
        }

        index = this.team2Minions.indexOf(p);
        if (index >= 0) {
            this.team2Minions.splice(index, 1);
        }
    }
}