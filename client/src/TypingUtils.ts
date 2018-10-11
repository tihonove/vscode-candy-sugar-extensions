export function asPromise<T>(thenable: Thenable<T>): Promise<T> {
    // @ts-ignore
    return thenable;
}
