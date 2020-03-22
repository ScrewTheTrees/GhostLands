import {RGB} from "../../TreeLib/Utility/RGB";

export const enum Forces {
    FORCE_1 = "FORCE_1",
    FORCE_2 = "FORCE_2",
    FORCE_BANDIT = "FORCE_BANDIT",
}

export function GetIDByForce(force: Forces) {
    switch (force) {
        case Forces.FORCE_1:
            return 1;
        case Forces.FORCE_2:
            return 2;
        case Forces.FORCE_BANDIT:
            return 3;
    }
}

export function GetColorByForce(forcesByPlayer: Forces | Forces.FORCE_2 | Forces.FORCE_BANDIT) {
    let rgb = new RGB(0, 255, 0);

    if (forcesByPlayer == Forces.FORCE_1) {
        rgb = new RGB(255, 0, 0);

    } else if (forcesByPlayer == Forces.FORCE_2) {
        rgb = new RGB(0, 0, 255);
    }
    return rgb;
}