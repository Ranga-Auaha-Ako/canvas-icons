<script lang="ts">
	import { onMount } from 'svelte';
	import Fuse from 'fuse.js';
	import scrollSpy from 'simple-scrollspy';
	import { page, session } from '$app/stores';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
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

	// Colour
	let colour = '#000000';

	let currentCategory = categories[0];

	const flipDurationMs = 300;
	function handleDndConsider(e) {
		currentCategory.icons = e.detail.items;
	}
	function handleDndFinalize(e) {
		currentCategory.icons = e.detail.items;
	}

	// Whether we're adding an icon or editing it
	let editIcon = null;

	let tnpImport = {
		key: '',
		secret: '',
		iconID: ''
	};

	const getIcon = () => {
		const nounProject = new NounProject({ key: tnpImport.key, secret: tnpImport.secret });
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
					available <a href="https://github.com/HexaCubist/canvas-icons/">
						on GitHub (HexaCubist/canvas-icons)</a
					></strong
				>. If you're not sure what that is, we reccomend you take a look before editing here.
			</p>
			<Row>
				<Col>
					<FormGroup>
						<Label for="categorySelect">Category</Label>
						<Input type="select" id="categorySelect" bind:value={currentCategory}>
							{#each categories as cat}
								<option value={cat}>{cat.name}</option>
							{/each}
						</Input>
						<div class="iconList">
							<div
								class="icons"
								use:dndzone={{ items: currentCategory.icons, flipDurationMs }}
								on:consider={handleDndConsider}
								on:finalize={handleDndFinalize}
							>
								{#each currentCategory.icons as icon, i (i)}
									<div
										class="icon"
										animate:flip={{ duration: flipDurationMs }}
										on:click={(e) => (editIcon = i)}
									>
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
									<Button on:click={getIcon} color="primary">Import Icon</Button>
								</TabPane>
								<TabPane tabId="manual" tab="Add icons manually" />
							</TabContent>
						</CardBody>
					</Card>

					<Card class="mb-3">
						<CardHeader>
							<CardTitle>Edit Icon</CardTitle>
						</CardHeader>
						<CardBody>
							{#if !editIcon}
								To begin, select an icon.
							{:else}
								You selected "{currentCategory.icons[editIcon].title}"!
							{/if}
						</CardBody>
					</Card>
				</Col>
			</Row>
		</ModalBody>
	</Modal>
</div>

<style type="scss">
	.home {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 0;
		// iframe {
		// 	border: 0;
		// 	filter: blur(10px);
		// 	pointer-events: none;
		// 	width: 100%;
		// 	height: 100%;
		// 	overflow: hidden;
		// 	z-index: 1;
		// }
		.shadow {
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			position: absolute;
			background: rgba(0, 0, 0, 0.8);
			z-index: 2;
		}
	}

	.iconList {
		// display: grid;
		// grid-template-columns: repeat(7, 1fr);
		// grid-auto-rows: 5em;

		.icons {
			display: grid;
			grid-template-columns: repeat(7, 1fr);
			grid-auto-rows: 5em;
		}

		.icon {
			padding: 1em;
			transition: opacity 0.25s ease, transform 0.25s ease;
			&:hover {
				opacity: 0.5;
				transform: scale(1.1);
			}
		}

		// .addIcon {
		// 	font-size: 3rem;
		// 	line-height: 3rem;
		// 	cursor: pointer;
		// 	border: 0;
		// 	background: none;
		// 	margin: 0;
		// 	padding: 0;
		// }
	}
</style>
