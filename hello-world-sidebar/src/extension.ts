import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Create and register the tree data provider
    const helloWorldProvider = new HelloWorldProvider();
    vscode.window.registerTreeDataProvider('helloWorldView', helloWorldProvider);

    // Register commands
    let helloWorldCommand = vscode.commands.registerCommand('helloWorld.openHelloWorld', () => {
        helloWorldProvider.setView('hello');
    });

    let chatInterfaceCommand = vscode.commands.registerCommand('helloWorld.openChatInterface', () => {
        helloWorldProvider.setView('chat');
    });

    // Register the settings command
    let disposable = vscode.commands.registerCommand('helloWorld.openSettings', () => {
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
    private _onDidChangeTreeData: vscode.EventEmitter<HelloWorldItem | undefined | null | void> = new vscode.EventEmitter<HelloWorldItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<HelloWorldItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private currentView: string = 'hello';

    setView(view: string) {
        this.currentView = view;
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: HelloWorldItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<HelloWorldItem[]> {
        const items: HelloWorldItem[] = [];
        
        if (this.currentView === 'hello') {
            items.push(new HelloWorldItem(
                "Hello World!",
                vscode.TreeItemCollapsibleState.None
            ));
        } else if (this.currentView === 'chat') {
            items.push(new HelloWorldItem(
                "Chat Interface",
                vscode.TreeItemCollapsibleState.None
            ));
        }

        return Promise.resolve(items);
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
