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

	// Stylesheet
	import '../index.scss';
	//  - Overrides for editor
	import './index.scss';

	// Load Icons

	import categories from '$lib/icons';
	import type { Category, Icon } from '$lib/icons';
	import { getIconClass } from '$lib/icons';
	import { Icon } from 'sveltestrap';

	// Colour
	let colour = '#000000';

	// Make a copy of the categories for modification
	const clone = rfdc();
	let unsavedStateCategories: Category[] = clone(categories);
	let currentCategory = unsavedStateCategories[0];

	// Whether we're adding an icon or editing it
	let editIcon = null;
	const getIcon = (id) => currentCategory.icons.find((e) => e.id == id);

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
					available <a href="https://github.com/Ranga-Auaha-Ako/canvas-icons/">
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
												<div role="button" class="delete" on:click={(_) => removeIcon(i)}>
													Delete
												</div>
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
					</FormGroup>
				</Col>
				<Col>
					<Card class="mb-3">
						<CardHeader>
							<CardTitle
								>Edit {editIcon === null ? 'Icon' : `"${getIcon(editIcon).term}" Icon`}</CardTitle
							>
						</CardHeader>
						<CardBody>
							<div class="editPane">
								{#if editIcon === null}
									<div class="none">To begin, select an icon.</div>
								{:else}
									You selected "{getIcon(editIcon).term}"!
								{/if}
							</div>
						</CardBody>
					</Card>
					<Card class="mb-3">
						<CardHeader>
							<CardTitle>Add Icons</CardTitle>
						</CardHeader>
						<CardBody>
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
											<Input bind:value={tnpImport.key} placeholder="Enter your API Key here..." />
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
				</Col>
			</Row>
		</ModalBody>
	</Modal>
</div>

<style>
	:global(.icon#dnd-action-dragged-el .editTools) {
		display: none;
	}
</style>
