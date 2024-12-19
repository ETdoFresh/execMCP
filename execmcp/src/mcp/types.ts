export interface IMCPConfig {
    autoApproveTools: Record<string, boolean>;
}

export interface IMCPMessage {
    role: 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: number;
}

export interface IMCPContext {
    config: IMCPConfig;
    history: Array<{ role: string; content: string }>;
    progress?: any;
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

export type IMCPResponse = {
    type: 'completion' | 'tool-call' | 'progress';
    content: string | IMCPToolCall | any;
}

export interface IMCPTool {
    name: string;
    description: string;
    requiresApproval: boolean;
    execute: (params: Record<string, any>) => Promise<{
        success: boolean;
        output?: string;
        error?: string;
    }>;
}
