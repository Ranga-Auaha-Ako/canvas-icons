<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import Fuse from 'fuse.js';
	import scrollSpy from 'simple-scrollspy';
	import { page, session } from '$app/stores';
	import Portal from 'svelte-portal/src/Portal.svelte';
	import Slider from '@bulatdashiev/svelte-slider';
	import { focusTrap } from 'svelte-focus-trap';

	// Stylesheet
	import './index.scss';

	// Load Icons

	import categories from '$lib/icons';
	import type { Category, Icon } from '$lib/icons';
	import IconList from '$lib/components/iconList.svelte';
	import IconPreview from '$lib/components/iconPreview.svelte';

	// Load colour picker
	import ColourPicker from '$lib/components/colourPicker.svelte';
	let colour = '#000000';
	// More settings
	let iconPadding = 0;
	let iconSize = -1;
	$: iconSizeFormatted = iconSize == -1 ? 'Auto' : `${iconSize}px`;
	let iconOffset = 0;
	let iconInBox = false;
	let showPadding = false;
	let showSettings = true;
	let iconPreviewPosition: 'h1' | 'h3' | 'p' = 'h1';

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
		const iconUrl = `https://assets.canvasicons.auckland.ac.nz/colour/${e.detail.url.replace(
			'.svg',
			`.${iconInBox ? 'ffffff' : colour.replace('#', '')}.svg`
		)}`;
		const callback = $session.callback;
		const data = $session.data;
		if (iconUrl && data && callback) {
			// Make a request to buildIcon to get the form which will send us back
			window.location.href = `buildIcon.html?${new URLSearchParams({
				'icon-url': iconUrl,
				'icon-alt': iconAlt,
				colour: colour,
				padding: iconPadding.toString(),
				size: iconSize.toString(),
				offset: iconOffset.toString(),
				inBox: iconInBox.toString(),
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
			debugger;
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
		dataLayer.push({ event: 'iconSelect', colour: colour, selectedIcon: e.detail.url });
	};
</script>

<div style="--iconColor: {colour}; --iconPadding: 1rem">
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
		<div id="settings">
			<!--  - Colour Selector -->
			<ColourPicker bind:value={colour} />
			<button
				on:click={() => {
					showSettings = true;
				}}>Icon Settings</button
			>
			<Portal target="body">
				{#if showSettings}
					<div
						class="modal-container"
						aria-labelledby="settings-title"
						style="--iconColor: {colour}; --iconPadding: {iconPadding}px"
						aria-label="Close Settings"
					>
						<div
							transition:fade={{ duration: 150 }}
							class="modal-backdrop"
							on:click={() => {
								showSettings = false;
							}}
						/>
						<div
							transition:fly={{ y: -200, duration: 150 }}
							class="modal settings"
							on:click={(e) => e.stopPropagation()}
							role="document"
							use:focusTrap
						>
							<button
								type="button"
								class="close"
								aria-label="Close dialog"
								on:click={() => {
									showSettings = false;
								}}>&times;</button
							>
							<div class="config">
								<h1 id="settings-title">Advanced Settings</h1>
								<div class="form-control">
									<label for="preview-loc" class="inline">Preview in:</label>
									<span class="btn-row" id="preview-loc">
										<button
											class:active={iconPreviewPosition == 'h1'}
											on:click={() => {
												iconPreviewPosition = 'h1';
											}}><span>H1</span> Title</button
										>
										<button
											class:active={iconPreviewPosition == 'h3'}
											on:click={() => {
												iconPreviewPosition = 'h3';
											}}><span>H3</span> Header</button
										>
										<button
											class:active={iconPreviewPosition == 'p'}
											on:click={() => {
												iconPreviewPosition = 'p';
											}}><span>P</span> Paragraph</button
										>
									</span>
								</div>
								<h2>Spacing &amp; sizing</h2>
								<p class="description">
									Use these controls to set the position and spacing of the icon on the page.
								</p>
								<div
									class="sizing"
									on:mousedown={() => {
										showPadding = true;
										window.addEventListener(
											'mouseup',
											() => {
												showPadding = false;
											},
											{ once: true }
										);
									}}
									on:focusin={() => {
										showPadding = true;
									}}
									on:focusout={() => {
										showPadding = false;
									}}
								>
									<div class="form-control">
										<label for="iconPadding">Icon Padding - {iconPadding}px</label>
										<input type="range" min="0" max="30" step="1" bind:value={iconPadding} />
									</div>
									<div class="form-control">
										<label for="iconSize"
											>Icon Size (adjustable from Canvas) - {iconSizeFormatted}</label
										>
										<button
											class:active={iconSize == -1}
											on:click={(e) => {
												iconSize = iconSize == -1 ? 20 : -1;
											}}>Auto</button
										>
										<input type="range" min="5" max="100" step="2" bind:value={iconSize} />
									</div>
									<div class="form-control">
										<label for="iconOffset">Icon Line offset - {Math.abs(iconOffset)}em</label>
										<input type="range" min="-2" max="2" step="0.1" bind:value={iconOffset} />
									</div>
									<div class="form-control">
										<label for="iconInBox">Put icon in box?</label>
										<input type="checkbox" bind:checked={iconInBox} />
									</div>
								</div>
								<div>
									<ColourPicker bind:value={colour} />
								</div>
							</div>
							<div class="preview">
								<h1>Preview</h1>
								<!-- Some different preview boxes to simulate placement and look -->
								<div class="header-preview canvas-styles" aria-hidden="true">
									<h1>
										{#if iconPreviewPosition == 'h1'}
											<IconPreview
												{showPadding}
												{iconInBox}
												{iconPadding}
												{iconSize}
												{colour}
												{iconOffset}
											/>
										{/if}
										Title goes here (H1)
									</h1>
									<div class="example-grid">
										<p>
											Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
											laboriosam. Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
											quae ab illo.
										</p>
										<div class="example" />
									</div>
									<h3>
										{#if iconPreviewPosition == 'h3'}
											<IconPreview
												{showPadding}
												{iconInBox}
												{iconPadding}
												{iconSize}
												{colour}
												{iconOffset}
											/>
										{/if}
										This is a subheader (H3)
									</h3>
									<p>
										{#if iconPreviewPosition == 'p'}
											<IconPreview
												{showPadding}
												{iconInBox}
												{iconPadding}
												{iconSize}
												{colour}
												{iconOffset}
											/>
										{/if}
										Sit amet dictum sit amet. Sed euismod nisi porta lorem mollis aliquam ut porttitor.
										Ac turpis egestas integer eget aliquet nibh praesent tristique. Auctor urna nunc
										id cursus metus aliquam eleifend. Velit egestas dui id ornare arcu odio ut. Adipiscing
										enim eu turpis egestas pretium aenean pharetra. Ultrices sagittis orci a scelerisque
										purus semper eget duis.
									</p>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</Portal>
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
