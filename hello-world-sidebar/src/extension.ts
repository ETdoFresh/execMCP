import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Create and register the tree data provider
    const helloWorldProvider = new HelloWorldProvider();
    vscode.window.registerTreeDataProvider('helloWorldView', helloWorldProvider);

    // Create status bar items for each button with blue underline
    const homeButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    const chatButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    const settingsButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);

    // Function to update button styles
    const updateButtonStyles = (activeView: string) => {
        const blueUnderline = '$(debug-stackframe-active)'; // Using built-in icon as underline
        homeButton.text = `$(home)${activeView === 'hello' ? '\n' + blueUnderline : ''}`;
        chatButton.text = `$(comment)${activeView === 'chat' ? '\n' + blueUnderline : ''}`;
        settingsButton.text = `$(gear)${activeView === 'settings' ? '\n' + blueUnderline : ''}`;
        
        homeButton.show();
        chatButton.show();
        settingsButton.show();
    };

    // Register commands
    let helloWorldCommand = vscode.commands.registerCommand('helloWorld.openHelloWorld', () => {
        helloWorldProvider.setView('hello');
        updateButtonStyles('hello');
    });

    let chatInterfaceCommand = vscode.commands.registerCommand('helloWorld.openChatInterface', () => {
        helloWorldProvider.setView('chat');
        updateButtonStyles('chat');
    });

    let settingsCommand = vscode.commands.registerCommand('helloWorld.openSettings', () => {
        helloWorldProvider.setView('settings');
        updateButtonStyles('settings');
    });

    // Set initial button styles
    updateButtonStyles('hello');

    // Add all items to subscriptions
    context.subscriptions.push(
        helloWorldCommand, 
        chatInterfaceCommand, 
        settingsCommand,
        homeButton,
        chatButton,
        settingsButton
    );
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
