import * as vscode from 'vscode';
import { MCPService } from './mcp/service';
import { IMCPConfig } from './mcp/types';

let mcpService: MCPService;

export function activate(context: vscode.ExtensionContext) {
    const config: IMCPConfig = {
        model: 'gpt-4', // Default model
        autoApproveTools: {
            'read_file': true,
            'list_files': true,
            'search_files': true
        },
        showProgress: true
    };

    mcpService = new MCPService(config);

        // Register the webview view provider
    const provider = new MCPChatViewProvider(context.extensionUri, mcpService);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('mcpChat', provider),
        vscode.commands.registerCommand('mcp.approvePendingTools', handleToolApprovals),
        mcpService
    );
}

async function handleToolApprovals() {
    const pendingApprovals = mcpService.getPendingApprovals();
    
    if (pendingApprovals.length === 0) {
        vscode.window.showInformationMessage('No tools pending approval');
        return;
    }

    const quickPickItems: vscode.QuickPickItem[] = pendingApprovals.map(([name, toolCall]) => ({
        label: name,
        description: `Tool: ${name}`,
        detail: `Parameters: ${JSON.stringify(toolCall.params)}`
    }));

    const selected = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select tools to approve',
        canPickMany: true
    });

    if (selected) {
        for (const item of selected) {
            await mcpService.approveTool(item.label);
        }
    }
}

class MCPChatViewProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _mcpService: MCPService
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtml(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.type) {
                case 'userInput':
                    await this._mcpService.handleMessage(message.content);
                    break;
                case 'approveTools':
                    await handleToolApprovals();
                    break;
            }
        });
    }

    private _getHtml(webview: vscode.Webview): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        margin: 0;
                        padding: 10px;
                        background: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .chat-container {
                        display: flex;
                        flex-direction: column;
                        height: 100vh;
                    }
                    .messages {
                        flex: 1;
                        overflow-y: auto;
                        margin-bottom: 10px;
                    }
                    .message {
                        margin: 5px 0;
                        padding: 5px;
                        border-radius: 5px;
                    }
                    .user {
                        background: var(--vscode-editor-selectionBackground);
                    }
                    .assistant {
                        background: var(--vscode-editor-inactiveSelectionBackground);
                    }
                    .input-container {
                        display: flex;
                        gap: 5px;
                    }
                    input {
                        flex: 1;
                        padding: 5px;
                        background: var(--vscode-input-background);
                        color: var(--vscode-input-foreground);
                        border: 1px solid var(--vscode-input-border);
                    }
                    button {
                        padding: 5px 10px;
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        cursor: pointer;
                    }
                    button:hover {
                        background: var(--vscode-button-hoverBackground);
                    }
                </style>
            </head>
            <body>
                <div class="chat-container">
                    <div class="messages" id="messages"></div>
                    <div class="input-container">
                        <input type="text" id="userInput" placeholder="Type your message...">
                        <button onclick="sendMessage()">Send</button>
                        <button onclick="approveTools()">Approve Tools</button>
                    </div>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    
                    function sendMessage() {
                        const input = document.getElementById('userInput');
                        const message = input.value.trim();
                        
                        if (message) {
                            vscode.postMessage({
                                type: 'userInput',
                                content: message
                            });
                            
                            addMessage('user', message);
                            input.value = '';
                        }
                    }
                    
                    function approveTools() {
                        vscode.postMessage({
                            type: 'approveTools'
                        });
                    }
                    
                    function addMessage(role, content) {
                        const messages = document.getElementById('messages');
                        const div = document.createElement('div');
                        div.className = \`message \${role}\`;
                        div.textContent = content;
                        messages.appendChild(div);
                        messages.scrollTop = messages.scrollHeight;
                    }
                    
                    document.getElementById('userInput').addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}

export function deactivate() {
    if (mcpService) {
        mcpService.dispose();
    }
}
