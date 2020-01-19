import {Game} from "./Game";
import {ConfigContainer} from "./config/ConfigContainer";
import {Hooks} from "./TreeLib/Hooks";

let gg_trg_Start: trigger;
let gameInstance: Game;

function MapStart() {
    xpcall(() => {
        gameInstance = new Game();
    }, print);

    DestroyTrigger(gg_trg_Start);
    delete _G["gg_trg_Start"];
}

function NewMain() {
    gg_trg_Start = CreateTrigger();
    TriggerRegisterTimerEvent(gg_trg_Start, 0.00, false);
    TriggerAddAction(gg_trg_Start, () => MapStart())
}

function NewConfig() {
    ConfigContainer();
}


_G.main = Hooks.bind(_G.main, NewMain);
_G.config = Hooks.bind(_G.config, NewConfig);