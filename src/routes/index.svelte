<script lang="ts">
	import Fuse from 'fuse.js';

	// Load Icons

	import categories from '$lib/icons';
	import type { Category, Icon } from '$lib/icons';
	import IconList from '$lib/components/iconList.svelte';

	// Conver to list of icons and list of categories with icon indices
	let i = 0;
	let allIcons: Icon[] = categories.reduce((acc, cv) => acc.concat(cv.icons), []);

	let numIcons = 0;
	let catIconIndex = [];
	for (let i = 0; i < categories.length; i++) {
		const cat = categories[i];
		const iconIndexes = Array.from({ length: cat.icons.length }, (_, i) => i + numIcons);
		catIconIndex.push(iconIndexes);
		numIcons += iconIndexes.length;
	}

	// Initiate Search
	const fuse = new Fuse(allIcons, {
		keys: [
			{ name: 'title', weight: 0.5 },
			{ name: 'term', weight: 0.5 },
			{ name: 'tags', weight: 0.3 },
			{ name: 'collections', weight: 0.3 }
		],
		shouldSort: true,
		minMatchCharLength: 2,
		threshold: 0.25
	});
	let search = 'music';
	$: filteredIcons = fuse.search(search);
	$: filteredIndices = filteredIcons.map((i) => i.refIndex);
	$: searchResults = filteredIcons.slice(0, 10).map((i) => i.item);

	let colour = 'black';
</script>

<div style="--iconColor: {colour}">
	<div id="toolbar">
		<!-- Toolbar with search and colour selector -->
		<!--  - Search -->
		<input bind:value={search} />
		<!--  - Colour Selector -->
		<!-- <ColourPicker bind:value={colour} /> -->
	</div>
	<div id="recents">
		<!-- Matching Icons -->
		<IconList icons={searchResults} {colour} />
	</div>
	<div id="recents">
		<!-- Recent icons -->
	</div>
	<div id="all">
		<!-- Icons by category (filterable) -->
		{#each catIconIndex as cat, i}
			<div class="category">
				<div class="cat-header">
					<h3
						class="total"
						title="{categories[i].icons.length} icon{categories[i].icons.length != 1 ? 's' : ''}"
					>
						{categories[i].icons.length}
					</h3>
					<h1 class="title">{categories[i].name}</h1>
					{#if search}
						<h3 class="matched">
							{filteredIndices.filter((i) => cat.includes(i)).length} icon{filteredIndices.filter(
								(i) => cat.includes(i)
							).length != 1
								? 's'
								: ''} found
						</h3>
					{/if}
				</div>
				<div class="icons">
					<IconList
						icons={allIcons}
						highlight={search ? filteredIndices : false}
						colour="black"
						show={cat}
					/>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	#toolbar {
		position: sticky;
		top: 0;
		width: 100vw;
		background: white;
		z-index: 10;
		padding: 1.4em 1em;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
		input {
			font-size: 1.1em;
			line-height: 1;
			padding: 0.6em 0.4em;
			display: block;
			font-weight: 400;
			border: 1px solid #ced4da;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
			border-radius: 0.25rem;
			transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
			&:focus {
				color: #212529;
				background-color: #fff;
				border-color: #86b7fe;
				outline: 0;
				box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
			}
		}
	}

	.category {
		.cat-header {
			display: grid;
			grid-template-columns: auto 1fr auto;
			column-gap: 1em;
			align-items: center;
			padding: 0 1em;
			background: #f3f3f3;

			.total {
				background-color: #0000000d;
				padding: 0.4em 0.6em;
				border-radius: 0.3em;
			}

			.matched {
				font-weight: normal;
			}
		}
	}
</style>
