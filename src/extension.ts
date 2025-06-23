// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { parseSnippetFile, Snippet } from './snippetParser';

// In-memory store for all parsed snippets
let allSnippets: Snippet[] = [];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "snippetbrowser" is now active!');

	// Register Snippet Browser open command
	const openDisposable = vscode.commands.registerCommand('snippetbrowser.open', async () => {
		// Gather unique languages
		const langs = Array.from(new Set(allSnippets.flatMap(s => s.languages))).sort();
		langs.unshift('All');
		const lang = await vscode.window.showQuickPick(langs, { placeHolder: 'Select a language (or All)' });
		if (!lang) { return; }
		const candidates = lang === 'All'
			? allSnippets
			: allSnippets.filter(s => s.languages.includes(lang));
		const items: vscode.QuickPickItem[] = candidates.map(s => ({
			label: s.name,
			description: s.description,
			detail: s.phrase?.join(', ')
		}));
		const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Select a snippet' });
		if (!selected) { return; }
		const snippet = candidates.find(s => s.name === selected.label);
		if (!snippet) { return; }
		const editor = vscode.window.activeTextEditor;
		if (!editor) { vscode.window.showErrorMessage('No active editor to insert snippet into'); return; }
		editor.insertSnippet(new vscode.SnippetString(snippet.body));
	});
	context.subscriptions.push(openDisposable);

	// Register command to set or change the snippet folder
	const setDisposable = vscode.commands.registerCommand('snippetbrowser.setSnippetPath', async () => {
		// Let user pick a folder
		const folderUris = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			canSelectFiles: false,
			canSelectMany: false,
			openLabel: 'Select Snippet Folder'
		});
		if (!folderUris || folderUris.length === 0) { return; }
		const folderPath = folderUris[0].fsPath;
		// Update user setting
		await vscode.workspace.getConfiguration('snippetbrowser')
			.update('snippetPath', folderPath, vscode.ConfigurationTarget.Global);
		vscode.window.showInformationMessage(`Snippet Browser: snippet folder set to ${folderPath}`);
		// Reload snippets from new folder
		allSnippets = [];
		const pattern = new vscode.RelativePattern(folderPath, '**/*.snippet');
		const uris = await vscode.workspace.findFiles(pattern);
		for (const uri of uris) {
			const bytes = await vscode.workspace.fs.readFile(uri);
			const content = new TextDecoder().decode(bytes);
			allSnippets.push(...parseSnippetFile(content));
		}
		vscode.window.showInformationMessage(`Snippet Browser: loaded ${allSnippets.length} snippets`);
	});
	context.subscriptions.push(setDisposable);

	// Register C#-specific commands for popular snippets
	const ifCsharpDisposable = vscode.commands.registerCommand('snippetbrowser.insertIfCsharp', async () => {
		// Prefer the exact "ifStatement" snippet over any else-if variants
		let snippet = allSnippets.find(s => s.languages.includes('csharp') && s.name.toLowerCase() === 'ifstatement');
		if (!snippet) {
			// Fallback to any snippet containing "if"
			snippet = allSnippets.find(s => s.languages.includes('csharp') && s.name.toLowerCase().includes('if'));
		}
		if (!snippet) { vscode.window.showErrorMessage('No C# if-statement snippet found'); return; }
		const editor = vscode.window.activeTextEditor;
		if (!editor) { vscode.window.showErrorMessage('No active editor to insert snippet into'); return; }
		editor.insertSnippet(new vscode.SnippetString(snippet.body));
	});
	context.subscriptions.push(ifCsharpDisposable);

	const forCsharpDisposable = vscode.commands.registerCommand('snippetbrowser.insertForCsharp', async () => {
		const snippet = allSnippets.find(s => s.languages.includes('csharp') && s.name.toLowerCase().includes('for'));
		if (!snippet) { vscode.window.showErrorMessage('No C# for-loop snippet found'); return; }
		const editor = vscode.window.activeTextEditor;
		if (!editor) { vscode.window.showErrorMessage('No active editor to insert snippet into'); return; }
		editor.insertSnippet(new vscode.SnippetString(snippet.body));
	});
	context.subscriptions.push(forCsharpDisposable);

	// Step 1: load snippet directory setting and discover .snippet files
	const config = vscode.workspace.getConfiguration('snippetbrowser');
	const snippetDir = config.get<string>('snippetPath') || '';
	if (!snippetDir) {
		// Prompt user to select snippet folder when none is configured
		const uris = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false, openLabel: 'Select Snippet Folder' });
		if (!uris || uris.length === 0) { return; }
		const selectedPath = uris[0].fsPath;
		await config.update('snippetPath', selectedPath, vscode.ConfigurationTarget.Global);
		vscode.window.showInformationMessage(`Snippet Browser: snippet folder set to ${selectedPath}`);
		// Load snippets from selected folder
		allSnippets = [];
		const selPattern = new vscode.RelativePattern(selectedPath, '**/*.snippet');
		const selUris = await vscode.workspace.findFiles(selPattern);
		for (const uri of selUris) {
			const bytes = await vscode.workspace.fs.readFile(uri);
			const content = new TextDecoder().decode(bytes);
			allSnippets.push(...parseSnippetFile(content));
		}
		vscode.window.showInformationMessage(`Snippet Browser: loaded ${allSnippets.length} snippets`);
	} else {
		const wsFolders = vscode.workspace.workspaceFolders;
		if (!wsFolders || wsFolders.length === 0) {
			vscode.window.showWarningMessage('snippetbrowser: open a workspace to load snippets');
		} else {
			const basePath = path.isAbsolute(snippetDir)
				? snippetDir
				: path.join(wsFolders[0].uri.fsPath, snippetDir);
			const pattern = new vscode.RelativePattern(basePath, '**/*.snippet');
			const snippetUris = await vscode.workspace.findFiles(pattern);
			console.log('Found .snippet files:', snippetUris.map(u => u.fsPath));
			// Parse each .snippet file into Snippet objects
			for (const uri of snippetUris) {
				const fileBytes = await vscode.workspace.fs.readFile(uri);
				const content = new TextDecoder().decode(fileBytes);
				const parsed = parseSnippetFile(content);
				allSnippets.push(...parsed);
			}
			console.log(`Loaded ${allSnippets.length} snippets`);
		}
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }
