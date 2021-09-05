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
			hrefAttribute: 'data-href',
			offset: 200
		});
	});

	const goToCategory = (cat, i) => {
		searching = false;
		// Get first child and focus!
		document.querySelector(`#cat-${i}-${cat.name.toLowerCase()} .icon`).focus();
		setTimeout(() => {
			window.scroll({
				top: document.querySelector(`#cat-${i}-${cat.name.toLowerCase()}`).offsetTop,
				left: 0,
				behavior: 'smooth'
			});
		}, 300);
	};
</script>

<div style="--iconColor: {colour}">
	<nav id="toolbar">
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
				<button
					class="cat-shortcut"
					data-href="#cat-{i}-{cat.name.toLowerCase()}"
					tabindex="0"
					on:click={(e) => goToCategory(cat, i)}
				>
					{cat.name}
					{#if search}
						({filteredIndices.filter((icon) => catIconIndex[i].includes(icon)).length})
					{/if}
				</button>
			{/each}
			<!--  - Colour Selector -->
			<!-- <ColourPicker bind:value={colour} /> -->
		</div>
	</nav>
	<!-- We don't want to accidentally select an icon when escaping search -->
	<div class="shadowbox" class:searching on:click={(_) => (searching = false)} />
	<!-- Full icon list -->
	<main id="all">
		<!-- Icons by category (filterable) -->
		{#each catIconIndex as cat, i}
			<section
				aria-label="{categories[i].name} ({categories[i].icons.length} icon{categories[i].icons
					.length != 1
					? 's'
					: ''})"
				class="category"
				id="cat-{i}-{categories[i].name.toLowerCase()}"
			>
				<div class="cat-header">
					<a class="skip-to-nav-link" href="#toolbar"> Return to navigation </a>
					<h3
						class="total"
						title="{categories[i].icons.length} icon{categories[i].icons.length != 1 ? 's' : ''}"
					>
						{categories[i].icons.length}
					</h3>
					<h1 class="title">{categories[i].name}</h1>
					{#if search}
						<h3 class="matched">
							{filteredIndices.filter((icon) => cat.includes(icon)).length} icon{filteredIndices.filter(
								(icon) => cat.includes(icon)
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
	</main>
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
				appearance: none;
				-webkit-appearance: none;
				border: 0;
				color: black;
				text-decoration: none;
				display: block;
				padding: 0.5em 0.5em;
				line-height: 1;
				background-color: #e7e7e7;
				will-change: background-color;
				transition: 0.5s ease background-color;
				border-radius: 6px;
				cursor: pointer;
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

	// https://css-tricks.com/how-to-create-a-skip-to-content-link/
	.skip-to-nav-link {
		background: #e77e23;
		color: white;
		text-decoration: none;
		line-height: 1;
		height: 1.8em;
		left: 0%;
		padding: 0.4em;
		border-top-right-radius: 0.4em;
		border-bottom-right-radius: 0.4em;
		position: absolute;
		transform: translateX(-100%);
		transition: transform 0.3s;
	}

	.skip-to-nav-link:focus {
		transform: translateX(0%);
	}
</style>
