// tslint:disable-next-line:no-any
export function createEvent<U extends any[]>(): Event<U> {
    return new Event<U>();
}

// tslint:disable-next-line:no-any
type Listener<U extends any[]> = (...args: U) => void;

// tslint:disable-next-line:no-any
export class Event<U extends any[]> {
    private readonly listeners: Array<Listener<U>> = [];

    public emit(...args: U): void {
        for (const listener of this.listeners) {
            listener(...args);
        }
    }

    public addListener(listener: (...args: U) => void): void {
        this.listeners.push(listener);
    }
}
