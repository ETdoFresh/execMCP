# VS Code MCP Extension

A Visual Studio Code extension that provides a chat interface for the Model Context Protocol (MCP). This extension enables developers to interact with AI models through a chat interface while leveraging MCP tools for file operations, command execution, and more.

## Features

- Chat interface for interacting with AI models
- Support for multiple AI models (configurable)
- Built-in MCP tools:
  - File operations (read, write, search)
  - Command execution
  - Directory listing
  - File content replacement
- Tool approval system for sensitive operations
- Progress tracking for long-running operations
- VS Code theme-aware UI

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Press F5 to start debugging

Or install from the VS Code Marketplace (coming soon).

## Usage

1. Open the command palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type "MCP: Open Chat" and press Enter
3. Start chatting with the AI model

### Available Commands

- `MCP: Open Chat` - Opens the chat interface
- `MCP: Approve Pending Tools` - Shows a list of tools waiting for approval

### Tool Commands

Tools can be called directly using the following format:
- `/read_file <path>` - Read a file's contents
- `/write_to_file <path> <content>` - Write content to a file
- `/execute_command <command>` - Execute a shell command
- `/search_files <pattern> <path>` - Search for files
- `/list_files <path>` - List directory contents
- `/replace_in_file <path> <search> <replace>` - Replace content in a file

### Configuration

The extension can be configured through VS Code settings:

```json
{
  "mcp.model": "gpt-4",
  "mcp.autoApproveTools": {
    "read_file": true,
    "list_files": true,
    "search_files": true
  },
  "mcp.showProgress": true
}
```

## Development

### Project Structure

```
execmcp/
├── src/
│   ├── extension.ts      # Extension entry point
│   └── mcp/
│       ├── service.ts    # MCP service implementation
│       ├── tools.ts      # MCP tools implementation
│       └── types.ts      # TypeScript interfaces
├── package.json         # Extension manifest
└── README.md           # This file
```

### Building

1. Run `npm run compile` to compile the TypeScript code
2. Run `npm run watch` to watch for changes during development
3. Run `npm run lint` to check for code style issues

### Testing

Run `npm test` to execute the test suite.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Security

Tools that can modify files or execute commands require explicit approval unless configured otherwise in settings. Be careful when auto-approving tools that can modify your system.
