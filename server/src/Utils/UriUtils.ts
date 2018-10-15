import path from "path";

export class UriUtils {
    public static join(uri: string, ...relativeSegments: string[]): string {
        return UriUtils.fileNameToUri(path.join(UriUtils.toFileName(uri), ...relativeSegments));
    }

    public static dirname(uri: string): string {
        return UriUtils.fileNameToUri(path.dirname(UriUtils.toFileName(uri)));
    }

    public static toFileName(uri: string): string {
        return decodeURIComponent(uri.replace("file:///", "")).replace(/\//gi, "\\");
    }

    public static fileNameToUri(filename: string): string {
        return "file:///" + filename.replace(/\\/gi, "/").replace(":", "%3A");
    }
}
