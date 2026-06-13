import * as vscode from "vscode";
import { getNonce } from "./nonce";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "ready": {
          const labelType = this._context.globalState.get<string>("fa-gallery.labelType", "iconClassname");
          const clickBehavior = this._context.globalState.get<string>("fa-gallery.clickBehavior", "copy");
          const copyContent = this._context.globalState.get<string>("fa-gallery.copyContent", "classname");
          const gridType = this._context.globalState.get<string>("fa-gallery.gridType", "grid");
          const faVersion = this._context.globalState.get<string>("fa-gallery.faVersion", "v6");
          webviewView.webview.postMessage({
            command: "setInitialState",
            data: { labelType, clickBehavior, copyContent, gridType, faVersion },
          });
          break;
        }
        case "state-update": {
          const { gridType, faVersion, labelType, clickBehavior, copyContent } = data.content ?? {};
          if (gridType !== undefined) {this._context.globalState.update("fa-gallery.gridType", gridType);}
          if (faVersion !== undefined) {this._context.globalState.update("fa-gallery.faVersion", faVersion);}
          if (labelType !== undefined) {this._context.globalState.update("fa-gallery.labelType", labelType);}
          if (clickBehavior !== undefined) {this._context.globalState.update("fa-gallery.clickBehavior", clickBehavior);}
          if (copyContent !== undefined) {this._context.globalState.update("fa-gallery.copyContent", copyContent);}
          break;
        }
        case "insert-at-cursor": {
          const text = data.content?.text;
          if (!text) {return;}
          const editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showWarningMessage("Font Awesome Gallery: No active text editor found.");
            return;
          }
          editor.edit((editBuilder) => {
            editor.selections.forEach((selection) => {
              editBuilder.replace(selection, text);
            });
          });
          break;
        }
        case "onInfo": {
          if (!data.content) {return;}
          vscode.window.showInformationMessage(data.content.message);
          break;
        }
        case "onError": {
          if (!data.content) {return;}
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
      vscode.Uri.joinPath(this._context.extensionUri, "media", "reset.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "out", "compiled/Sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "out", "compiled/Sidebar.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "media", "vscode.css")
    );
    const fontawesomeV5CssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webviews", "data/fontawesome-5/css/all.min.css")
    );

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
          <link href="${fontawesomeV5CssUri}" rel="stylesheet">
	  	</head>
        <body>
           <script nonce="${nonce}" src="${scriptUri}"></script>
	  	</body>
	  </html>`;
  }
}
