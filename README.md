# Snippet Browser

A Visual Studio Code extension that discovers, filters, and inserts Talon-style `.snippet` files from a local folder.

![Browse snippets](images/snippets2.png)

## Features

- **Browse & Filter**: Use the Command Palette to select a language (or _All_) and pick from available snippets.
- **Configurable Folder**: Set your snippet directory with `Snippet Browser: Set Snippet Folder` or via the `snippetbrowser.snippetPath` setting.
- **Quick C# Inserts**: One-command insertion of common C# `if` and `for` snippets.
- **Auto-Prompt**: On first use (when no folder is defined), prompts you to select the snippet folder.

## Commands

| Command                                 | ID                               | Description                                 |
| --------------------------------------- | -------------------------------- | ------------------------------------------- |
| Snippet Browser: Open                   | `snippetbrowser.open`            | Browse languages and insert a snippet       |
| Snippet Browser: Set Snippet Folder     | `snippetbrowser.setSnippetPath`  | Configure or change your `.snippet` folder  |
| Snippet Browser: Insert C# If Statement | `snippetbrowser.insertIfCsharp`  | Quickly insert the C# `ifStatement` snippet |
| Snippet Browser: Insert C# For Loop     | `snippetbrowser.insertForCsharp` | Quickly insert the C# `for` loop snippet    |

## Configuration

```jsonc
// in settings.json
autoComplete: false,
{
  "snippetbrowser.snippetPath": "", // set to your .snippet folder path
}
```

- **snippetbrowser.snippetPath**: (string) Absolute or workspace-relative path to your `.snippet` files folder.

## Usage

1. Press `Ctrl+Shift+P` and run **Snippet Browser: Open**.
2. Select a language (or **All**).
3. Pick a snippet by name (see description and phrase hints).
4. Snippet code will be inserted at your cursor.

> On first run, if no snippet folder is configured, an open-folder dialog will prompt you to select it automatically.

## Build & Test

```pwsh
# Install deps
npm install

# Compile
npm run compile
# or watch mode
npm run watch

# Run & Debug
# Press F5 in VS Code to launch the Extension Development Host

# Lint & Test
npm run lint
npm test
```

## Package & Publish

```pwsh
# Bump version in package.json
# Compile before publishing
npm run compile
# Create .vsix
envs, vsce package
# Publish to Marketplace
envs, vsce publish
```

---

For more information, see the [extension guidelines](https://code.visualstudio.com/api/references/extension-guidelines) and the [snippet format spec](SnippetBrowser.md).
