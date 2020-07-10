export interface AsyncEvent {
    name: string;
    isFinished: boolean;

    start(): void;

    end(): void;

    getStatusInfo(): string;

    getPlayerInfo(target: player): string;
}