# Build, Test, and Publish Guide

This document provides step-by-step commands to compile, test, and publish the **Snippet Browser** VS Code extension.

---

## Prerequisites

- Node.js (v16+) and npm installed
- VS Code Extension CLI (`vsce`)
  ```pwsh
  npm install -g vsce
  ```

---

## 1. Compile / Build

Compile TypeScript sources to JavaScript:
```pwsh
npm install         # install dependencies
npm run compile     # tsc -p ./
```

You can also run in watch mode (recompiles on file change):
```pwsh
npm run watch       # tsc -watch -p ./
```

---

## 2. Run / Debug in Extension Host

1. Press `F5` in VS Code to launch Extension Development Host.
2. In the development window, open the **Command Palette** (`Ctrl+Shift+P`) and run:
   - `Snippet Browser: Open`
   - Or any other contributed command.

---

## 3. Testing

Compile and lint before running tests:
```pwsh
npm test           # runs vscode-test (compiles + executes integration tests)
```  

You can also run only lint or only tests:
```pwsh
npm run lint      # ESLint check
npm run test      # Extension integration tests
```

---

## 4. Packaging & Publishing

1. Bump version in `package.json` if needed (e.g. `0.0.2`).
2. Compile before publishing:
   ```pwsh
   npm run compile
   ```
3. Package into a `.vsix` file:
   ```pwsh
   vsce package
   ```
4. Publish to the VS Code Marketplace (requires a publisher login):
   ```pwsh
   vsce publish
   ```

> **Tip:** To publish a specific version tag, use:  
> ```pwsh
> vsce publish <version>
> ```

---

That's it! Copy and paste any of the above `pwsh` blocks directly into your PowerShell terminal to carry out each step.
