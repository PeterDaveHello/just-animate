export function argumentError(name: string): void {
    throw new Error(`invalid parameter: ${name}`);
}