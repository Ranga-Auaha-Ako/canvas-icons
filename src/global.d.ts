/// <reference types="@sveltejs/kit" />
declare module 'sveltestrap';

declare namespace App {
	export interface Session {
		user: { name: string };
		data: string;
		callback: string;
		version: string;
		assetHost: string;
		testEnv: boolean;
	}
}
