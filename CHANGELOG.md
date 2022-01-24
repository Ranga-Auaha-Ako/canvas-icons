# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- No changes yet.

## [2.6.1] - 2022-01-24

### Fixed

- Fix handling of duplicate icons for recent icons list

### Changed

- Layout update for the advanced settings page based on feedback

## [2.6.0] - 2022-01-24

### Added

- Preferences are now saved, including icon colour and all advanced settings
- Most recent icons now appear in a "category" at the top for quick access

## [2.5.2] - 2022-01-20

### Added

- New "Advanced Properties" tab available to users
- Controls for icon padding and margin
- Controls for icon size
- New inverted variant of the icon (displays white icon in a box with the colour of choosing)

## [2.4.2] - 2021-12-11

### Fixed

- Added fill colours to new icons
- Disabled transition on icon colour, preventing some visual artifacts on some systems

## [2.4.0] - 2021-12-10

### Added

- Collecting icon download statistics
- New "emojis" category, starting with three icons
- 2x new icons in general category

### Changed

- Switched to Universal Analytics within Tag Assistant

## [2.3.3] - 2021-11-19

### Changed

- Switched to Tag Assistant, collecting page speed metrics

## [2.3.0] - 2021-11-19

### Added

- Basic Google Analytics implementation

### Fixed

- Tags sent to canvas no longer have alt attribute
- Fix issue with colour picker not working when searching

## [2.2.2] - 2021-11-12

### Added

- Icon editor now supports adding, deleting, and importing of icons within each category.

## [2.1.3] - 2021-11-03

### Added

- Documented through GitHub Pages, available at https://ranga-auaha-ako.github.io/canvas-icons/

### Changed

- Moved to UoA infrastructure: https://canvasicons.auckland.ac.nz/

### Security

- Updated package dependencies to latest versions

## [0.4.8] - 2021-09-12

### Fixed

- Prevent auto-building and publishing when there isn't a new semver (prevents incomplete features breaking production if they are pushed to master)
- Added code checking to release step to prevent bad releases
- Typescript issues with sveltestrap were too much - disabling type checking for this module
- Fixed misc. typescript errors

## [0.4.0] - 2021-09-12

### Added

- Changelog file to track version history
- Auto-download when not embedded in Canvas for web users
<!--

### Fixed

- -->

[unreleased]: https://github.com/Ranga-Auaha-Ako/canvas-icons/compare/v0.4.3...HEAD
[0.4.8]: https://github.com/Ranga-Auaha-Ako/canvas-icons/compare/v0.4.0...v0.4.8
[0.4.0]: https://github.com/Ranga-Auaha-Ako/canvas-icons/compare/v0.0.1...v0.4.0
