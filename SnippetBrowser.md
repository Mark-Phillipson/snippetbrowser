# Snippet Browser

A Visual Studio Code extension that discovers Talon-style `.snippet` files, lets you search and filter by language, and inserts code snippets at your cursor.

## Features

- Command Palette browser for all snippets (`snippetbrowser.open`).
- Global setting `snippetbrowser.snippetPath` to point at your snippets folder.
- Quick commands to set or change the snippet folder (`snippetbrowser.setSnippetPath`).
- C#-specific shortcuts: insert common `if` and `for` snippets.
- Automatic prompt on first run if no folder is configured.

## Commands

- **Snippet Browser: Open** (`snippetbrowser.open`)
  Browse languages and insert any snippet.

- **Snippet Browser: Set Snippet Folder** (`snippetbrowser.setSnippetPath`)
  Select the folder where your `.snippet` files live.

- **Insert C# If Statement** (`snippetbrowser.insertIfCsharp`)
  Quickly insert your C# `ifStatement` snippet.

- **Insert C# For Loop** (`snippetbrowser.insertForCsharp`)
  Quickly insert your C# `for` loop snippet.

## Configuration

- `snippetbrowser.snippetPath` (string, default `""`)
  Absolute or workspace-relative path to your snippet files folder.

## Usage

1. Run **Snippet Browser: Open** to pick a language then a snippet.
2. Or use **Snippet Browser: Set Snippet Folder** to configure your snippet directory.
3. Use **Insert C# If Statement** or **Insert C# For Loop** in any editor for quick insertion.

---

Idea for a Visual Studio Code Extension:

 To be able to use the command palette to look up available Talon snippets located in the snippet directory.

 Would be nice to be able to see a list of code languages and then filter down into the available snippets for each one.

 Users say it's difficult to remember what  snippets are available and what to type or say to get them inserted.

 The extension would need to have the option of recording a setting of where to find snippets for example the folder name.

 The extension would search this location on startup to build a list of all available snippets with the context fields listed below.

When a user has drilled down to a specific snippet it would then be inserted into the code current position. 


This is the instructions on the format of snippets:

# Snippets

Custom format to represent snippets.

## Features

- Custom file ending `.snippet`.
- Supports syntax highlighting in VSCode via an [extension](https://marketplace.visualstudio.com/items?itemName=AndreasArvidsson.andreas-talon)
- Supports auto-formatting in VSCode via an [extension](https://marketplace.visualstudio.com/items?itemName=AndreasArvidsson.andreas-talon)
- Support for insertion and wrapper snippets. Note that while the snippet file syntax here supports wrapper snippets, you will need to install [Cursorless](https://www.cursorless.org) for wrapper snippets to work.
- Support for phrase formatters.

## Format

- A `.snippet` file can contain multiple snippet documents separated by `---`.
- Each snippet document has a context and body separated by `-`.
- Optionally a file can have a single context at the top with no body. This is not a snippet in itself, but default values to be inherited by the other snippet documents in the same file.
- Some context keys supports multiple values. These values are separated by `|`.
  - For most keys like `language` or `phrase` multiple values means _or_. You can use phrase _1_ or phrase _2_. The snippet is active in language _A_ or language _B_.
  - For `insertionFormatter` multiple values means that the formatters will be applied in sequence.

### Context fields

| Key            | Required | Multiple values | Example                        |
| -------------- | -------- | --------------- | ------------------------------ |
| name           | Yes      | No              | `name: ifStatement`            |
| description    | No       | No              | `description: My snippet`      |
| language       | No       | Yes             | `language: javascript \| java` |
| phrase         | No       | Yes             | `phrase: if \| if state`       |
| insertionScope | No       | Yes             | `insertionScope: statement`    |

- `name`: Unique name identifying the snippets. Can be referenced in Python to use the snippet programmatically.
- `description`: A description of the snippet.
- `language`: Language identifier indicating which language the snippet is available for. If omitted the snippet is enabled globally.
- `phrase`: The spoken phrase used to insert the snippet. eg `"snip if"`.
- `insertionScope`: Used by [Cursorless](https://www.cursorless.org) to infer scope when inserting the snippet. eg `"snip if after air"` gets inferred as `"snip if after state air"`.

### Variables

It's also possible to set configuration that applies to a specific tab stop (`$0`) or variable (`$try`):

| Key                | Required | Multiple values | Example                             |
| ------------------ | -------- | --------------- | ----------------------------------- |
| insertionFormatter | No       | Yes             | `$0.insertionFormatter: SNAKE_CASE` |
| wrapperPhrase      | No       | Yes             | `$0.wrapperPhrase: try \| trying`   |
| wrapperScope       | No       | No              | `$0.wrapperScope: statement`        |

- `insertionFormatter`: Formatter to apply to the phrase when inserting the snippet. eg `"snip funk get value"`. If omitted no trailing phrase is available for the snippet.
- `wrapperPhrase`: Used by [Cursorless](https://www.cursorless.org) as the spoken form for wrapping with the snippet. eg `"if wrap air"`. Without Cursorless this spoken form is ignored by Talon.
- `wrapperScope`: Used by [Cursorless](https://www.cursorless.org) to infer scope when wrapping with the snippet. eg `"if wrap air"` gets inferred as `"if wrap state air"`.

## Formatting and syntax highlighting

To get formatting, code completion and syntax highlighting for `.snippet` files: install [andreas-talon](https://marketplace.visualstudio.com/items?itemName=AndreasArvidsson.andreas-talon)

## Examples

### Single snippet definition

![snippets1](./images/snippets1.png)

### Multiple snippet definitions in single file

![snippets2](./images/snippets2.png)

### Default context and multiple values

![snippets3](./images/snippets3.png)


