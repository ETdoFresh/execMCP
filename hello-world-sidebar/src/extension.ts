import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Create and register the tree data providers
    const helloWorldProvider = new HelloWorldProvider();
    const settingsProvider = new SettingsProvider();
    
    vscode.window.registerTreeDataProvider('helloWorldView', helloWorldProvider);
    vscode.window.registerTreeDataProvider('helloWorldSettings', settingsProvider);

    // Register the settings command
    let disposable = vscode.commands.registerCommand('helloWorld.openSettings', () => {
        const showSettings = context.workspaceState.get('helloWorld:showSettings', false);
        context.workspaceState.update('helloWorld:showSettings', !showSettings);
        vscode.commands.executeCommand('setContext', 'helloWorld:showSettings', !showSettings);
    });

    context.subscriptions.push(disposable);
}

class SettingsProvider implements vscode.TreeDataProvider<SettingsItem> {
    getTreeItem(element: SettingsItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<SettingsItem[]> {
        const items: SettingsItem[] = [
            new SettingsItem(
                "Settings",
                "Hello World extension settings",
                vscode.TreeItemCollapsibleState.None
            )
        ];
        return Promise.resolve(items);
    }
}

class SettingsItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.description = description;
    }
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
