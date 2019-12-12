export class Optional<T> {
    private value: T | null;

    constructor(value: T | null = null) {
        this.value = value;
    }

    public isPresent(): boolean {
        return this.value != null;
    }

    public get(): T {
        let val: any;
        val = this.value;
        return val;
    }

    public set(value: T | null) {
        this.value = value;
    }
}
