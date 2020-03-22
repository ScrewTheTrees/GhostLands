const fs = require("fs-extra");
const execFile = require("child_process").execFile;
const cwd = process.cwd();

// Parse configuration
let config = {};
try {
    config = JSON.parse(fs.readFileSync("config.json"));
} catch (e) {
    return console.error(e);
}

const operation = process.argv[2];

switch (operation) {
    case "build":

        const tsLua = ".\\target\\tstl_output.lua";
        const tsLuaMap = ".\\target\\tstl_output.lua.map";
        let doSourceMap = true;

        if (!fs.existsSync(tsLua)) {
            return console.error(`Could not find "${tsLua}"`);
        }
        if (!fs.existsSync(tsLuaMap)) {
            doSourceMap = false;
            console.warn(`Could not find "${tsLuaMap}" No map Trace back to source.`);
        }

        console.log(`Building "${cwd}\\maps\\${config.mapFolder}"...`);
        fs.copy(`.\\maps\\${config.mapFolder}`, `.\\target/${config.mapFolder}`, function (err) {
            if (err) {
                console.error(err);
            } else {
                const mapLua = `.\\target\\${config.mapFolder}\\war3map.lua`;

                if (!fs.existsSync(mapLua)) {
                    return console.error(`Could not find "${mapLua}"`);
                }

                try {
                    if (doSourceMap === true) {
                        const tsLuaMapContents = fs.readFileSync(tsLuaMap);
                        fs.appendFileSync(mapLua, tsLuaMapContents);
                    }

                    const tsLuaContents = fs.readFileSync(tsLua);
                    fs.appendFileSync(mapLua, tsLuaContents);
                } catch (err) {
                    return console.error(err);
                }
                console.log(`Completed!`);
            }
        });

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
}