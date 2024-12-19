import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Create and register the tree data provider
    const helloWorldProvider = new HelloWorldProvider();
    vscode.window.registerTreeDataProvider('helloWorldView', helloWorldProvider);

    // Register commands
    let helloWorldCommand = vscode.commands.registerCommand('helloWorld.openHelloWorld', () => {
        const panel = vscode.window.createWebviewPanel(
            'helloWorld',
            'Hello World!',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );
        panel.webview.html = getHelloWorldWebviewContent();
    });

    let chatInterfaceCommand = vscode.commands.registerCommand('helloWorld.openChatInterface', () => {
        const panel = vscode.window.createWebviewPanel(
            'chatInterface',
            'Chat Interface',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );
        panel.webview.html = getChatInterfaceWebviewContent();
    });

    // Register the settings command
    let disposable = vscode.commands.registerCommand('helloWorld.openSettings', () => {
        // Create and show settings panel
        const panel = vscode.window.createWebviewPanel(
            'helloWorldSettings',
            'Settings',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getSettingsWebviewContent();
    });

    context.subscriptions.push(disposable, helloWorldCommand, chatInterfaceCommand);
}

function getHelloWorldWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello World!</title>
        <style>
            body {
                padding: 20px;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
            }
            h1 {
                color: var(--vscode-editor-foreground);
                font-size: 2em;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <h1>Hello World!</h1>
        <p>Welcome to the Hello World page!</p>
    </body>
    </html>`;
}

function getChatInterfaceWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chat Interface</title>
        <style>
            body {
                padding: 20px;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
            }
            h1 {
                color: var(--vscode-editor-foreground);
                font-size: 2em;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <h1>Chat Interface</h1>
        <p>Welcome to the Chat Interface page!</p>
    </body>
    </html>`;
}

function getSettingsWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello World Settings</title>
        <style>
            body {
                padding: 20px;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
            }
            .setting-item {
                margin-bottom: 20px;
            }
            h2 {
                color: var(--vscode-editor-foreground);
                font-size: 1.2em;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <h2>Hello World Settings</h2>
        <div class="setting-item">
            <p>Settings panel for Hello World extension</p>
        </div>
    </body>
    </html>`;
}

class HelloWorldProvider implements vscode.TreeDataProvider<HelloWorldItem> {
    getTreeItem(element: HelloWorldItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<HelloWorldItem[]> {
        const item = new HelloWorldItem(
            "Hello World!",
            vscode.TreeItemCollapsibleState.None
        );
        return Promise.resolve([item]);
    }
}

class HelloWorldItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}

export function deactivate() {}
