export interface MapEvent {
    name: string;
    isFinished: boolean;

    start(): void;
    end(): void;
}