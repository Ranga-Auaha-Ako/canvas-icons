<script lang="ts">
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import scrollSpy from 'simple-scrollspy';
	import { page, session } from '$app/stores';

	// Stylesheet
	import './index.scss';

	// Load Icons

	import categories from '$lib/icons';
	import type { Category, Icon } from '$lib/icons';
	import IconList from '$lib/components/iconList.svelte';

	// Load colour picker
	import ColourPicker from '$lib/components/colourPicker.svelte';
	let colour = '#000000';

	// Convert to list of icons and list of categories with icon indices
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

	// Scrollspy, so that the active category is highlighted
	onMount(async () => {
		scrollSpy(document.getElementById('shortcuts'), {
			sectionClass: '.category',
			menuActiveTarget: '.cat-shortcut',
			hrefAttribute: 'data-href',
			offset: 200
		});
		const urlSearchParams = new URLSearchParams(window.location.search);
	});

	const goToCategory = (cat, i) => {
		searching = false;
		// Get first child and focus!
		document.querySelector(`#cat-${i}-${cat.name.toLowerCase()} .icon`).focus({
			preventScroll: true
		});
		setTimeout(() => {
			window.scroll({
				top: document.querySelector(`#cat-${i}-${cat.name.toLowerCase()}`).offsetTop,
				left: 0,
				behavior: 'smooth'
			});
		}, 150);
	};

	// Handle clicking on an icon
	const selectIcon = (e) => {
		const iconAlt = e.detail.alt;
		const iconUrl = `https://flexiblelearning.auckland.ac.nz/icon-set/noun-project-icons/${
			e.detail.url
		}?color=${colour.replace('#', '')}`;
		const callback = $session.callback;
		const data = $session.data;
		if (!iconUrl || !data || !callback) {
			console.error(
				'Missing information! This is likely due to data not being picked up on load. We only have: ',
				[iconUrl, data, callback]
			);
			debugger;
		}
		// Make a request to buildIcon to get the form which will send us back
		window.location.href = `buildIcon.html?${new URLSearchParams({
			'icon-url': iconUrl,
			'icon-alt': iconAlt,
			callback: callback,
			data
		}).toString()}`;
	};
</script>

<div style="--iconColor: {colour}">
	<nav id="toolbar">
		<div id="filter">
			<!-- Toolbar with search and colour selector -->
			<!--  - Search -->
			<input
				type="search"
				bind:value={search}
				on:focus={(_) => (searching = true)}
				placeholder="Kia ora{$session.user && $session.user.name
					? ` ${$session.user.name}`
					: ''}, type to start searching..."
			/>
			<div class="more" class:searching>
				{#if searchResults.length > 0}
					<!--  - Top matching icons -->
					<IconList on:selectIcon={selectIcon} icons={searchResults} {colour} />
				{:else if search}
					<p class="no-results">[No icons found! Try another search]</p>
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
		</div>
		<div id="colour-picker">
			<!--  - Colour Selector -->
			<ColourPicker bind:value={colour} />
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
						on:selectIcon={selectIcon}
						icons={allIcons}
						highlight={search ? filteredIndices : false}
						{colour}
						show={cat}
					/>
				</div>
			</section>
		{/each}
	</main>
</div>
