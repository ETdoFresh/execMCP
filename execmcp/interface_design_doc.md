# ExecMCP Interface Design Document

## System Overview

ExecMCP is a VSCode extension that provides a powerful interface for executing Model Context Protocol (MCP) tools through a chat-like interface. It integrates with VSCode's webview system to provide a seamless user experience while maintaining security and performance.

## Architecture

The system follows a modular architecture with clear separation of concerns:

```
execmcp/
├── src/
│   ├── core/webview/      # Webview core functionality
│   ├── mcp/              # MCP implementation
│   └── extension.ts      # Extension entry point
└── webview-ui/           # React-based UI components
```

### Key Components

1. **Extension Host** (`extension.ts`)
   - Manages extension lifecycle
   - Handles VSCode integration
   - Configures and initializes core services

2. **Webview Provider** (`ClineProvider.ts`)
   - Manages webview lifecycle
   - Handles communication between webview and extension
   - Implements security policies
   - Manages HTML/CSS/JS resource loading

3. **MCP Service** (`service.ts`)
   - Handles MCP message processing
   - Manages tool execution
   - Maintains chat state and history
   - Handles tool approval workflow

4. **Tool System** (`tools.ts`)
   - Implements core MCP tools
   - Provides tool registration mechanism
   - Handles tool execution security

## Chat and LLM Workflow

### Overview
ExecMCP implements a sophisticated chat-based workflow where users interact with a Large Language Model (LLM) to accomplish tasks. The LLM acts as an intelligent agent that can understand requests, formulate plans, and execute them using available tools.

### Workflow Steps

1. **User Request**
   - User submits a natural language request via chat interface
   - Request is captured and formatted with relevant context
   - System state and environment details are gathered

2. **LLM Processing**
   - LLM receives the request with full context
   - Analyzes the task requirements
   - Accesses available tools and capabilities
   - Formulates a step-by-step execution plan

3. **Execution Strategy**
   - LLM executes one tool at a time
   - Waits for and analyzes results after each step
   - Adapts plan based on results and feedback
   - Handles errors and unexpected situations
   - Replans steps if necessary

4. **Feedback Loop**
   - Each tool execution provides feedback
   - LLM analyzes success/failure
   - Adjusts subsequent steps accordingly
   - Maintains conversation context
   - Tracks overall progress

5. **Task Completion**
   - Verifies all steps are completed
   - Summarizes results for user
   - Provides relevant output or demonstrations
   - Handles any necessary cleanup

### Example Flow
```
User: "Create a new React component"
↓
LLM: Analyzes request, plans steps
↓
1. Check project structure
2. Create component file
3. Write component code
4. Update imports
5. Test component
↓
Execute each step with appropriate tool
↓
Adapt plan if issues arise
↓
Present final result to user
```

## System Communication Flow

1. **User Input → Extension**
   ```
   User Input → Webview UI → ClineProvider → MCPService
   ```

2. **Tool Execution Flow**
   ```
   MCPService → Tool Validation → Approval Check → Execution → Response
   ```

3. **Response Flow**
   ```
   MCPService → ClineProvider → Webview UI → User Display
   ```

## Core Interfaces

### MCP Message Structure
```typescript
interface IMCPMessage {
    role: 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: number;
}
```

### Tool Interface
```typescript
interface IMCPTool {
    name: string;
    description: string;
    requiresApproval: boolean;
    execute: (params: Record<string, any>) => Promise<{
        success: boolean;
        output?: string;
        error?: string;
    }>;
}
```

### Chat State Management
```typescript
interface IMCPChatState {
    messages: IMCPMessage[];
    context: IMCPContext;
    activeTools: Set<string>;
    pendingApprovals: Map<string, IMCPToolCall>;
}
```

## Security Model

1. **Content Security Policy**
   - Strict CSP implementation in webview
   - Limited script execution
   - Controlled resource loading

2. **Tool Approval System**
   - Tools can require explicit approval
   - Configurable auto-approval settings
   - Approval state tracking

3. **Resource Access**
   - Controlled file system access
   - Sandboxed command execution
   - Limited network access

## Tool System

### Built-in Tools

1. **read_file**
   - Reads file contents
   - No approval required
   - UTF-8 encoding

2. **write_file**
   - Writes content to files
   - Requires approval
   - Creates directories as needed

3. **list_files**
   - Lists directory contents
   - Supports recursive listing
   - No approval required

4. **execute_command**
   - Executes shell commands
   - Requires approval
   - Runs in VSCode terminal

### Tool Execution Flow

1. Tool request validation
2. Parameter verification
3. Approval check
4. Execution in controlled environment
5. Result capture and formatting
6. Response delivery

## Configuration

### Extension Settings
```typescript
interface IMCPConfig {
    autoApproveTools: Record<string, boolean>;
}
```

### Webview Configuration
- Script execution enabled
- Local resource roots configured
- CSP headers implemented
- Nonce-based script validation

## User Interface Guidelines

1. **Chat Interface**
   - Clear message attribution
   - Tool execution status indicators
   - Error handling and display
   - Progress feedback

2. **Tool Approval UI**
   - Clear approval requests
   - Tool details display
   - Action confirmation
   - Status feedback

3. **Command Integration**
   - Toolbar commands
   - Command palette integration
   - Context menu actions
   - Keyboard shortcuts

## Error Handling

1. **Tool Execution Errors**
   - Detailed error messages
   - Error classification
   - Recovery options
   - User feedback

2. **Communication Errors**
   - Connection recovery
   - Message retry logic
   - State synchronization
   - Error reporting

## Future Considerations

1. **Extensibility**
   - Plugin system for custom tools
   - Tool marketplace integration
   - Custom UI components
   - Enhanced security models

2. **Performance**
   - Message batching
   - Resource caching
   - Lazy loading
   - State management optimization

3. **Integration**
   - Additional VSCode features
   - External service connections
   - Authentication systems
   - Collaborative features
