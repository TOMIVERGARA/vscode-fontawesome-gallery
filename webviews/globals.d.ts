import * as _vscode from 'vscode';

declare global {
    function acquireVsCodeApi(): {
        postMessage: ({
            command: String,
            content: any
        }) => void;
        getState: () => any;
        setState: (state: any) => void;
    }
}

export {};