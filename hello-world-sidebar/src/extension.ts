import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Create and register the tree data provider
    const helloWorldProvider = new HelloWorldProvider();
    vscode.window.registerTreeDataProvider('helloWorldView', helloWorldProvider);
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
