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

    let settingsCommand = vscode.commands.registerCommand('helloWorld.openSettings', () => {
        helloWorldProvider.setView('settings');
    });

    context.subscriptions.push(helloWorldCommand, chatInterfaceCommand, settingsCommand);
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
        } else if (this.currentView === 'settings') {
            items.push(new HelloWorldItem(
                "Settings",
                vscode.TreeItemCollapsibleState.None
            ));
            items.push(new HelloWorldItem(
                "Settings panel for Hello World extension",
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
