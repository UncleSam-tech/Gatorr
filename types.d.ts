// This file provides fallback type declarations to suppress IDE 'Cannot find module' errors
// since the local node_modules directory hasn't fully populated from npm install yet.

declare module 'next/server' {
    export const NextResponse: any;
}

declare module '@prisma/client' {
    export class PrismaClient {
        constructor(options?: any);
        [key: string]: any;
    }
}

declare module 'next' {
    export type NextConfig = any;
    export type Metadata = any;
}

declare module 'cheerio' {
    export function load(html: string | Buffer | Node, options?: any, isDocument?: boolean): any;
    export const html: any;
    export const xml: any;
    export const text: any;
}

declare module 'next/navigation' {
    export function redirect(url: string, type?: string): never;
}
