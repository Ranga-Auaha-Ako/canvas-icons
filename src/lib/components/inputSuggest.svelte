<script lang="ts">
	import Fuse from 'fuse.js';
	import { ListGroupItem } from 'sveltestrap';
	import { ListGroup } from 'sveltestrap';
	import { Input } from 'sveltestrap';

	export let value = '';
	export let id: string;
	export let required = false;
	export let suggestions: string[];
	export let placeholder: string;

	const fuse = new Fuse(suggestions, {
		shouldSort: true,
		minMatchCharLength: 3,
		threshold: 0.25
	});

	$: matches = fuse.search(value);
	// const refreshSearch = () => {
	// 	matches = fuse.search(value);
	// 	console.log(matches);
	// };

	let editing = false;
	let searchElem: HTMLInputElement;
	const myFunction = () => console.log('this will be displayed if I click outside the button');
</script>

<div
	class="inputSuggest"
	on:focusin={(_) => {
		editing = true;
	}}
	on:focusout={() => {
		setTimeout(() => {
			// debugger;
			editing = false;
		}, 300);
	}}
>
	<Input
		bind:value
		type="search"
		{id}
		{placeholder}
		bind:inner={searchElem}
		on:input={() => {
			editing = true;
		}}
		invalid={required !== false && value == ''}
	/>
	<output class="searchResults" for={id}>
		{#if editing && !(matches.length == 1 && matches[0].item !== value)}
			<ListGroup class="searchResults">
				{#each matches as m}
					<ListGroupItem
						tabindex="0"
						tag="button"
						active={m.item == value}
						on:click={() => {
							value = m.item;
							searchElem.focus();
							// editing = false;
						}}
						action>{m.item}</ListGroupItem
					>
				{/each}
			</ListGroup>
		{/if}
	</output>
</div>

<style lang="scss">
	.searchResults {
		max-height: 13rem;
		overflow-y: auto;
	}
</style>
