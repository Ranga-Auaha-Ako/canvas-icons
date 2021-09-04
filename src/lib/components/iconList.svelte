<script lang="ts">
	import type { Icon } from '../icons';
	export let icons: any[];

	// The font ID is generated based on the path. Find that out here:
	const getFontId = (url: string) => {
		const Url = new URL(url);
		const path = Url.pathname;
		return path
			.replace('.svg', '')
			.split('/')
			.filter((a) => a && a != 'icon-set')
			.join('-')
			.replace(' ', '_');
	};
</script>

<div class="iconList">
	<!-- Recent icons -->
	{#each icons as icon}
		<div>
			<i class="icon-{getFontId(icon.item.url)}" />
		</div>
	{/each}
</div>
<div id="" />

<style lang="scss">
	@import '../../../static/font/c-ics.css';
	.iconList {
		font-family: 'c-ics';
	}
</style>
