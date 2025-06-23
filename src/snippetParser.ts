export interface Snippet {
    name: string;
    description?: string;
    languages: string[];
    phrase?: string[];
    insertionScope?: string[];
    insertionFormatter?: string[];
    wrapperPhrase?: string[];
    wrapperScope?: string;
    body: string;
}

export function parseSnippetFile(content: string): Snippet[] {
    // Split file into documents on lines containing only '---'
    const parts = content.split(/^\s*---\s*$/m);
    let defaultContext: Record<string, string | string[]> = {};
    const snippets: Snippet[] = [];

    for (const part of parts) {
        const lines = part.split(/\r?\n/);
        // Find the first separator line of a single '-'
        const sepIndex = lines.findIndex(line => line.trim() === '-');
        let contextLines: string[];
        let bodyLines: string[];

        if (sepIndex >= 0) {
            contextLines = lines.slice(0, sepIndex);
            bodyLines = lines.slice(sepIndex + 1);
        } else {
            // No body: treat as default context
            contextLines = lines;
            bodyLines = [];
        }

        // Parse context key/value pairs
        const context: Record<string, string | string[]> = {};
        for (const line of contextLines) {
            const idx = line.indexOf(':');
            if (idx < 0) {
                continue;
            }
            const key = line.slice(0, idx).trim();
            const val = line.slice(idx + 1).trim();
            if (val.includes('|')) {
                context[key] = val.split('|').map(v => v.trim());
            } else {
                context[key] = val;
            }
        }

        // Default context document (no body)
        if (bodyLines.length === 0) {
            defaultContext = context;
            continue;
        }

        // Merge default context and specific context
        const merged: Record<string, string | string[]> = { ...defaultContext, ...context };

        snippets.push({
            name: merged['name'] as string,
            description: merged['description'] as string | undefined,
            languages: ([] as string[]).concat(merged['language'] || []),
            phrase: ([] as string[]).concat(merged['phrase'] || []),
            insertionScope: ([] as string[]).concat(merged['insertionScope'] || []),
            insertionFormatter: ([] as string[]).concat(merged['insertionFormatter'] || []),
            wrapperPhrase: ([] as string[]).concat(merged['wrapperPhrase'] || []),
            wrapperScope: merged['wrapperScope'] as string | undefined,
            body: bodyLines.join('\n').trim(),
        });
    }

    return snippets;
}
