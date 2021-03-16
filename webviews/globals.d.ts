import * as _vscode from 'vscode';

declare global {
    const tsvscode: {
        postMessage: ({
            command: String,
            content: any
        }) => void
    }
}

export {};