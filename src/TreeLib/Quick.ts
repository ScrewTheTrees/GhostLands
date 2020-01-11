export namespace Quick {

    export function Splice(arr: any[], index: number) {
        arr[index] = arr[arr.length - 1];
        delete arr[arr.length - 1];
    }

    export function Push<T>(arr: T[], value: T) {
        arr[arr.length] = value;
    }
}