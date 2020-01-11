import {Hooks} from "../TreeLib/Hooks";
import {Players} from "../TreeLib/Structs/Players";
import {Quick} from "../TreeLib/Quick";

export class PlayerManager {
    private static instance: PlayerManager;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new PlayerManager();
            Hooks.set("PlayerManager", this.instance);
        }
        return this.instance;
    }

    public allMinions: player[] = [];

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

    public bandit: player = Players.WHEAT;
    public event2Player: player = Players.PEACH;

    public playerLeavesTrigger: trigger = CreateTrigger();

    constructor() {
        for (let i = 0; i < 8; i++) {
            this.team1MinionsAll.push(Player(i));
        }
        for (let i = 8; i < 16; i++) {
            this.team2MinionsAll.push(Player(i));
        }

        this.addActiveMinions(this.team1MinionsAll, this.team1Minions);
        this.addActiveMinions(this.team2MinionsAll, this.team2Minions);


        for (let i = 0; i < GetPlayerNeutralAggressive(); i++) {
            TriggerRegisterPlayerEventLeave(this.playerLeavesTrigger, Player(i));
        }

        TriggerAddAction(this.playerLeavesTrigger, () => this.onPlayerLeave());
    }

    private addActiveMinions(minions: player[], addTo: player[]) {
        for (let i = 0; i < minions.length; i++) {
            let p = minions[i];
            if (GetPlayerController(p) == MAP_CONTROL_USER && GetPlayerSlotState(p) == PLAYER_SLOT_STATE_PLAYING) {
                Quick.Push(addTo, p);
                Quick.Push(this.allMinions, p);
            }
        }
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

        index = this.allMinions.indexOf(p);
        if (index >= 0) {
            this.allMinions.splice(index, 1);
        }
    }
}