import {buildConfig, getFilesInsideDir, incrementMajor, incrementMinor, logger} from "./Utils";
import {buildEntireMap} from "./Build";

const fs = require("fs");
const execFile = require("child_process").execFile;
const cwd = process.cwd();

const operation = process.argv[2];

const config = buildConfig;

switch (operation) {
    case "build":
        buildEntireMap();
        break;
    case "run":
        const speed = process.argv[3];
        let filename = "";

        switch (speed) {
            case "4":
                filename = `${cwd}\\bin\\WorldEditTestGame4x.wgc`;
                break;
            case "8":
                filename = `${cwd}\\bin\\WorldEditTestGame8x.wgc`;
                break;
            default:
                filename = `${cwd}\\target\\${config.mapFolder}`;
        }
        console.log(filename);

        execFile(config.gameExecutable, ["-loadfile", filename, ...config.launchArgs]);

        break;

    case "incrementMajor":
        incrementMajor();
        break;

    case "incrementMinor":
        incrementMinor();
        break;


    case "regenerateIndex":
        let dirs = getFilesInsideDir(config.indexDirectory, ".ts")
        let data = "";
        for (let dir of dirs) {
            dir = dir.replace(/\\/g, "/").replace(/\.ts/g, "");
            data += `export * from "${dir}"\n`;
        }

        fs.writeFileSync("./index.ts", data);
        break;
}


