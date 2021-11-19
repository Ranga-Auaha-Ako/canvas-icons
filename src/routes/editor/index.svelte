<!-- @hmr:keep-all -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import scrollSpy from 'simple-scrollspy';
	import { page, session } from '$app/stores';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import rfdc from 'rfdc';
	import { nanoid } from 'nanoid';

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
		Image,
		ButtonGroup,
		InputGroup,
		Tooltip,
		Styles
	} from 'sveltestrap';
	// Svelte Tags input (Used to select tags and colections in editor)
	import Tags from 'svelte-tags-input';
	// Svelte text highlight
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/src/languages/json';
	import github from 'svelte-highlight/src/styles/github';

	// Stylesheet
	import '../index.scss';
	//  - Overrides for editor
	import './index.scss';

	// Import Store
	import { nounProjectAuth } from './store';

	// Load Icons
	import categories from 'uoa-canvas-icons';
	import type { Category, Icon } from 'uoa-canvas-icons';
	import { getIconClass } from 'uoa-canvas-icons';
	import InputSuggest from '$lib/components/inputSuggest.svelte';
	import IconEditor from '$lib/components/editor/iconEditor.svelte';

	// Load list of icon files
	const iconFileListImport = import.meta.glob('/static/icons/**/*.svg');
	const iconFileList = Object.keys(iconFileListImport).map((f) =>
		f.replace(/^(\/?static\/icons\/)/, '')
	);

	// Colour
	let colour = '#000000';

	console.log(categories);
	// Example empty category list [{ name: 'test', icons: [] }]

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
	// Icon add template
	let addIconContents;
	const resetAddIcon = () => {
		addIconContents = clone({
			id: nanoid(),
			url: '',
			title: '',
			width: 48,
			height: 48,
			tnp_id: '',
			tags: [],
			term: '',
			collections: []
		});
	};
	resetAddIcon();
	const finishAddIcon = () => {
		currentCategory.icons = [clone(addIconContents), ...currentCategory.icons];
		editIcon = addIconContents.id;
		resetAddIcon();
		hideIconImport(); // Hide TNP import in case it was imported from there
	};
	// Handle movement of Drag&Drop icons, animation
	const flipDurationMs = 300;
	function handleSort(e) {
		console.log('Dragging...');
		console.log(e);
		currentCategory.icons = e.detail.items;
	}

	let tnp_iconID;

	let iconImportOpen = false;
	let addIconNounData = {
		preview_url: null,
		svg_url: null,
		view_url: null,
		filename: null
	};
	const hideIconImport = () => {
		iconImportOpen = false;
	};
	const importIcon = async () => {
		const response = await fetch('/editor/nounfetch.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				key: $nounProjectAuth.key,
				secret: $nounProjectAuth.secret,
				id: tnp_iconID
			})
		});
		const iconData = await response.json();
		if (iconData.error) {
			console.error(
				'Error encountered whilst fetching TNP icon! Likely this is due to the API Keys being wrong or an incorrect TNP ID.'
			);
			return;
		}
		addIconContents = {
			id: nanoid(),
			url: `/[relevant folder]/noun_${iconData.icon.term_slug}_${iconData.icon.id}`,
			title: iconData.icon.term,
			width: 48,
			height: 48,
			tnp_id: iconData.icon.id,
			tags: iconData.icon.tags.map((t) => t.slug),
			term: iconData.icon.term,
			collections: iconData.icon.collections.map((t) => t.name)
		};
		addIconNounData = {
			preview_url: iconData.icon.preview_url,
			svg_url: iconData.icon.icon_url,
			view_url: `https://thenounproject.com${iconData.icon.permalink}`,
			filename: `noun_${iconData.icon.term_slug}_${iconData.icon.id}`
		};
		iconImportOpen = true;
	};

	const removeIcon = (i: number | boolean = false, id: string | boolean = false) => {
		if (id) {
			currentCategory.icons = currentCategory.icons.filter((e, idx) => id !== e.id);
		} else {
			currentCategory.icons = currentCategory.icons.filter((e, idx) => i !== idx);
		}
	};

	const cloneEditToAdd = () => {
		addIconContents = clone(editingIcon);
		addIconContents.id = nanoid();
		editIcon = null;
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

	// Modal handler for "exporting" code
	let codeExportOpen = false;
	let codeExportContents =
		"Sadly the export failed. If you're a developer, check the console logs for more information.";
	let codeExportFilename: false | string = false;
	const hideCode = () => (codeExportOpen = false);
	const exportCode = (code, format = true, fileName: false | string = false) => {
		if (typeof code == 'string') {
			codeExportContents = code;
		} else {
			codeExportContents = JSON.stringify(code, null, format ? '\t' : undefined);
		}
		codeExportFilename = fileName;
		codeExportOpen = true;
		return codeExportContents;
	};
</script>

<svelte:head>
	<!-- <link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	/> -->
	<Styles icons={false} />
	{@html github}
</svelte:head>

<div style="--iconColor: {colour}">
	<!-- Iframe to show main app -->
	<div class="home" aria-label="Return home">
		<!-- <iframe
			src="../"
			title="Frame containing teacher user interface"
			scrolling="no"
			aria-hidden="true"
		/> -->
		<div class="shadow" />
	</div>
	<!-- Container for editor -->
	<Modal body backdrop={true} isOpen={codeExportOpen} toggle={hideCode}>
		<ModalHeader toggle={hideCode}>
			View source
			<Button
				id="btn-download"
				outline
				size="sm"
				color="success"
				aria-label="Download"
				on:click={async (_) => {
					const link = document.createElement('a');
					link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(codeExportContents);
					link.setAttribute('download', `${codeExportFilename}.json`);
					link.click();
				}}>⭳</Button
			>
			<Tooltip target="btn-download" placement="bottom">Download</Tooltip>
		</ModalHeader>

		<Highlight style="user-select: all" language={json} code={codeExportContents} />
	</Modal>
	<Modal
		body
		header="Confirm Import"
		backdrop={true}
		isOpen={iconImportOpen}
		toggle={hideIconImport}
	>
		<IconEditor bind:icon={addIconContents} {existingCollections} {existingTags} {iconFileList} />
		<hr />
		<Row>
			<Col xs="3" class="d-flex align-items-center">
				{#if addIconNounData.svg_url}
					<a href={addIconNounData.svg_url} target="_blank">
						<Image class="w-100" src={addIconNounData.svg_url} alt="Preview of your icon" />
					</a>
				{:else}
					<a href={addIconNounData.view_url} target="_blank">
						<Image class="w-100" src={addIconNounData.preview_url} alt="Preview of your icon" />
					</a>
				{/if}
			</Col>
			<Col>
				<p>
					Congrats! If the above looks right to you, you're ready to import this icon. Before
					continuing, you first need to download this icon and place it in the repository. <strong
						>If you are running this app in development mode, the hot reload may delete the state of
						this page. Therefore, wait until you have finished editing to copy in the icons.</strong
					>
				</p>
				{#if addIconNounData.svg_url}
					<p class="text-center">
						<Button
							color="success"
							on:click={async (_) => {
								const res = await fetch(addIconNounData.svg_url);
								const blob = await res.blob();
								const link = document.createElement('a');
								link.href = URL.createObjectURL(blob);
								link.download = addIconNounData.filename;
								link.click();
							}}>Download Icon</Button
						>
						<br />
					</p>
				{:else}
					<p class="text-center">
						<a href={addIconNounData.view_url} target="_blank" class="btn btn-success"
							>Visit Site to download</a
						>
					</p>
					<p>
						Sadly, The Noun Project didn't give you a direct download link for this icon, so you
						will need to visit the link above and download the icon. Make sure to name the file "{addIconNounData.filename}".
					</p>
				{/if}
			</Col>
		</Row>
		<p>
			When you have the icon downloaded and placed in your folder of choice, make sure the icon path
			above matches.
		</p>
		<strong
			>Please note that continuing will not save your changes. You will still need to export the
			category when you are done making changes and manually paste in the new config.</strong
		>
		<Button on:click={exportCode(addIconContents)}>View Code</Button>
		<Button color="danger" on:click={hideIconImport}>Cancel and return</Button>
		<Button color="success" on:click={finishAddIcon}>Import Icon</Button>
	</Modal>
	<Modal isOpen={true} static fullscreen={true}>
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
				<Col xs="12" sm="6">
					<FormGroup>
						<Label for="categorySelect">Category</Label>
						<InputGroup>
							<Input type="select" id="categorySelect" bind:value={currentCategory}>
								{#each unsavedStateCategories as cat}
									<option value={cat}>{cat.name}</option>
								{/each}
							</Input>
							<Button
								outline
								color="primary"
								on:click={exportCode(currentCategory, true, currentCategory.name)}
								>Export Category</Button
							>
						</InputGroup>
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
				<Col xs="12" sm="6">
					<div class="editCard">
						<Card class="mb-3">
							<CardHeader>
								<CardTitle>
									Edit
									{#if editingIcon}
										"{editingIcon.title ?? editingIcon.term}" Icon
										<ButtonGroup class="float-end">
											<Button size="sm" color="primary" on:click={exportCode(editingIcon)}
												>View Code</Button
											>
										</ButtonGroup>
									{:else}
										Icon
									{/if}
								</CardTitle>
							</CardHeader>
							<CardBody>
								<div class="editPane">
									{#if !editingIcon}
										<div class="none">To begin, select an icon.</div>
									{:else}
										<IconEditor
											bind:icon={editingIcon}
											{existingCollections}
											{existingTags}
											{iconFileList}
										/>
									{/if}
								</div>
							</CardBody>
						</Card>
					</div>
					<div class="addCard">
						<Card class="mb-3">
							<CardHeader>
								<CardTitle>Add Icons</CardTitle>
							</CardHeader>
							<CardBody>
								<TabContent>
									<TabPane tabId="manual" id="manual" tab="Add icons manually" active>
										<IconEditor
											bind:icon={addIconContents}
											{existingCollections}
											{existingTags}
											{iconFileList}
										/>
										<Button color="danger" on:click={resetAddIcon}>Reset</Button>
										<Button color="primary" on:click={finishAddIcon}>Add</Button>
									</TabPane>
									<TabPane tabId="tnp" id="tnp" tab="Add with The Noun Project">
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
													bind:value={$nounProjectAuth.key}
													placeholder="Enter your API Key here..."
												/>
											</FormGroup>
											<FormGroup>
												<Label for="exampleEmail">TNP API Secret</Label>
												<Input
													bind:value={$nounProjectAuth.secret}
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
												bind:value={tnp_iconID}
												placeholder="Enter the ID of the icon you want to import"
											/>
										</FormGroup>
										<Button on:click={importIcon} color="primary">Import Icon</Button>
									</TabPane>
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
