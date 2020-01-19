import {Players} from "../TreeLib/Structs/Players";

export function ConfigContainer() {
    let replacer = 0;
    SetPlayerColor(Players.MINT, ConvertPlayerColor(replacer));
    SetPlayerColor(Players.LAVENDER, ConvertPlayerColor(replacer));
    SetPlayerColor(Players.COAL, ConvertPlayerColor(replacer));
    SetPlayerColor(Player(replacer), ConvertPlayerColor(GetPlayerId(Players.MINT)));

    replacer = 1;
    SetPlayerColor(Players.SNOW, ConvertPlayerColor(replacer));
    SetPlayerColor(Players.EMERALD, ConvertPlayerColor(replacer));
    SetPlayerColor(Players.PEANUT, ConvertPlayerColor(replacer));
    SetPlayerColor(Player(replacer), ConvertPlayerColor(GetPlayerId(Players.EMERALD)));
}