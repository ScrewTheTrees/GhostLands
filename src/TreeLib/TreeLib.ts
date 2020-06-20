export class TreeLib {
    public static creator = "ScrewTheTrees";
    public static libName = "TreeLib";

    public static getIntroductionString() {
        return this.libName + " " + this.getMapVersion() + " - " + this.creator;
    }

    public static getMapVersion(): MapVersion {
        // @ts-ignore
        if (mapVersion) return mapVersion; //Supplied by operation.js and build.json
        else return new MapVersion();
    }
}

export class MapVersion {
    public major: string = "";
    public minor: string = "";
    public build: string = "";
    public date: string = "";
}