import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IMCPTool } from './types';

export const toolsMap = new Map<string, IMCPTool>([
    ['read_file', {
        name: 'read_file',
        description: 'Read contents of a file',
        requiresApproval: false,
        execute: async (params) => {
            try {
                const filePath = params.path;
                if (!filePath) {
                    throw new Error('Path parameter is required');
                }

                const content = await fs.readFile(filePath, 'utf8');
                return {
                    success: true,
                    output: content
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }],
    ['write_file', {
        name: 'write_file',
        description: 'Write content to a file',
        requiresApproval: true,
        execute: async (params) => {
            try {
                const { path: filePath, content } = params;
                if (!filePath || content === undefined) {
                    throw new Error('Path and content parameters are required');
                }

                // Create directories if they don't exist
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, content, 'utf8');

                return {
                    success: true,
                    output: `Successfully wrote to file: ${filePath}`
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }],
    ['list_files', {
        name: 'list_files',
        description: 'List files in a directory',
        requiresApproval: false,
        execute: async (params) => {
            try {
                const dirPath = params.path || '.';
                const recursive = params.recursive === true;

                if (recursive) {
                    const files: string[] = [];
                    async function walk(dir: string) {
                        const items = await fs.readdir(dir, { withFileTypes: true });
                        for (const item of items) {
                            const fullPath = path.join(dir, item.name);
                            if (item.isDirectory()) {
                                await walk(fullPath);
                            } else {
                                files.push(fullPath);
                            }
                        }
                    }
                    await walk(dirPath);
                    return {
                        success: true,
                        output: files.join('\n')
                    };
                } else {
                    const files = await fs.readdir(dirPath);
                    return {
                        success: true,
                        output: files.join('\n')
                    };
                }
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }],
    ['execute_command', {
        name: 'execute_command',
        description: 'Execute a shell command',
        requiresApproval: true,
        execute: async (params) => {
            try {
                const { command } = params;
                if (!command) {
                    throw new Error('Command parameter is required');
                }

                const terminal = vscode.window.createTerminal('ExecMCP');
                terminal.show();
                terminal.sendText(command);

                return {
                    success: true,
                    output: `Executing command: ${command}`
                };
            } catch (error: any) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }]
]);
