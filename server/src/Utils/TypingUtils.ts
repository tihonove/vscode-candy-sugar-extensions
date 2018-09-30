export function isNotNullOrUndefined<T extends Object>(input: null | undefined | T): input is T {
    return input != undefined;
}

export function valueOrDefault<T>(value: undefined | null | T, defaultValue: T): T {
    return value != undefined ? value : defaultValue;
}
