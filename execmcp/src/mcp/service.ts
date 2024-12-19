import * as vscode from 'vscode';
import { IMCPChatState, IMCPConfig, IMCPMessage, IMCPResponse, IMCPToolCall } from './types';
import { toolsMap } from './tools';

export class MCPService {
    private state: IMCPChatState;
    private readonly outputChannel: vscode.OutputChannel;

    constructor(config: IMCPConfig) {
        this.outputChannel = vscode.window.createOutputChannel('MCP Chat');
        this.state = {
            messages: [],
            context: {
                config,
                history: [],
            },
            activeTools: new Set(),
            pendingApprovals: new Map()
        };
    }

    public async handleMessage(message: string): Promise<string> {
        const userMessage: IMCPMessage = {
            role: 'user',
            content: message,
            timestamp: Date.now()
        };

        this.state.messages.push(userMessage);
        this.state.context.history.push({ role: 'user', content: message });

        try {
            // Here you would integrate with your AI model to get a response
            // For now, we'll just echo the message and demonstrate tool usage
            const response = await this.processMessage(message);
            await this.handleResponse(response);
            return response.type === 'completion' ? response.content as string : 'Tool execution completed';
        } catch (error: any) {
            const errorMessage = error?.message || 'Unknown error';
            this.outputChannel.appendLine(`Error: ${errorMessage}`);
            return `Error: ${errorMessage}`;
        }
    }

    public async processMessage(message: string): Promise<IMCPResponse> {
        // This is where you would integrate with your AI model
        // For now, we'll just create a simple response
        if (message.startsWith('/')) {
            const [command, ...args] = message.slice(1).split(' ');
            const tool = toolsMap.get(command);
            
            if (tool) {
                return {
                    type: 'tool-call',
                    content: {
                        tool: command,
                        params: { args: args.join(' ') }
                    }
                };
            }
        }

        return {
            type: 'completion',
            content: `Echo: ${message}`
        };
    }

    private async handleResponse(response: IMCPResponse): Promise<void> {
        switch (response.type) {
            case 'completion':
                this.addMessage('assistant', response.content as string);
                break;

            case 'tool-call': {
                const toolCall = response.content as IMCPToolCall;
                const tool = toolsMap.get(toolCall.tool);

                if (!tool) {
                    this.addMessage('assistant', `Tool not found: ${toolCall.tool}`);
                    return;
                }

                if (tool.requiresApproval && !this.state.context.config.autoApproveTools[tool.name]) {
                    this.state.pendingApprovals.set(tool.name, toolCall);
                    this.addMessage('assistant', `Tool ${tool.name} requires approval. Use the approve command.`);
                    return;
                }

                await this.executeTool(tool.name, toolCall.params);
                break;
            }

            case 'progress':
                this.state.context.progress = response.content;
                this.outputChannel.appendLine(`Progress: ${JSON.stringify(response.content)}`);
                break;
        }
    }

    private addMessage(role: string, content: string): void {
        const message: IMCPMessage = {
            role: role as 'user' | 'assistant' | 'tool',
            content,
            timestamp: Date.now()
        };

        this.state.messages.push(message);
        this.state.context.history.push({ role, content });
        this.outputChannel.appendLine(`${role}: ${content}`);
    }

    public async approveTool(toolName: string): Promise<void> {
        const toolCall = this.state.pendingApprovals.get(toolName);
        if (!toolCall) {
            this.addMessage('assistant', `No pending approval for tool: ${toolName}`);
            return;
        }

        this.state.pendingApprovals.delete(toolName);
        await this.executeTool(toolName, toolCall.params);
    }

    private async executeTool(toolName: string, params: Record<string, any>): Promise<void> {
        const tool = toolsMap.get(toolName);
        if (!tool) {
            this.addMessage('tool', `Tool not found: ${toolName}`);
            return;
        }

        if (this.state.activeTools.has(toolName)) {
            this.addMessage('tool', `Tool ${toolName} is already running`);
            return;
        }

        this.state.activeTools.add(toolName);

        try {
            const result = await tool.execute(params);
            this.addMessage('tool', result.success ? result.output || 'Success' : result.error || 'Tool execution failed');
        } catch (error: any) {
            this.addMessage('tool', `Tool execution error: ${error?.message || 'Unknown error'}`);
        } finally {
            this.state.activeTools.delete(toolName);
        }
    }

    public dispose(): void {
        this.outputChannel.dispose();
    }

    public getPendingApprovals(): [string, IMCPToolCall][] {
        return Array.from(this.state.pendingApprovals.entries());
    }
}
