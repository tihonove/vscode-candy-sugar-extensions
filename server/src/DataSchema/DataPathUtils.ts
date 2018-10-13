export type DataPath = string[];

export class DataPathUtils {
    private static joinTwoDataPaths(prefix: DataPath, suffix: DataPath): DataPath {
        if (suffix.length > 0 && suffix[0] === "") {
            return suffix;
        }
        return this.collapseTwoDots([...prefix, ...suffix]);
    }

    private static collapseTwoDots(path: DataPath): DataPath {
        const result = [];
        for (const pathItem of path) {
            if (pathItem === "..") {
                result.pop();
            } else {
                result.push(pathItem);
            }
        }
        return result;
    }

    public static joinDataPaths(prefix: string[], ...suffixes: string[][]): string[] {
        return suffixes.reduce((x, y) => this.joinTwoDataPaths(x, y), prefix);
    }

    public static parseDataAttributeValue(pathAttributeValue: string): string[] {
        return pathAttributeValue.split("/");
    }
    public static normalizeDataPath(path: string[]): string[] {
        // TODO надо сделать этот метод приватным или вообще как-то надо Path сделать объектом
        return this.collapseTwoDots(path.length > 0 && path[0] === "" ? path.slice(1) : path);
    }
}
