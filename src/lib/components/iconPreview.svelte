<script lang="ts">
	import { slide } from 'svelte/transition';
	export let showPadding: boolean;
	export let iconInBox: boolean;
	export let colour: string;
	export let iconMargin: number;
	export let iconPadding: number;
	export let iconSize: number;
	export let iconOffset: number;
	$: iconSizeFormatted = iconSize == -1 ? '1em' : `${iconSize}px`;
	export let icon = { url: 'General/noun_Box_221801.svg' };
	$: iconUrl = `https://assets.canvasicons.auckland.ac.nz/colour/${icon.url.replace(
		'.svg',
		`.${iconInBox ? 'ffffff' : colour.replace('#', '')}.svg`
	)}`;
</script>

<div
	transition:slide
	class="icon-wrap"
	class:showPadding={showPadding && !iconInBox}
	style="margin: {iconMargin}px; display: inline-block; position: relative; border-radius: 3px; {iconInBox
		? `background: ${colour};`
		: ''} bottom: ${iconOffset +
		0.1}em; vertical-align: middle; width: calc({iconSizeFormatted}); height: calc({iconSizeFormatted});"
>
	<img
		class="icon"
		role="presentation"
		alt=""
		src={iconUrl}
		style="display: block; width: 100%; height: 100%; padding: {iconPadding}%"
		data-decorative="true"
	/>
</div>
