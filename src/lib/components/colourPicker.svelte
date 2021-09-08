<script lang="ts">
	export let value: string = '';
	export const options = [
		{ code: '#00467F', name: 'Dark blue' },
		{ code: '#000000', name: 'Black' },
		{ code: '#4A4A4C', name: 'Body Grey' },
		{ code: '#8D9091', name: 'Silver' },
		{ code: '#A71930', name: 'Arts' },
		{ code: '#7D0063', name: 'Business School' },
		{ code: '#D2492A', name: 'Creative Arts and Industries' },
		{ code: '#55A51C', name: 'Education and Social Work' },
		{ code: '#4F2D7F', name: 'Engineering' },
		{ code: '#005B82', name: 'Auckland Law School' },
		{ code: '#00877C', name: 'Medical Health Sciences' },
		{ code: '#0039A6', name: 'Science' },
		{ code: '#BA4482', name: 'Auckland Bioengineering Institute' },
		{ code: '#006990', name: 'Liggins Institute' }
	];

	const select = (c: string) => {
		value = c;
		edit = false;
	};

	let edit = false;
</script>

<div class="container">
	<label for="colourPicker"> Colour: </label>
	<button
		id="activeColour"
		on:click={(e) => (edit = !edit)}
		class="colour"
		title="Click to change"
		style="background-color: {value};"
	/>
	<div id="colourPicker" class:edit>
		{#each options as option}
			<button
				class="colour colour-option"
				title={option.name}
				style="background-color: {option.code};"
				class:selected={value == option.code}
				on:click={(e) => select(option.code)}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	button {
		border-width: 0;
		display: block;
		font-size: 1em;
	}
	.container {
		--size: 1.7em;
		display: flex;
		align-content: center;
		align-items: center;
		position: relative;
		justify-content: flex-end;

		label {
			padding-right: 0.5em;
		}
		.colour {
			border-radius: 3px;
			width: var(--size);
			height: var(--size);
			cursor: pointer;
		}
		#activeColour {
			display: inline-block;
		}

		#colourPicker {
			position: absolute;
			display: flex;
			flex-wrap: wrap;
			width: calc(var(--size) * 4 + 0.3em * 3 + 0.9em * 2);
			top: 100%;
			right: 0;
			margin: 0.5em;
			margin-right: 0;
			padding: 0.9em;
			pointer-events: none;
			opacity: 0;
			background: white;
			row-gap: 0.3em;
			column-gap: 0.3em;
			box-shadow: 0 2px 4px #00000021;
			border-radius: 6px;
			visibility: hidden;
			transition: 0.25s ease all;
			transform: translateY(-6px);
			&.edit {
				transform: translateY(0);
				visibility: visible;
				opacity: 1;
				pointer-events: all;
			}
			.colour-option {
				z-index: 1;
				// border-style: solid;
				// border-width: 2px;
				// border-color: rgba(255, 255, 255, 0.5);
				box-shadow: 0 2px 4px #00000021;
				&.selected {
					z-index: 10;
				}
			}
		}
	}
</style>
