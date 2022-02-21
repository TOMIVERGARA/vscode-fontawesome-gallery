// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vscode-fontawesome-gallery-sidebar",
      sidebarProvider
    )
  );

  const setFaVersion = (faVersionN: number) => {
    vscode.commands.executeCommand('setContext', 'vscode-fontawesome-gallery.faVersion', faVersionN);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.refresh",
      async () => {
        await vscode.commands.executeCommand("workbench.action.closeSidebar");
        await vscode.commands.executeCommand(
          "workbench.view.extension.vscode-fontawesome-gallery-sidebar"
        );
        setTimeout(
          () =>
            vscode.commands.executeCommand(
              "workbench.action.webview.openDeveloperTools"
            ),
          500
        );
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.code-type-unicode",
      async () => {
        if (!sidebarProvider) return;
        sidebarProvider._view?.webview.postMessage({
          command: "setLabelType",
          data: "iconUnicode",
        });
        await vscode.window.showInformationMessage(
          "The icon label has ben changed to unicode 🎉"
        );
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.code-type-classname",
      async () => {
        if (!sidebarProvider) return;
        sidebarProvider._view?.webview.postMessage({
          command: "setLabelType",
          data: "iconClassname",
        });
        await vscode.window.showInformationMessage(
          "The icon label has ben changed to class name 🎉"
        );
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.switch-version-5",
      async () => {
        if (!sidebarProvider) return;
        sidebarProvider._view?.webview.postMessage({
          command: "setFaVersion",
          data: "v5",
        });
        setFaVersion(5);
        await vscode.window.showInformationMessage(
          "Using FontAwesome 5 🎉"
        );
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.switch-version-6",
      async () => {
        if (!sidebarProvider) return;
        sidebarProvider._view?.webview.postMessage({
          command: "setFaVersion",
          data: "v6",
        });
        setFaVersion(6);
        await vscode.window.showInformationMessage(
          "Using FontAwesome 6 🎉" 
        );
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.toggle-grid-type",
      async () => {
        if (!sidebarProvider) return;
        sidebarProvider._view?.webview.postMessage({
          command: "toggleGridType",
          data: null,
        });
      }
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
