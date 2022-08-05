<script lang="ts">
	import { slide } from 'svelte/transition';
	export let showMargin: boolean;
	export let iconInBox: boolean;
	export let colour: string;
	export let iconMargin: number;
	export let iconPadding: number;
	export let iconSize: number;
	export let iconOffset: number;
	$: iconSizeFormatted =
		iconSize == -1 ? `calc(1em + ${iconPadding * 2}px)` : `${iconSize + iconPadding * 2}px`;
	export let icon = { url: 'General/noun_Box_221801.svg' };
	$: iconUrl = `https://assets.canvasicons.auckland.ac.nz/colour/${icon.url.replace(
		'.svg',
		`.${iconInBox ? 'ffffff' : colour.replace('#', '')}.svg`
	)}`;
</script>

&ZeroWidthSpace;
<img
	src={iconUrl}
	style="
	display: inline-block;
	border-radius: 3px;
	position: relative;
	top: {iconOffset * -1}em;
	background: {iconInBox ? colour : '#fff'};
	width: {iconSizeFormatted};
	height: {iconSizeFormatted};
	margin: {iconMargin}px;
	padding: {iconInBox ? iconPadding : 0}px;
	"
	class:showMargin
	role="presentation"
	alt=""
	data-decorative="true"
/>
&ZeroWidthSpace;

<style>
	img {
		max-width: 100%;
		height: auto;
		vertical-align: middle;
		border: 0;
		-ms-interpolation-mode: bicubic;
	}
</style>
