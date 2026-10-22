# Release Notes

## 15.0.0 — 2026-10-22

### Changed

- Align package metadata, dependencies, contributor guidance, and CI with Eliware Test v15.
- Update package metadata, documentation, and workflows for convention v13.0 before adopting v15.
- Remove npm publication metadata, its GitHub workflow, and the packaged workflow specifications.
- Run the Docker image directly from source with published runtime dependencies.
- Document environment setup, recurring probes, shutdown, and container use.
- Remove `ELERA_DEBUG` because it had no runtime effect.
- Reject unknown CLI arguments before the application starts.
- Stop startup if the first database check fails and report client close errors.
