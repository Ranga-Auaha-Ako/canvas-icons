<!-- @hmr:keep-all -->
<script lang="ts">
	import { Input, Label, FormGroup } from 'sveltestrap';
	import Tags from 'svelte-tags-input';
	import InputSuggest from '../inputSuggest.svelte';

	export let icon;
	export let existingCollections;
	export let existingTags;
	export let iconFileList;
</script>

<div>
	<FormGroup>
		<Label for="iconTitle">Icon Title</Label>
		<Input
			id="iconTitle"
			bind:value={icon.title}
			invalid={icon.title == ''}
			placeholder="What should the accessible name of the icon be?"
		/>
	</FormGroup>
	<FormGroup>
		<Label for="iconTerm">Icon "Term" (from The Noun Project)</Label>
		<Input
			id="iconTerm"
			bind:value={icon.term}
			placeholder="If the icon is from TNP, add the term here"
		/>
	</FormGroup>
	<FormGroup>
		<Label for="iconPath">Icon Path</Label>
		<InputSuggest
			id="iconPath"
			bind:value={icon.url}
			suggestions={iconFileList}
			placeholder="Path to SVG file, for example 'Teaching/noun_Network_3565311.svg'"
			required
		/>
	</FormGroup>
	<FormGroup>
		<Label for="iconTnp_id">The Noun Project source ID</Label>
		<Input id="iconTnp_id" bind:value={icon.tnp_id} invalid={!/^\d+$|^$/.test(icon.tnp_id)} />
	</FormGroup>
	<FormGroup>
		<Label for="iconTags">Icon Tags</Label>
		<Tags
			id="iconTags"
			addKeys={[9, 188, 13]}
			tags={icon.tags}
			allowPaste={true}
			onlyUnique={true}
			autoComplete={existingTags}
		/>
	</FormGroup>
	<FormGroup>
		<Label for="iconCollections">The Noun Project "Collections"</Label>
		<Tags
			id="iconCollections"
			addKeys={[9, 188, 13]}
			tags={icon.collections}
			allowPaste={true}
			onlyUnique={true}
			autoComplete={existingCollections}
		/>
	</FormGroup>
</div>
