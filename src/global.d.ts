/// <reference types="@sveltejs/kit" />
declare module "sveltestrap";

interface ImportMetaEnv {
    VITE_ASSET_HOST: string
}
declare namespace App {
    export interface Session {
        user: {name: string};
        data: string;
        callback: string;
        version: string;
        assetHost: string;
    }
}