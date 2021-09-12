# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- No changes yet.

## [0.4.4] - 2021-09-12

### Fixed

- Prevent auto-building and publishing when there isn't a new semver (prevents incomplete features breaking production if they are pushed to master)
- Typescript issues with sveltestrap were too much - disabling type checking for this module
- Fixed misc. typescript errors

## [0.4.0] - 2021-09-12

### Added

- Changelog file to track version history
- Auto-download when not embedded in Canvas for web users
<!--

### Fixed

- -->

[unreleased]: https://github.com/HexaCubist/canvas-icons/compare/v0.4.3...HEAD
[0.4.4]: https://github.com/HexaCubist/canvas-icons/compare/v0.4.0...v0.4.4
[0.4.0]: https://github.com/HexaCubist/canvas-icons/compare/v0.0.1...v0.4.0
