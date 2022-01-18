<script lang="ts">
	export let showPadding: Boolean;
	export let iconInBox: Boolean;
	export let colour: String;
	export let iconPadding: Number;
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
	class="icon-wrap"
	class:showPadding={showPadding && !iconInBox}
	style="padding: {iconPadding}px; display: inline-block; position: relative; border-radius: 3px; {iconInBox
		? `background: ${colour}; bottom: ${iconOffset}em;`
		: ''} vertical-align: middle;"
>
	<img
		class="icon"
		role="presentation"
		alt=""
		src={iconUrl}
		style="display: block; position: relative; {iconInBox ? '' : `bottom: ${iconOffset}em;`}
        width: calc({iconSizeFormatted} - {iconPadding}px * 2); height: calc({iconSizeFormatted} - {iconPadding}px * 2);"
		data-decorative="true"
	/>
</div>
