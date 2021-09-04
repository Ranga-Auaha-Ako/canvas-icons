<script lang="ts">
	import Fuse from 'fuse.js';

	import categories from '$lib/icons';
	import IconList from '$lib/components/iconList.svelte';

	const allIcons = categories.reduce((i, cat) => i.concat(cat.icons), []);
	const fuse = new Fuse(allIcons, {
		keys: [
			{ name: 'title', weight: 0.5 },
			{ name: 'term', weight: 0.5 },
			{ name: 'tags', weight: 0.3 },
			{ name: 'collections', weight: 0.3 }
		]
	});

	let search = '';
	$: filteredIcons = fuse.search(search);
</script>

<div id="recents">
	<!-- Recent icons -->
</div>
<div id="all">
	<input bind:value={search} />
	<!-- All icons (filterable) -->
	<IconList icons={filteredIcons} />
</div>

<style lang="scss">
</style>
