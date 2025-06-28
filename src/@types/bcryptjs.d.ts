// Stub for bcryptjs types if @types/bcryptjs is missing
// Remove if you install @types/bcryptjs

declare module 'bcryptjs' {
    export function hashSync(s: string, salt: string | number): string;
    export function compareSync(s: string, hash: string): boolean;
    // Add more as needed
}
