# Style Guide

## Version Control System

### Branch

The branch must be based on the `{type}/{task}` template.

The `{type}` could be one of the following:

- `feature`
- `bugfix`
- `hotfix`
- `release`

The `{task}` is simply the ID of the Jira task.

Examples:

- `feature/XG-10`
- `bugfix/XG-10`
- `hotfix/XG-10`
- `release/XG-10`

### Commit

The commit message must be based on the `{type}({task}): {message}` template. This template comes from the commitlint tool and related documentation could be found on its GitHub README.md.

The `{type}` could be one of the following:

- `build`: changes that affect build components like build tool, ci pipeline, dependencies, project version, etc...
- `chore`: changes that aren't user-facing
- `docs`: changes that affect the documentation
- `feat`: changes that introduce a new feature
- `fix`: changes that patch a bug
- `perf`: changes which improve performance
- `refactor`: changes which neither fix a bug nor add a feature
- `revert`: changes that revert a previous commit
- `style`: changes that don't affect code logic, such as white-spaces, formatting, missing semi-colons
- `test`: changes that add missing tests or correct existing tests

The `{task}` is simply the ID of the Jira task.

Examples:

- `feat(XG-10): ...`
- `fix(XG-10): ...`

### Pull Request

All pull requests must be submitted using the provided PR template. The template contains sections for:

- The type of the change (bug fix, new feature, breaking change, docs update, etc.)
- The description of the change, including summary and motivation
- The ticket being resolved
- The status of the test coverage
- The screenshots or screen recordings of changes being made
- A checklist of items that should be completed before submitting (style compliance, tests, docs, self-review, etc.)

Completing each section of the template helps give reviewers the necessary information and context to properly evaluate the changes. Pull requests submitted without using the template will not be considered for merging until the template has been filled out.

The template establishes a minimum level of quality and consistency for contributions to the project. Ensuring all pull requests follow the template procedure supports an efficient, high-quality development process. If any clarification or modifications to the template are needed, please discuss them in the pull request.

So in summary, this requirement mandates that all pull requests follow and complete the template to be considered for review and merging. Not adhering to the template results in the pull request not being evaluated further until the necessary info is provided as outlined in the sections of the template. Using a pull request template and requiring its completion for all contributions helps streamline the development workflow.
