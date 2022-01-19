<script lang="ts">
	import { slide } from 'svelte/transition';
	export let showPadding: Boolean;
	export let iconInBox: Boolean;
	export let colour: String;
	export let iconMargin: Number;
	export let iconSize: Number;
	export let iconOffset: Number;
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
		? `background: ${colour}; bottom: ${iconOffset + 0.1}em;`
		: ''} vertical-align: middle;"
>
	<img
		class="icon"
		role="presentation"
		alt=""
		src={iconUrl}
		style="display: block; position: relative; {iconInBox ? '' : `bottom: ${iconOffset}em;`}
        width: calc({iconSizeFormatted}); height: calc({iconSizeFormatted});"
		data-decorative="true"
	/>
</div>
