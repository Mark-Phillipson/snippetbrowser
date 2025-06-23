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

	// Step 1: load snippet directory setting and discover .snippet files
	const config = vscode.workspace.getConfiguration('snippetbrowser');
	const snippetDir = config.get<string>('snippetPath') || '';
	if (!snippetDir) {
		vscode.window.showWarningMessage('snippetbrowser: "snippetPath" setting is not set');
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
