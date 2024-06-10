<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import Portal from 'svelte-portal/src/Portal.svelte';
	import { focusTrap } from 'svelte-focus-trap';

	// Load Material Design Icons (for UI)
	import Resize from 'svelte-material-icons/Resize.svelte';
	import FlipToBack from 'svelte-material-icons/FlipToBack.svelte';
	import ArrowExpandVertical from 'svelte-material-icons/ArrowExpandVertical.svelte';
	import ArrowSplitHorizontal from 'svelte-material-icons/ArrowSplitHorizontal.svelte';
	import Floppy from 'svelte-material-icons/Floppy.svelte';
	import Restore from 'svelte-material-icons/Restore.svelte';
	import Close from 'svelte-material-icons/Close.svelte';

	// Load Icon Preview
	import IconPreview from '$lib/components/iconPreview.svelte';

	// Config
	import {
		colour,
		iconMargin,
		iconPadding,
		iconSize,
		iconOffset,
		iconInBox,
		showMargin,
		showSettings,
		iconPreviewPosition,
		recentIcons
	} from '../../routes/store';
</script>

<Portal target="body">
	{#if $showSettings}
		<div
			class="modal-container"
			aria-labelledby="settings-title"
			style="--iconColor: {$colour}; --iconMargin: {$iconMargin}px"
			aria-label="Close Settings"
		>
			<div
				transition:fade|global={{ duration: 150 }}
				class="modal-backdrop"
				on:click={() => {
					$showSettings = false;
				}}
			/>
			<div
				transition:fly|global={{ y: -200, duration: 150 }}
				class="modal settings"
				on:click={(e) => e.stopPropagation()}
				role="document"
				use:focusTrap
			>
				<button
					type="button"
					class="close"
					aria-label="Close dialog"
					on:click={() => {
						$showSettings = false;
					}}><Close /></button
				>
				<div class="config">
					<h1 id="settings-title">Advanced Settings</h1>
					<div class="config-contents">
						<p class="description">
							Use these controls to set the position, spacing, and style of the icon on your Canvas
							page. Then, click the save button at the bottom of this window to select your
							preferred icon from the icon library.
						</p>
						<div
							class="sizing"
							on:mousedown={() => {
								$showMargin = true;
								window.addEventListener(
									'mouseup',
									() => {
										$showMargin = false;
									},
									{ once: true }
								);
							}}
							on:focusin={() => {
								$showMargin = true;
							}}
							on:focusout={() => {
								$showMargin = false;
							}}
						>
							<div class="form-control">
								<label for="iconSize">
									<span class="icon"><Resize /></span>
									Icon Size
									<div class="manualEdit">
										<input
											type="number"
											step="1"
											min="10"
											bind:value={$iconSize}
											size={$iconSize.toString().length}
											disabled={$iconSize == -1}
										/>
										<span class="units">px</span>
									</div>
								</label>
								<div class="input-prefix">
									<button
										class:active={$iconSize == -1}
										on:click={(e) => {
											$iconSize = $iconSize == -1 ? 20 : -1;
										}}>Auto</button
									>
									<input type="range" min="10" max="100" step="1" bind:value={$iconSize} />
								</div>
							</div>
							<div class="form-control">
								<label for="iconMargin">
									<span class="icon"><ArrowSplitHorizontal /></span>
									Icon Margin
									<div class="manualEdit">
										<input
											type="number"
											step="1"
											min="0"
											bind:value={$iconMargin}
											size={$iconMargin.toString().length}
										/>
										<span class="units">px</span>
									</div>
								</label>
								<input type="range" min="0" max="30" step="1" bind:value={$iconMargin} />
							</div>
							<div class="form-control">
								<label for="iconOffset">
									<span class="icon"><FlipToBack /></span>
									Icon Line offset
									<div class="manualEdit">
										<input
											type="number"
											step="0.1"
											bind:value={$iconOffset}
											size={$iconOffset.toString().length}
										/>
										<span class="units">em</span>
									</div>
								</label>
								<input type="range" min="-2" max="2" step="0.1" bind:value={$iconOffset} />
							</div>
						</div>
						<div class="form-control">
							<label for="preview-loc" class="inline">Icon Style:</label><br />
							<span class="btn-row" id="preview-loc">
								<button
									class:active={$iconInBox == false}
									on:click={() => {
										$iconInBox = false;
									}}><span>X</span> Icon</button
								>
								<button
									class:active={$iconInBox == true}
									on:click={() => {
										$iconInBox = true;
									}}><span>B</span> Icon Box</button
								>
							</span>
						</div>
						{#if $iconInBox}
							<div class="form-control" transition:fly|global={{ y: -20, duration: 150 }}>
								<label for="iconPadding">
									<span class="icon"><ArrowExpandVertical /></span>
									Icon Padding
									<div class="manualEdit">
										<input
											type="number"
											step="1"
											min="0"
											bind:value={$iconPadding}
											size={$iconPadding.toString().length}
										/>
										<span class="units">px</span>
									</div>
								</label>
								<input type="range" min="0" max="40" step="1" bind:value={$iconPadding} />
							</div>
						{/if}
					</div>
					<!-- <div>
									<ColourPicker bind:value={colour} />
									<input bind:value={colour} />
								</div> -->
					<!-- Actions -->
					<div class="footer">
						<button
							class="btn btn-lg btn-outline"
							on:click={() => {
								if (!confirm('Are you sure you want to reset all settings?')) return;
								$colour = '#000000';
								$iconMargin = 0;
								$iconPadding = 0;
								$iconSize = -1;
								$iconOffset = 0;
								$iconInBox = false;
								$showMargin = false;
								$iconPreviewPosition = 'h2';
							}}
						>
							<span><Restore /></span>
							Reset
						</button>
						<button
							class="btn btn-lg btn-success"
							on:click={() => {
								$showSettings = false;
							}}
						>
							<span><Floppy /></span>
							Save
						</button>
					</div>
				</div>
				<div class="preview">
					<h1>Preview</h1>
					<div class="form-control">
						<label for="preview-loc" class="inline">Preview in:</label>
						<span class="btn-row" id="preview-loc">
							<button
								class:active={$iconPreviewPosition == 'h2'}
								on:click={() => {
									$iconPreviewPosition = 'h2';
								}}><span>H2</span> Header</button
							>
							<button
								class:active={$iconPreviewPosition == 'h3'}
								on:click={() => {
									$iconPreviewPosition = 'h3';
								}}><span>H3</span> Subheader</button
							>
							<button
								class:active={$iconPreviewPosition == 'p'}
								on:click={() => {
									$iconPreviewPosition = 'p';
								}}><span>P</span> Paragraph</button
							>
						</span>
					</div>

					<!-- Some different preview boxes to simulate placement and look -->
					<div class="preview-contents canvas-styles" aria-hidden="true">
						<h2>
							{#if $iconPreviewPosition == 'h2'}
								<IconPreview
									showMargin={$showMargin}
									iconInBox={$iconInBox}
									iconMargin={$iconMargin}
									iconPadding={$iconPadding}
									iconSize={$iconSize}
									colour={$colour}
									iconOffset={$iconOffset}
								/>
							{/if}
							Header goes here (H2)
						</h2>
						<div class="example-grid">
							<p class="moreLorem">
								Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
								laboriosam. Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
								illo.
							</p>
							<div class="example" />
						</div>
						<h3>
							{#if $iconPreviewPosition == 'h3'}
								<IconPreview
									showMargin={$showMargin}
									iconInBox={$iconInBox}
									iconMargin={$iconMargin}
									iconPadding={$iconPadding}
									iconSize={$iconSize}
									colour={$colour}
									iconOffset={$iconOffset}
								/>
							{/if}
							This is a subheader (H3)
						</h3>
						<p class="moreLorem">
							{#if $iconPreviewPosition == 'p'}
								<IconPreview
									showMargin={$showMargin}
									iconInBox={$iconInBox}
									iconMargin={$iconMargin}
									iconPadding={$iconPadding}
									iconSize={$iconSize}
									colour={$colour}
									iconOffset={$iconOffset}
								/>
							{/if}
							Sit amet dictum sit amet. Sed euismod nisi porta lorem mollis aliquam ut porttitor. Ac
							turpis egestas integer eget aliquet nibh praesent tristique. Auctor urna nunc id cursus
							metus aliquam eleifend.
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
</Portal>

<style lang="scss">
	.modal-container {
		.modal-backdrop {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
			z-index: 1000;
		}

		.modal {
			// Modal for icon settings (#settings)
			position: fixed;
			z-index: 1001;
			max-width: 1200px;
			width: calc(100% - 1rem);
			max-height: calc(100% - 2rem);
			left: 0;
			right: 0;
			top: 0;
			margin: auto;
			background-color: white;
			padding: 1rem 2rem;
			border-bottom-left-radius: 1rem;
			border-bottom-right-radius: 1rem;
			box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
			.close {
				display: block;
				position: absolute;
				right: 1rem;
				top: 1rem;
				background: transparent;
				border: none;
				cursor: pointer;
				font-size: 1.5rem;
			}

			h1,
			h2,
			h3 {
				font-weight: 600;
			}

			&.settings {
				height: 100%;
				padding: 0;
				display: grid;
				grid-template-columns: 5fr 5fr;

				.config {
					overflow: auto;
					height: 100%;
					padding: 2rem 2rem;
					padding-right: 2rem;
					display: grid;
					grid-template-rows: auto 1fr auto;
					h1 {
						margin: 0;
						margin-bottom: 0.4rem;
					}
					h2,
					h3 {
						margin-bottom: 0.5rem;
					}
					p.description {
						font-style: italic;
						font-size: 12px;
						margin-top: 0;
						margin-bottom: 1.5rem;
					}

					.footer {
						justify-self: end;
					}
				}

				.preview {
					overflow: auto;
					height: 100%;
					background-color: #e7e7e7;
					padding: 0 2rem;
					border-bottom-right-radius: 1rem;
					h1 {
						margin-top: 2rem;
					}
					.preview-contents {
						background-color: white;
						padding: 1em;
						border-radius: 4px;
						box-shadow: 0px 1.9px 2.4px rgba(0, 0, 0, 0.028), 0px 6.5px 8px rgba(0, 0, 0, 0.042),
							0px 29px 36px rgba(0, 0, 0, 0.07);
						user-select: none;
						// position: relative;
						// &::after {
						// 	content: ' ';
						// 	position: absolute;
						// 	background: linear-gradient(to bottom, #fff0 0%, #fff3 30%, #fffa 60%, #ffff 90%);
						// 	bottom: 0;
						// 	left: 0;
						// 	width: 100%;
						// 	height: 30%;
						// 	pointer-events: none;
						// }
					}
					.canvas-styles {
						color: #2d3b45;
						-webkit-font-smoothing: antialiased;
						font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif, sans-serif;
						font-weight: 400;
						text-rendering: optimizelegibility;
						font-size: 1rem;

						h2 {
							font-size: 1.8em;
							line-height: 1.5;
						}

						h3 {
							font-size: 1.5em;
						}
						h2,
						h3 {
							margin: 6px 0;
							line-height: 1.5;
							text-rendering: optimizelegibility;
							clear: both;
						}
						.example-grid {
							display: grid;
							grid-template-columns: 6fr 3fr;
							column-gap: 1rem;
							margin: 1rem 0;
							p {
								margin: 0;
							}
							.example {
								border-radius: 0.3rem;
								background-image: url('/img/lorempicture.jpeg');
								background-size: cover;
								background-position: center;
								// object-fit: cover;
								// min-height: 100px;
								height: 100%;
								width: 100%;
							}
						}
					}
				}
			}
		}
	}

	// @media screen and (max-width: 900px) {
	// 	.smallLorem::after {
	// 		content: 'Duis aute irure dolor in reprehenderit in voluptate velit. Excepteur sint occaecat cupidatat non proident, sunt in culpa. Animi, id est laborum et dolorum  . Lorem ipsum dolor sit amet, consectetur adipisicing elit.';
	// 	}
	// }
	@media screen and (min-width: 900px) {
		.moreLorem::after {
			content: 'Duis aute irure dolor in reprehenderit in voluptate velit. Excepteur sint occaecat cupidatat non proident, sunt in culpa. Animi, id est laborum et dolorum  . Lorem ipsum dolor sit amet, consectetur adipisicing elit.';
		}
	}
</style>
