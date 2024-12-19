export interface IMCPConfig {
    model: string;
    autoApproveTools: Record<string, boolean>;
    showProgress: boolean;
}

export interface IMCPMessage {
    role: 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: number;
}

export interface IMCPHistoryItem {
    role: string;
    content: string;
}

export interface IMCPContext {
    config: IMCPConfig;
    history: IMCPHistoryItem[];
    progress?: Record<string, any>;
}

export interface IMCPChatState {
    messages: IMCPMessage[];
    context: IMCPContext;
    activeTools: Set<string>;
    pendingApprovals: Map<string, IMCPToolCall>;
}

export interface IMCPToolCall {
    tool: string;
    params: Record<string, any>;
}

export interface IMCPToolResult {
    success: boolean;
    output: string;
    error?: string;
}

export interface IMCPTool {
    name: string;
    description: string;
    requiresApproval: boolean;
    execute(params: Record<string, any>): Promise<IMCPToolResult>;
}

export type MCPResponseType = 'completion' | 'tool-call' | 'progress';

export interface IMCPResponse {
    type: MCPResponseType;
    content: string | IMCPToolCall | Record<string, any>;
}
