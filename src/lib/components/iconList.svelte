<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { titleCase } from 'title-case';
	import type { Icon } from '../icons';
	import { page } from '$app/stores';
	// import '../../../static/icon-sprite/css/sprite.css';

	export let icons: any[];
	export let colour: string;
	export let highlight: Number[] | false = false;
	export let show: Number[] | false = false;
	export let showPadding: Boolean = false;

	// The icon CSS class name is generated based on the path. Find that out here:
	import { getIconClass } from '$lib/icons';

	const dispatch = createEventDispatcher();
</script>

<div
	role="list"
	class="iconList"
	class:filtered={highlight !== false}
	class:showPadding
	style="--iconColor: {colour}"
>
	<!-- Recent icons -->
	{#each icons as icon, i}
		{#if show === false || show.includes(i)}
			<button
				id={`${i}-${getIconClass(icon.url)}`}
				class="icon"
				class:match={highlight !== false && highlight.includes(i)}
				title={titleCase(icon.term || icon.title || 'Icon')}
				tabindex="0"
				on:click={() =>
					dispatch('selectIcon', {
						url: icon.url,
						alt: titleCase(icon.term ? icon.term : icon.title),
						id: icon.id
					})}
			>
				<!-- <div
					class="img"
					style="
					background-image: url('/icons/{colour}/iconStack.svg#{getIconClass(icon.url)}');
					"
				/> -->
				<svg class="img" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color={colour}>
					<use xlink:href="/icons/iconDefs.svg#{getIconClass(icon.url)}" />
					<!-- <use
						xlink:href="{$page.data.assetHost}/font/defs/svg/sprite.defs.svg#{getIconClass(icon.url)}"
					/> -->
				</svg>
				<!-- <img alt={icon.title} src="/icons/{colour}/iconStack.svg#{getIconClass(icon.url)}" /> -->
			</button>
		{/if}
	{/each}
</div>
<div id="" />

<style lang="scss">
	.iconList {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5em, 1fr));
		grid-auto-rows: 5em;
		&.filtered .icon {
			opacity: 0.5;
		}
		.icon {
			appearance: none;
			-webkit-appearance: none;
			background-color: transparent;
			display: inline-block;
			margin: 0;
			padding: var(--iconMargin);
			cursor: pointer;
			transition:
				0.2s ease-out transform,
				0.2s ease-out box-shadow,
				0.2s ease-out border-color,
				0.5s ease-out opacity,
				0.1s ease background-color;
			will-change: transform, box-shadow, border-color;
			transform: scale(1);
			border-radius: 6px;
			border: 2px dashed rgba(0, 0, 0, 0);

			&:hover {
				transform: scale(1.1);
				box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
				background-color: white;
				opacity: 1;
			}

			&.match {
				border-color: rgba(0, 0, 0, 1);
				opacity: 1;
			}

			.img {
				width: 100%;
				height: 100%;
				background-size: contain;
				// background-color: var(--iconColor);
				// mask-size: contain;
				// mask-repeat: no-repeat;
				// mask-position: center;
				// -webkit-mask-size: contain;
				// -webkit-mask-repeat: no-repeat;
				// -webkit-mask-position: center;
				// Disabled to prevent visual glitch on some systems (icons become blocks during transition)
				transition: color 0.5s ease;
			}
		}
	}
</style>
