/// <reference types="@sveltejs/kit" />
declare module "sveltestrap";

interface ImportMetaEnv {
    VITE_ASSET_HOST: string
    VITE_TEST_ENV: string
}
declare namespace App {
    export interface Session {
        user: {name: string};
        data: string;
        callback: string;
        version: string;
        assetHost: string;
        testEnv: boolean;
    }
}