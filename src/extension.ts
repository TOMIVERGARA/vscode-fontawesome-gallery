// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

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

	//TEST CODE
	context.subscriptions.push(
	  vscode.commands.registerCommand("vscode-fontawesome-gallery.askQuestion", async () => {
	      const answer = await vscode.window.showInformationMessage('How was your day?', 'good', 'bad');

		  if(answer === "bad"){
			vscode.window.showInformationMessage('Im sorry!');
		  }else{
			vscode.window.showInformationMessage('Great!');
		  }
	  })
	)

	context.subscriptions.push(
	  vscode.commands.registerCommand("vscode-fontawesome-gallery.refresh", async () => {
	      await vscode.commands.executeCommand('workbench.action.closeSidebar')
		  await vscode.commands.executeCommand('workbench.view.extension.vscode-fontawesome-gallery-sidebar')
		  setTimeout(() => vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools'), 500);
	  })
	)
}

// this method is called when your extension is deactivated
export function deactivate() {}
