import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vscode-fontawesome-gallery-sidebar",
      sidebarProvider
    )
  );

  // Restore context vars so menu when-clauses work from the first load
  const initialClickBehavior = context.globalState.get<string>("fa-gallery.clickBehavior", "copy");
  const initialCopyContent = context.globalState.get<string>("fa-gallery.copyContent", "classname");
  vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.clickBehavior", initialClickBehavior);
  vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.copyContent", initialCopyContent);

  const setFaVersion = (faVersionN: number) => {
    vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.faVersion", faVersionN);
  };

  const postToWebview = (message: object) =>
    sidebarProvider._view?.webview.postMessage(message);

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
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setLabelType", data: "iconUnicode" });
        context.globalState.update("fa-gallery.labelType", "iconUnicode");
        await vscode.window.showInformationMessage(
          "The icon label has ben changed to unicode 🎉"
        );
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.code-type-classname",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setLabelType", data: "iconClassname" });
        context.globalState.update("fa-gallery.labelType", "iconClassname");
        await vscode.window.showInformationMessage(
          "The icon label has ben changed to class name 🎉"
        );
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.set-click-copy",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setClickBehavior", data: "copy" });
        context.globalState.update("fa-gallery.clickBehavior", "copy");
        vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.clickBehavior", "copy");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.set-click-insert",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setClickBehavior", data: "insert" });
        context.globalState.update("fa-gallery.clickBehavior", "insert");
        vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.clickBehavior", "insert");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.set-copy-content-classname",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setCopyContent", data: "classname" });
        context.globalState.update("fa-gallery.copyContent", "classname");
        vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.copyContent", "classname");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.set-copy-content-html",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setCopyContent", data: "html" });
        context.globalState.update("fa-gallery.copyContent", "html");
        vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.copyContent", "html");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.set-copy-content-unicode",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setCopyContent", data: "unicode" });
        context.globalState.update("fa-gallery.copyContent", "unicode");
        vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.copyContent", "unicode");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.set-copy-content-vue",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setCopyContent", data: "vue" });
        context.globalState.update("fa-gallery.copyContent", "vue");
        vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.copyContent", "vue");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.set-copy-content-react",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setCopyContent", data: "react" });
        context.globalState.update("fa-gallery.copyContent", "react");
        vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.copyContent", "react");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.set-copy-content-svg",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setCopyContent", data: "svg" });
        context.globalState.update("fa-gallery.copyContent", "svg");
        vscode.commands.executeCommand("setContext", "vscode-fontawesome-gallery.copyContent", "svg");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.switch-version-5",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setFaVersion", data: "v5" });
        setFaVersion(5);
        await vscode.window.showInformationMessage("Using FontAwesome 5 🎉");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.switch-version-6",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setFaVersion", data: "v6" });
        setFaVersion(6);
        await vscode.window.showInformationMessage("Using FontAwesome 6 🎉");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.switch-version-7",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "setFaVersion", data: "v7" });
        setFaVersion(7);
        await vscode.window.showInformationMessage("Using FontAwesome 7 🎉");
      }
    ),
    vscode.commands.registerCommand(
      "vscode-fontawesome-gallery.toggle-grid-type",
      async () => {
        if (!sidebarProvider) {return;}
        postToWebview({ command: "toggleGridType", data: null });
      }
    )
  );
}

export function deactivate() {}
