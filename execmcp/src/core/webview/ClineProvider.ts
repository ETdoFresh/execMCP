import * as vscode from 'vscode';
import { MCPService } from '../../mcp/service';
import { getNonce } from './getNonce';

export class ClineProvider implements vscode.WebviewViewProvider {
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
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'webview-ui', 'build')
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            try {
                switch (data.type) {
                    case 'mcpRequest':
                        const response = await this._mcpService.handleMessage(data.message);
                        this.sendMessage('response', { content: response });
                        break;
                    case 'approveTool':
                        await this._mcpService.approveTool(data.toolName);
                        break;
                    case 'error':
                        console.error('Webview error:', data.error);
                        vscode.window.showErrorMessage(`Webview error: ${data.error}`);
                        break;
                }
            } catch (error) {
                console.error('Error handling webview message:', error);
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Error: ${error.message}`);
                }
            }
        });

        // Log that webview is initialized
        console.log('ExecMCP webview initialized');
    }

    public sendMessage(type: string, data: any = {}) {
        if (this._view) {
            this._view.webview.postMessage({ type, ...data });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get URIs for built files
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'webview-ui', 'build', 'static', 'js', 'main.5f2c6fb4.js')
        );

        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'webview-ui', 'build', 'static', 'css', 'main.87f7962c.css')
        );

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src ${webview.cspSource} 'self'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-eval' 'unsafe-inline'; img-src ${webview.cspSource} https: data:; font-src ${webview.cspSource};">
                <link href="${styleMainUri}" rel="stylesheet">
                <title>ExecMCP</title>
                <script>
                    window.addEventListener('error', function(e) {
                        const vscode = acquireVsCodeApi();
                        vscode.postMessage({
                            type: 'error',
                            error: e.message
                        });
                    });
                </script>
            </head>
            <body>
                <div id="root"></div>
                <script>
                    try {
                        const vscode = acquireVsCodeApi();
                        window.vscode = vscode;
                    } catch (error) {
                        console.error('Failed to acquire VS Code API', error);
                    }
                </script>
                <script type="module" src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}
