import * as vscode from "vscode";
import { getNonce } from "./nonce";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "onInfo": {
          if (!data.content) return;
            vscode.window.showInformationMessage(data.content.message);
          break;
        }
        case "onError": {
          if (!data.content) return;
            vscode.window.showErrorMessage(data.content.message);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/Sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/Sidebar.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const styleBassCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "basscss.min.css")
    );

    //FontAwesome Lib
    const fontawesomeCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "webviews", "data/fontawesome-5/css/all.min.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
	  <html lang="en">
	  	<head>
	  	    <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
	  	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  	    <link href="${styleResetUri}" rel="stylesheet">
	  	    <link href="${styleVSCodeUri}" rel="stylesheet">
          <link href="${styleMainUri}" rel="stylesheet">
          <link href="${styleBassCssUri}" rel="stylesheet">
          <link href="${fontawesomeCssUri}" rel="stylesheet">
	  	</head>
        <body>
           <script nonce="${nonce}" src="${scriptUri}"></script>
           <script nonce="${nonce}">
              const tsvscode = acquireVsCodeApi();
           </script>
	  	</body>
	  </html>`;
  }
}