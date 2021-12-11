// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setUpLocalPwaStarterRepository } from './services/new-pwa-starter';
import { handleServiceWorkerCommand } from './services/service-worker';
import { packageApp } from './services/package-app';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pwa-studio" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const addServiceWorker = vscode.commands.registerCommand('pwa-studio.serviceWorker', async () => {
		console.log("doing stuff! ");
		await handleServiceWorkerCommand();
	});

	let newPwaStarterCommand = vscode.commands.registerCommand('pwa-studio.newPwaStarter', setUpLocalPwaStarterRepository);
	let packageAppCommand = vscode.commands.registerCommand('pwa-studio.packageApp', packageApp);

	context.subscriptions.push(newPwaStarterCommand);
	context.subscriptions.push(addServiceWorker);
	context.subscriptions.push(packageAppCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
