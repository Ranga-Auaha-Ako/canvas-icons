<script lang="ts">
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import scrollSpy from 'simple-scrollspy';

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
	let search = '';
	let searching = false;
	$: filteredIcons = fuse.search(search);
	$: filteredIndices = filteredIcons.map((i) => i.refIndex);
	$: searchResults = filteredIcons.slice(0, 15).map((i) => i.item);

	let colour = 'black';

	// Scrollspy, so that the active category is highlighted
	onMount(async () => {
		scrollSpy(document.getElementById('shortcuts'), {
			sectionClass: '.category',
			menuActiveTarget: '.cat-shortcut',
			offset: 200
		});
	});
</script>

<div style="--iconColor: {colour}">
	<div id="toolbar">
		<div id="filter">
			<!-- Toolbar with search and colour selector -->
			<!--  - Search -->
			<input bind:value={search} on:focus={(_) => (searching = true)} />
			<div class="more" class:searching>
				{#if search}
					<!--  - Top matching icons -->
					<IconList icons={searchResults} {colour} />
				{:else}
					<p class="no-results">[Type to see relevant icons here]</p>
				{/if}
			</div>
		</div>
		<div id="shortcuts">
			<!--  - Category Shortcuts -->
			{#each categories as cat, i}
				<a
					class="cat-shortcut"
					href="#cat-{i}-{cat.name.toLowerCase()}"
					on:click={(_) =>
						setTimeout(() => {
							searching = false;
						}, 100)}>{cat.name}</a
				>
			{/each}
			<!--  - Colour Selector -->
			<!-- <ColourPicker bind:value={colour} /> -->
		</div>
	</div>
	<!-- We don't want to accidentally select an icon when escaping search -->
	<div class="shadowbox" class:searching on:click={(_) => (searching = false)} />
	<!-- Full icon list -->
	<div id="all">
		<!-- Icons by category (filterable) -->
		{#each catIconIndex as cat, i}
			<section class="category" id="cat-{i}-{categories[i].name.toLowerCase()}">
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
								: ''} filtered
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
			</section>
		{/each}
	</div>
</div>

<style lang="scss">
	#toolbar {
		position: sticky;
		z-index: 20;
		top: 0;
		background: white;
		z-index: 10;
		padding: 1.5em 1em;
		display: grid;
		grid-template:
			'filter		filter' auto
			'shortcuts	colour' auto;
		row-gap: 0.5em;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

		#filter {
			grid-area: filter;

			.more {
				height: 0;
				will-change: height;
				transition: 0.3s ease height;
				overflow: hidden;
				&.searching {
					height: 5em;
				}

				.no-results {
					text-align: center;
					height: 5em;
					line-height: 2em;
					margin: 1.5em;
					opacity: 0.5;
					user-select: none;
				}
			}

			input {
				width: 100%;
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

		#shortcuts {
			grid-area: shortcuts;
			display: flex;
			flex-wrap: wrap;
			column-gap: 0.4em;
			row-gap: 0.4em;
			font-size: 0.8em;
			.cat-shortcut {
				color: black;
				text-decoration: none;
				display: block;
				padding: 0.5em 0.5em;
				line-height: 1;
				background-color: #e7e7e7;
				will-change: background-color;
				transition: 0.5s ease background-color;
				border-radius: 6px;
				&:global(.active) {
					background-color: rgb(139, 212, 157);
				}
			}
		}
	}

	.shadowbox {
		position: fixed;
		left: 0;
		width: 100%;
		height: 100%;
		background: #00000012;
		z-index: 10;
		visibility: hidden;
		&.searching {
			visibility: visible;
		}
	}

	.category {
		margin-top: -8em;
		padding-top: 8em;
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
