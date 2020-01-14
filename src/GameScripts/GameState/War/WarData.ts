import {Hooks} from "../../../TreeLib/Hooks";
import {Occupations} from "../Occupations/Occupations";
import {Occupant} from "../Occupations/Occupant";
import {Rectifier} from "../../RectControl/Rectifier";
import {NamedRect} from "../../RectControl/NamedRect";

export class WarData {
    private static instance: WarData;
    public force1EarlyTargets = [
        Occupations.getInstance().CITY_5,
        Occupations.getInstance().CITY_1,
    ];
    public force2EarlyTargets = [
        Occupations.getInstance().CITY_4,
        Occupations.getInstance().CITY_2,
    ];

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new WarData();
            Hooks.set("WarData", this.instance);
        }
        return this.instance;
    }

    getCityRect(occu: Occupant) {
        let all = Occupations.getInstance();
        let recti = Rectifier.getInstance();
        switch (occu) {
            case all.CITY_1:
                return recti.getRectByWEName("city1");
            case all.CITY_2:
                return recti.getRectByWEName("city2");
            case all.CITY_3:
                return recti.getRectByWEName("city3");
            case all.CITY_4:
                return recti.getRectByWEName("city4");
            case all.CITY_5:
                return recti.getRectByWEName("city5");
            case all.FORCE_1_BASE:
                return recti.getRectByWEName("force1base");
            case all.FORCE_2_BASE:
                return recti.getRectByWEName("force2base");
        }
        return new NamedRect("ERROR", Rect(-32, -32, 32, 32));
    }
}