import {buildConfig, buildVersion, incrementBuild, buildLogger} from "./Utils";
import * as fs from "fs-extra";

const cwd = process.cwd();

let config = buildConfig;
let version = buildVersion;

export function buildEntireMap() {
    incrementBuild();

    const tsLua = ".\\target\\tstl_output.lua";
    if (!fs.existsSync(tsLua)) {
        buildLogger.error(`Could not find "${tsLua}"`);
    }
    let mapFolder = `${cwd}\\maps\\${config.mapFolder}`;
    let targetFolder = `${cwd}\\target\\${config.mapFolder}`;

    buildLogger.debug(`Building "${mapFolder}"...`);
    fs.copy(mapFolder, targetFolder, (err) => {
        if (err) {
            buildLogger.error(err);
        } else {
            const mapLua = `.\\target\\${config.mapFolder}\\war3map.lua`;

            if (!fs.existsSync(mapLua)) {
                return buildLogger.error(`Could not find "${mapLua}"`);
            }

            try {
                const tsLuaContents = fs.readFileSync(tsLua);
                fs.appendFileSync(mapLua, "\nlocal mapVersion = {}");
                fs.appendFileSync(mapLua, "\nmapVersion.major = " + version.major);
                fs.appendFileSync(mapLua, "\nmapVersion.minor = " + version.minor);
                fs.appendFileSync(mapLua, "\nmapVersion.build = " + version.build);
                let date = new Date();
                fs.appendFileSync(mapLua, `\nmapVersion.date = "${date.getFullYear()}-${date.getMonth()}-${date.getDate()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}"`);
                fs.appendFileSync(mapLua, tsLuaContents);
            } catch (err) {
                return buildLogger.error(err);
            }
            buildLogger.debug(`Completed!`);
        }
    });
}