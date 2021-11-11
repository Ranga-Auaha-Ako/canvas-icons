<script lang="ts">
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import scrollSpy from 'simple-scrollspy';
	import { page, session } from '$app/stores';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import rfdc from 'rfdc';
	import { nanoid } from 'nanoid';
	// import NounProject from 'the-noun-project';

	// Bootstrap components
	import {
		Button,
		Modal,
		ModalHeader,
		ModalBody,
		TabContent,
		TabPane,
		Col,
		Container,
		Row,
		FormGroup,
		Label,
		Input,
		Accordion,
		AccordionItem,
		Card,
		CardBody,
		CardHeader,
		CardTitle,
		Figure,
		Image
	} from 'sveltestrap';
	// Svelte Tags input
	import Tags from 'svelte-tags-input';

	// Stylesheet
	import '../index.scss';
	//  - Overrides for editor
	import './index.scss';

	// Load Icons
	import categories from '$lib/icons';
	import type { Category, Icon } from '$lib/icons';
	import { getIconClass } from '$lib/icons';
	import InputSuggest from '$lib/components/inputSuggest.svelte';

	// Load list of icon files
	const iconFileListImport = import.meta.glob('/static/icons/**/*.svg');
	const iconFileList = Object.keys(iconFileListImport).map((f) =>
		f.replace(/^(\/?static\/icons\/)/, '')
	);

	// Colour
	let colour = '#000000';

	// Make a copy of the categories for modification
	const clone = rfdc();
	let unsavedStateCategories: Category[] = clone(categories);
	let currentCategory = unsavedStateCategories[0];

	// Load list of tags
	let existingTags = [];
	let existingCollections = [];
	const updateTagData = () => {
		existingTags = [
			// Only unique values
			...new Set(
				unsavedStateCategories.reduce(
					(acc, cat) =>
						// Step through categories, reducing each icon to a list of tags and bunching together
						acc.concat(cat.icons.reduce((acc, i) => (i.tags ? acc.concat(i.tags) : acc), [])),
					[]
				)
			)
		];
		// Load list of collections
		existingCollections = [
			// Only unique values
			...new Set(
				unsavedStateCategories.reduce(
					(acc, cat) =>
						// Step through categories, reducing each icon to a list of tags and bunching together
						acc.concat(
							cat.icons.reduce((acc, i) => (i.collections ? acc.concat(i.collections) : acc), [])
						),
					[]
				)
			)
		];
	};
	updateTagData();

	// Whether we're adding an icon or editing it
	let editIcon = null;
	const getIcon = (id) => currentCategory.icons.find((e) => e.id == id);
	$: editingIcon = currentCategory.icons.find((e) => e.id == editIcon);

	// Handle movement of Drag&Drop icons, animation
	const flipDurationMs = 300;
	function handleSort(e) {
		console.log('Dragging...');
		console.log(e);
		currentCategory.icons = e.detail.items;
	}

	let tnpImport = {
		key: '',
		secret: '',
		iconID: ''
	};

	const importIcon = () => {
		// const nounProject = new NounProject({ key: tnpImport.key, secret: tnpImport.secret });
	};

	const removeIcon = (i) => {
		currentCategory.icons = currentCategory.icons.filter((e, id) => i !== id);
	};

	const cloneIcon = (i) => {
		let clonedIcon = clone(currentCategory.icons[i]);
		clonedIcon.id = nanoid();
		currentCategory.icons = [
			...currentCategory.icons.slice(0, i + 1),
			clonedIcon,
			...currentCategory.icons.slice(i + 1)
		];
	};
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	/>
</svelte:head>

<div style="--iconColor: {colour}">
	<!-- Iframe to show main app -->
	<a href="../" class="home" aria-label="Return home">
		<!-- <iframe
			src="../"
			title="Frame containing teacher user interface"
			scrolling="no"
			aria-hidden="true"
		/> -->
		<div class="shadow" />
	</a>
	<!-- Container for editor -->
	<Modal isOpen={true} size="xl">
		<ModalHeader>Configuration Editor</ModalHeader>
		<ModalBody>
			<p>
				Welcome to the Canvas Icon configuration editor. You can use this to add, edit, and remove
				icons from the interface. <strong
					>Keep in mind that you will need to submit a pull request to the Canvas Icons repository
					available <a href="https://github.com/Ranga-Auaha-Ako/canvas-icons/" target="_blank">
						on GitHub (Ranga-Auaha-Ako/canvas-icons)</a
					></strong
				>. If you're not sure what that is, we reccomend you take a look before editing here.
			</p>
			<Row>
				<Col>
					<FormGroup>
						<Label for="categorySelect">Category</Label>
						<Input type="select" id="categorySelect" bind:value={currentCategory}>
							{#each unsavedStateCategories as cat}
								<option value={cat}>{cat.name}</option>
							{/each}
						</Input>
					</FormGroup>
					<div class="iconList">
						<div
							class="icons"
							use:dndzone={{ items: currentCategory.icons, flipDurationMs }}
							on:consider={handleSort}
							on:finalize={handleSort}
						>
							{#each currentCategory.icons as icon, i (icon.id)}
								<div
									class="icon"
									class:editing={editIcon == icon.id}
									animate:flip={{ duration: flipDurationMs }}
									on:click={(e) => (editIcon = editIcon == icon.id ? null : icon.id)}
									title={icon.term}
								>
									{#if editIcon == icon.id}
										<div class="editTools">
											<div role="button" class="delete" on:click={(_) => removeIcon(i)}>Delete</div>
											<div role="button" class="clone" on:click={(_) => cloneIcon(i)}>Clone</div>
										</div>
									{/if}
									<img
										src="/icon-sprite/stack/svg/sprite.stack.svg#{getIconClass(icon.url)}"
										alt={icon.title}
									/>
								</div>
							{/each}
						</div>
					</div>
				</Col>
				<Col>
					<div class="editCard">
						<Card class="mb-3">
							<CardHeader>
								<CardTitle>Edit {!editingIcon ? 'Icon' : `"${editingIcon.term}" Icon`}</CardTitle>
							</CardHeader>
							<CardBody>
								<div class="editPane">
									{#if !editingIcon}
										<div class="none">To begin, select an icon.</div>
									{:else}
										<FormGroup>
											<Label for="iconTitle">Icon Title</Label>
											<Input
												id="iconTitle"
												bind:value={editingIcon.title}
												invalid={editingIcon.title == ''}
											/>
										</FormGroup>
										<FormGroup>
											<Label for="iconTerm">Icon "Term" (from The Noun Project)</Label>
											<Input id="iconTerm" bind:value={editingIcon.term} />
										</FormGroup>
										<FormGroup>
											<Label for="iconTerm">Icon "Collections" (from The Noun Project)</Label>
											<Input id="iconTerm" bind:value={editingIcon.collections} />
										</FormGroup>
										<FormGroup>
											<Label for="iconPath">Icon Path</Label>
											<InputSuggest
												id="iconPath"
												bind:value={editingIcon.url}
												suggestions={iconFileList}
												required
											/>
										</FormGroup>
										<FormGroup>
											<Label for="iconTnp_id">The Noun Project source ID</Label>
											<Input
												id="iconTnp_id"
												bind:value={editingIcon.tnp_id}
												invalid={!/^\d+$/.test(editingIcon.tnp_id)}
											/>
										</FormGroup>
										<FormGroup>
											<Label for="iconTags">Icon Tags</Label>
											<Tags
												id="iconTags"
												addKeys={[9, 188, 13]}
												tags={editingIcon.tags}
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
												tags={editingIcon.collections}
												allowPaste={true}
												onlyUnique={true}
												autoComplete={existingCollections}
											/>
										</FormGroup>
									{/if}
								</div>
							</CardBody>
						</Card>
					</div>
					<div class="addCard">
						<Card class="mb-3">
							<CardHeader>
								<CardTitle>Add Icons (still in development)</CardTitle>
							</CardHeader>
							<CardBody
								style="filter: blur(5px) grayscale(1); pointer-events: none; user-select: none; opacity: 0.2"
							>
								<TabContent>
									<TabPane tabId="tnp" tab="The Noun Project" active>
										<h3>Add icons with The Noun Project</h3>
										<p>
											Looking to add icons to the project licensed under The Noun Project? Look no
											further. We'll automatically fetch all important information and set it up
											correctly for adding to Canvas Icons.
										</p>
										<div id="tnp-credentials">
											<FormGroup>
												<Label for="exampleEmail">TNP API Key</Label>
												<Input
													bind:value={tnpImport.key}
													placeholder="Enter your API Key here..."
												/>
											</FormGroup>
											<FormGroup>
												<Label for="exampleEmail">TNP API Secret</Label>
												<Input
													bind:value={tnpImport.secret}
													type="password"
													placeholder="Enter your API Secret here..."
												/>
											</FormGroup>
										</div>
										<Figure caption="Check the URL in The Noun Project for the relevant icon ID">
											<Image
												fluid
												alt="The end of the URL contains the icon ID on The Noun Project icon pages"
												src="/img/tnp-icon-id.png"
											/>
										</Figure>
										<FormGroup>
											<Label for="exampleEmail">Icon ID</Label>
											<Input
												bind:value={tnpImport.iconID}
												placeholder="Enter the ID of the icon you want to import"
											/>
										</FormGroup>
										<Button on:click={importIcon} color="primary">Import Icon</Button>
									</TabPane>
									<TabPane tabId="manual" tab="Add icons manually" />
								</TabContent>
							</CardBody>
						</Card>
					</div>
				</Col>
			</Row>
		</ModalBody>
	</Modal>
</div>

<style>
	:global(.icon#dnd-action-dragged-el .editTools) {
		display: none;
	}

	.editCard {
		z-index: 10;
		position: relative;
	}
	.addCard {
		z-index: 5;
		position: relative;
	}
</style>
