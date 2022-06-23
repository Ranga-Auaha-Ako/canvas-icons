<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import Fuse from 'fuse.js';
	import scrollSpy from 'simple-scrollspy';
	import { session } from '$app/stores';

	// Stylesheet
	import './index.scss';

	// Load Icons
	// import categories from '$lib/icons';
	import type { Category, Icon } from '$lib/icons';
	import { getIconUrl } from '$lib/icons';
	import IconList from '$lib/components/iconList.svelte';

	// Load colour picker
	import ColourPicker from '$lib/components/colourPicker.svelte';

	// Config
	import {
		colour,
		iconMargin,
		iconPadding,
		iconSize,
		iconOffset,
		iconInBox,
		showMargin,
		showSettings,
		iconPreviewPosition,
		recentIcons
	} from './store';
	import AdvancedSettings from '$lib/components/advancedSettings.svelte';

	let categories = [] as Category[];

	// Convert to list of icons and list of categories with icon indices
	let i = 0;
	$: allIcons = <Icon[]>categories.reduce((acc, cv) => acc.concat(cv.icons), []);
	// Get the recent icons that we can find
	$: recentIconsList = $recentIcons.reduce((iconList, id) => {
		const matchedIcons = allIcons.filter((i) => i.id == id);
		if (matchedIcons.length === 1) iconList.push(matchedIcons[0]);
		return iconList;
	}, []);

	let numIcons = 0;
	let catIconIndex = [];

	// Initiate Search
	$: fuse = new Fuse(allIcons, {
		keys: [
			{ name: 'title', weight: 0.3 },
			{ name: 'term', weight: 0.3 },
			{ name: 'tags', weight: 0.3 },
			{ name: 'collections', weight: 0.1 }
		],
		shouldSort: true,
		minMatchCharLength: 2,
		includeScore: true,
		threshold: 0.25
	});
	let search = '';
	let searching = false;
	$: filteredIcons = fuse.search(search);
	$: filteredIndices = filteredIcons.map((i) => i.refIndex);
	$: searchResults = filteredIcons
		.filter((i) => i.score < 0.25)
		.slice(0, 15)
		.map((i) => ({
			...i.item,
			term: i.item.title || i.item.term
		}));

	// Scrollspy, so that the active category is highlighted
	onMount(async () => {
		scrollSpy(document.getElementById('shortcuts'), {
			sectionClass: '.category',
			menuActiveTarget: '.cat-shortcut',
			hrefAttribute: 'data-href',
			offset: 200
		});
		const urlSearchParams = new URLSearchParams(window.location.search);
		// Fetch category data from library CDN
		const iconData = await fetch(`${import.meta.env.VITE_ASSET_HOST}/meta.json`).then((res) => {
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res.json() as Promise<Category[]>;
		});
		categories = iconData;
		for (let i = 0; i < categories.length; i++) {
			const cat = categories[i];
			const iconIndexes = Array.from({ length: cat.icons.length }, (_, i) => i + numIcons);
			catIconIndex.push(iconIndexes);
			numIcons += iconIndexes.length;
		}
	});

	const goToCategory = (cat, i) => {
		searching = false;
		// Get first child and focus!
		(document.querySelector(`#cat-${i}-${cat.name.toLowerCase()} .icon`) as HTMLElement)?.focus({
			preventScroll: true
		});
		setTimeout(() => {
			window.scroll({
				top: (document.querySelector(`#cat-${i}-${cat.name.toLowerCase()}`) as HTMLElement)
					?.offsetTop,
				left: 0,
				behavior: 'smooth'
			});
		}, 150);
	};

	// Handle clicking on an icon
	const selectIcon = (e) => {
		const iconAlt = e.detail.alt;
		const iconUrl = getIconUrl(e.detail.url, $colour, $iconInBox);
		// Filter recent icons to only valid ones (removing any dead icon IDs)
		let filteredRecents = allIcons.filter((icon) => $recentIcons.includes(icon.id));
		// Add this icon to the top of the listlist
		filteredRecents.unshift(e.detail.id);
		// Update with max length 10 and duplicates removed
		recentIcons.update((_) => [...new Set(filteredRecents)].slice(0, 20));

		const callback = $session.callback;
		const data = $session.data;
		if (iconUrl && data && callback) {
			// Make a request to buildIcon to get the form which will send us back
			window.location.href = `buildIcon.html?${new URLSearchParams({
				'icon-url': iconUrl,
				'icon-alt': iconAlt,
				colour: $colour,
				margin: $iconMargin.toString(),
				padding: $iconPadding.toString(),
				size: $iconSize.toString(),
				offset: ($iconOffset + 0.1).toString(), // additional offset to better align with actual text position
				inBox: $iconInBox.toString(),
				callback: callback,
				data
			}).toString()}`;
		} else {
			console.error(
				'Missing information! This is likely due to data not being picked up on load. We only have: ',
				[iconUrl, data, callback]
			);
			console.log(
				"This can happen because you loaded the app in the web browser rather than through canvas. Let's make it work!"
			);
			fetch(iconUrl)
				.then((resp) => resp.blob())
				.then((blob) => {
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.style.display = 'none';
					a.href = url;
					// the filename you want
					a.download = `canvas-${iconAlt.toLowerCase().replace(/\s/g, '-')}.svg`;
					document.body.appendChild(a);
					a.click();
					window.URL.revokeObjectURL(url);
				});
			// Send to Google Analytics
		}
		// @ts-expect-error
		dataLayer.push({ event: 'iconSelect', colour: $colour, selectedIcon: e.detail.url });
	};
</script>

<svelte:head>
	<!-- Inject lato font for Canvas preview -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div style="--iconColor: {$colour}; --iconMargin: 1rem">
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
					<IconList on:selectIcon={selectIcon} icons={searchResults} colour={$colour} />
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
		<div id="settings">
			<!--  - Colour Selector -->
			<ColourPicker bind:value={$colour} />
			<button
				class="btn"
				on:click={() => {
					$showSettings = true;
				}}>Advanced Settings</button
			>
			<AdvancedSettings />
		</div>
	</nav>
	<!-- We don't want to accidentally select an icon when escaping search -->
	<div class="shadowbox" class:searching on:click={(_) => (searching = false)} />
	<!-- Full icon list -->
	<main id="all">
		<!-- Recent icons category -->
		{#if $recentIcons.length > 0}
			<section
				aria-label="Recent Icons ({recentIconsList.length} icon{recentIconsList.length != 1
					? 's'
					: ''})"
				class="category"
				id="cat-{i}-recentIcons"
			>
				<div class="cat-header">
					<a class="skip-to-nav-link" href="#toolbar"> Return to navigation </a>
					<h3
						class="total"
						title="{recentIconsList.length} icon{recentIconsList.length != 1 ? 's' : ''}"
					>
						{recentIconsList.length}
					</h3>
					<h1 class="title">Recent Icons</h1>
				</div>
				<div class="icons">
					<IconList
						on:selectIcon={selectIcon}
						icons={recentIconsList}
						highlight={false}
						colour={$colour}
					/>
				</div>
			</section>
		{/if}
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
						colour={$colour}
						show={cat}
					/>
				</div>
			</section>
		{/each}
	</main>
	<!-- Footer -->
	<footer>
		<p>
			Canvas Icons <strong>v{$session.version}</strong>.
			<a target="_blank" href="https://github.com/Ranga-Auaha-Ako/canvas-icons/">
				Source & Contribute</a
			>
		</p>
	</footer>
</div>
