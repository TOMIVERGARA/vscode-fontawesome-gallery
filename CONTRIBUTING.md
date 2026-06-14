# Contributing to vscode-fontawesome-gallery

Thanks for taking the time to contribute!

## Development setup

### Prerequisites

- Node.js 20+
- VS Code

### Getting started

```bash
git clone https://github.com/TOMIVERGARA/vscode-fontawesome-gallery.git
cd vscode-fontawesome-gallery
npm install
```

Press `F5` in VS Code to open an Extension Development Host with the extension loaded.

### Branch strategy

| Branch       | Purpose                              |
| ------------ | ------------------------------------ |
| `main`       | Production — reflects latest release |
| `dev`        | Integration — target for PRs         |
| `feature/*`  | New features                         |
| `fix/*`      | Bug fixes                            |

All PRs should target `dev`. `main` is updated only at release time.

### Building

```bash
npm run package   # produces the .vsix bundle
```

### Generating FontAwesome data

The `fontawesometools.js` script extracts icon data from a FontAwesome release:

```bash
# After placing the FA release under the appropriate directory:
node fontawesometools.js cfiV6   # extract icons from all.js (FA v6)
node fontawesometools.js csi     # regenerate the search index
```

### Submitting a pull request

1. Fork the repo and create your branch from `dev` (`git checkout -b fix/my-fix dev`)
2. Make your changes and test them in the Extension Development Host
3. Open a PR against `dev` — the PR template will guide you through the description

### Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include your VS Code version, extension version, and OS.
