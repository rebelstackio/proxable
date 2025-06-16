# Contributing to proxable

We welcome contributions.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Report Bugs](#how-to-report-bugs)
3. [Feature Requests](#feature-requests)
4. [Development Setup](#development-setup)
5. [Submitting a Pull Request](#submitting-a-pull-request)
6. [Branching & Commit Guidelines](#branching--commit-guidelines)
7. [Testing & Benchmarks](#testing--benchmarks)
8. [Coding Style](#coding-style)
9. [License & Attribution](#license--attribution)

---

## Code of Conduct

Let's be friendly. By participating you agree to:

- Be **kind** and **courteous**. Respect differing opinions.
- Use **constructive** language and focus on ideas, not individuals.
- Avoid demeaning or harassing language.

---

## How to Report Bugs

1. Search existing [issues](https://github.com/your-org/proxable/issues) to see if it’s already reported.
2. If not, open a new issue with:
	- A clear **title** and **description** of the problem
	- **Steps to reproduce** or a minimal code snippet
	- Your **environment** (Node version, OS, proxable version)
3. Label the issue appropriately (bug, question, help wanted).

---

## Feature Requests

Please open a new issue and include:

- What you want to achieve
- A brief **motivation** or use-case
- Any **API sketch** or examples

Discussion is encouraged before implementation.

---

## Development Setup

1. Clone the repo:
	```bash
	git clone https://github.com/your-org/proxable.git
	cd proxable
	```

2. Install dependencies:
	```bash
	npm install
	```

3. Make sure tests pass:
	```bash
	npm run test:unit
	```
4. (Optional) Run benchmarks:
	```bash
	npm run test:bench
	```

---

## Submitting a Pull Request

1. Fork the repository.
2. Create a branch with a descriptive name:
	```bash
	git checkout -b feature/my-new-feature
	```
3. Make your changes & add tests.
4. Ensure all tests pass locally:
	```bash
	npm run test:unit
	```
5. Commit your changes following the conventions below.
6. Push to your fork and open a PR against `main`.
7. Fill in the PR template—describe your changes and link to any related issues.

---

## Branching & Commit Guidelines

- Work off of the `main` branch.
- Use feature branches (`feature/…`, `bugfix/…`, `docs/…`).
- Commit messages should follow **Conventional Commits**:

  ```
  <type>(<scope>): <short summary>

  [optional body]

  [optional footer]
  ```

  - **type**: `feat`, `fix`, `docs`, `perf`, `refactor`, `test`, `chore`
  - **scope**: optional area of the code (e.g. `proxable`, `subscription-index`)
  - **summary**: brief description (< 72 chars)

---

## Testing & Benchmarks

- **Unit tests**: use Node’s built-in test runner with `test/unit/**/*.test.ts`
	```bash
	npm run test:unit
	```
- **Benchmarks**: located in `test/benchmark`, run with
	```bash
	npm run test:bench
	```
- Please add new tests for any bug you fix or feature you add.

---

## Coding Style

- **TypeScript** with strict mode enabled.
- **Tabs** for indentation (see `.editorconfig`).
- Use three-backtick fenced code blocks in docs.
- Write clear JSDoc comments on public APIs.
- Keep external dependencies to a minimum.

---

## License & Attribution

This project is licensed under the **LGPL-3.0**. See [LICENSE](./LICENSE) for details.

By contributing, you also agree that your contributions will be licensed under the same license as the project.
