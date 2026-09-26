/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Base URL of the live stats Worker, e.g. https://vishwajeet-stats.<account>.workers.dev */
    readonly VITE_STATS_API_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
