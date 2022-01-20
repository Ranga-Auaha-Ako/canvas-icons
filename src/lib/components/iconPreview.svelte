<script lang="ts">
	import { slide } from 'svelte/transition';
	export let showMargin: boolean;
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

<picture
	transition:slide
	class="icon-wrap"
	class:showMargin
	class:iconInBox
	style="
	line-height: 0;
	margin: {iconMargin}px;
	display: inline-block;
	position:relative;
	border-radius: 3px;
	{iconInBox ? ` background: ${colour};` : ''}
	top: {iconOffset * -1}em;
	width: {iconSizeFormatted};
	height: {iconSizeFormatted};
	box-sizing: border-box;
	vertical-align: middle"
	role="presentation"
	alt=""
	data-decorative="true"
>
	<img
		src={iconUrl}
		style="
		display: block;
		width: calc({iconSizeFormatted} - {iconInBox ? iconPadding * 2 : 0}%);
		height: calc({iconSizeFormatted} - {iconInBox ? iconPadding * 2 : 0}%);
		margin: {iconInBox ? iconPadding : 0}%;
		"
		alt=""
	/>
</picture>
