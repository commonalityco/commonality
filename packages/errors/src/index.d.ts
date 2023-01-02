export declare class UnauthorizedError extends Error {
    static message: string;
    name: string;
    constructor();
}
export declare class InvalidSnapshotError extends Error {
    static message: string;
    name: string;
    constructor();
}
export declare class GenericError extends Error {
    static message: string;
    errorName: string;
    constructor();
}
