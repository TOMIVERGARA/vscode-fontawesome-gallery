import * as vscode from "vscode";
import { getNonce } from "./nonce";
import { version } from "../package.json";

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
          const iconSize = this._context.globalState.get<number>("fa-gallery.iconSize", 1);
          const favorites = this._context.globalState.get<string[]>("fa-gallery.favorites", []);
          const recents = this._context.globalState.get<string[]>("fa-gallery.recents", []);
          const lastSeenVersion = this._context.globalState.get<string>("fa-gallery.lastSeenVersion", "");
          const showWhatsNew = lastSeenVersion !== version;
          webviewView.webview.postMessage({
            command: "setInitialState",
            data: { labelType, clickBehavior, copyContent, gridType, faVersion, iconSize, favorites, recents, showWhatsNew },
          });
          break;
        }
        case "state-update": {
          const { gridType, faVersion, labelType, clickBehavior, copyContent, iconSize } = data.content ?? {};
          if (gridType !== undefined) {this._context.globalState.update("fa-gallery.gridType", gridType);}
          if (faVersion !== undefined) {this._context.globalState.update("fa-gallery.faVersion", faVersion);}
          if (labelType !== undefined) {this._context.globalState.update("fa-gallery.labelType", labelType);}
          if (clickBehavior !== undefined) {this._context.globalState.update("fa-gallery.clickBehavior", clickBehavior);}
          if (copyContent !== undefined) {this._context.globalState.update("fa-gallery.copyContent", copyContent);}
          if (iconSize !== undefined) {this._context.globalState.update("fa-gallery.iconSize", iconSize);}
          break;
        }
        case "toggle-favorite": {
          const key = data.content?.key as string;
          if (!key) break;
          const favs = this._context.globalState.get<string[]>("fa-gallery.favorites", []);
          const idx = favs.indexOf(key);
          const updated = idx === -1 ? [...favs, key] : favs.filter((_, i) => i !== idx);
          this._context.globalState.update("fa-gallery.favorites", updated);
          webviewView.webview.postMessage({ command: "favoritesUpdated", data: updated });
          break;
        }
        case "log-recent": {
          const key = data.content?.key as string;
          if (!key) break;
          const recents = this._context.globalState.get<string[]>("fa-gallery.recents", []);
          const updated = [key, ...recents.filter((k) => k !== key)].slice(0, 20);
          this._context.globalState.update("fa-gallery.recents", updated);
          webviewView.webview.postMessage({ command: "recentsUpdated", data: updated });
          break;
        }
        case "dismiss-whats-new": {
          this._context.globalState.update("fa-gallery.lastSeenVersion", version);
          break;
        }
        case "open-external": {
          const url = data.content?.url as string;
          if (url) {vscode.env.openExternal(vscode.Uri.parse(url));}
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

    // Cache-busting: VS Code caches linked webview resources by URI, so after a
    // rebuild the new Sidebar.js (with a fresh Svelte scope hash) can be paired
    // with a stale cached Sidebar.css, breaking scoped style matching. A unique
    // query per HTML render forces both compiled assets to be refetched together.
    const cacheBust = `?v=${nonce}`;

    return `<!DOCTYPE html>
	  <html lang="en">
	  	<head>
	  	    <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
	  	    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  	    <link href="${styleResetUri}" rel="stylesheet">
	  	    <link href="${styleVSCodeUri}" rel="stylesheet">
          <link href="${styleMainUri}${cacheBust}" rel="stylesheet">
          <link href="${fontawesomeV5CssUri}" rel="stylesheet">
	  	</head>
        <body>
           <script nonce="${nonce}" src="${scriptUri}${cacheBust}"></script>
	  	</body>
	  </html>`;
  }
}
