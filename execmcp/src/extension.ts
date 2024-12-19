import * as vscode from 'vscode';
import { MCPService } from './mcp/service';
import { IMCPConfig } from './mcp/types';
import { ClineProvider } from './core/webview/ClineProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating ExecMCP extension');

    // Get configuration
    const config = vscode.workspace.getConfiguration('execmcp');
    const mcpConfig: IMCPConfig = {
        autoApproveTools: config.get('autoApproveTools', {
            read_file: true,
            list_files: true,
            search_files: true
        })
    };

    const mcpService = new MCPService(mcpConfig);

    // Register webview provider
    const provider = new ClineProvider(context.extensionUri, mcpService);
    const providerRegistration = vscode.window.registerWebviewViewProvider(
        "execmcp.SidebarProvider",
        provider,
        {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        }
    );

    context.subscriptions.push(providerRegistration);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('execmcp.plusButtonClicked', () => {
            provider.sendMessage('newTask');
        }),
        vscode.commands.registerCommand('execmcp.mcpButtonClicked', () => {
            provider.sendMessage('showMcp');
        }),
        vscode.commands.registerCommand('execmcp.historyButtonClicked', () => {
            provider.sendMessage('showHistory');
        }),
        vscode.commands.registerCommand('execmcp.popoutButtonClicked', () => {
            provider.sendMessage('popout');
        }),
        vscode.commands.registerCommand('execmcp.settingsButtonClicked', () => {
            provider.sendMessage('showSettings');
        })
    );

    // Handle configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('execmcp')) {
                const newConfig = vscode.workspace.getConfiguration('execmcp');
                mcpConfig.autoApproveTools = newConfig.get('autoApproveTools', {
                    read_file: true,
                    list_files: true,
                    search_files: true
                });
            }
        })
    );

    // Show the webview
    vscode.commands.executeCommand('execmcp.SidebarProvider.focus').then(() => {
        console.log('ExecMCP webview focused');
    }, (error) => {
        console.error('Failed to focus ExecMCP webview:', error);
    });

    // Log activation
    vscode.window.showInformationMessage('ExecMCP extension is now active');
}

export function deactivate() {
    console.log('Deactivating ExecMCP extension');
}
