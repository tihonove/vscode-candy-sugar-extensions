class ChainWrapper<T> {
    private readonly value: undefined | null | T;

    public constructor(value: undefined | null | T) {
        this.value = value;
    }

    public with<TR>(accessor: (input: T) => undefined | null | TR): ChainWrapper<TR> {
        if (this.value == undefined) {
            return new ChainWrapper<TR>(undefined);
        }
        return new ChainWrapper<TR>(accessor(this.value));
    }

    public if(predicate: (input: T) => boolean): ChainWrapper<T> {
        if (this.value == undefined) {
            return new ChainWrapper<T>(undefined);
        }
        if (predicate(this.value)) {
            return this;
        }
        return new ChainWrapper<T>(undefined);
    }

    public unless(predicate: (input: T) => boolean): ChainWrapper<T> {
        if (this.value == undefined) {
            return new ChainWrapper<T>(undefined);
        }
        if (!predicate(this.value)) {
            return this;
        }
        return new ChainWrapper<T>(undefined);
    }

    public return<TR>(accessor: (input: T) => TR): undefined | TR;
    public return<TR>(accessor: (input: T) => TR, defaultValue: TR): TR;
    public return<TR>(accessor: (input: T) => TR, defaultValue?: TR): undefined | TR {
        if (this.value == undefined) {
            return defaultValue;
        }
        return accessor(this.value);
    }
}

export function oc<T>(value: undefined | null | T): ChainWrapper<T> {
    return new ChainWrapper<T>(value);
}
