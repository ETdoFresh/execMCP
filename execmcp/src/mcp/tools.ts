import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IMCPTool, IMCPToolResult } from './types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const readFileTool: IMCPTool = {
    name: 'read_file',
    description: 'Read contents of a file',
    requiresApproval: false,
    async execute(params: { path: string }): Promise<IMCPToolResult> {
        try {
            const content = await fs.readFile(params.path, 'utf-8');
            return { success: true, output: content };
        } catch (error: any) {
            return { success: false, output: '', error: error?.message || 'Unknown error' };
        }
    }
};

export const writeFileTool: IMCPTool = {
    name: 'write_to_file',
    description: 'Write content to a file',
    requiresApproval: true,
    async execute(params: { path: string; content: string }): Promise<IMCPToolResult> {
        try {
            await fs.mkdir(path.dirname(params.path), { recursive: true });
            await fs.writeFile(params.path, params.content);
            return { success: true, output: `File written successfully: ${params.path}` };
        } catch (error: any) {
            return { success: false, output: '', error: error?.message || 'Unknown error' };
        }
    }
};

export const executeCommandTool: IMCPTool = {
    name: 'execute_command',
    description: 'Execute a shell command',
    requiresApproval: true,
    async execute(params: { command: string }): Promise<IMCPToolResult> {
        try {
            const { stdout, stderr } = await execAsync(params.command);
            return { 
                success: !stderr,
                output: stdout,
                error: stderr || undefined
            };
        } catch (error: any) {
            return { success: false, output: '', error: error?.message || 'Unknown error' };
        }
    }
};

export const searchFilesTool: IMCPTool = {
    name: 'search_files',
    description: 'Search for files matching a pattern',
    requiresApproval: false,
    async execute(params: { pattern: string; path: string }): Promise<IMCPToolResult> {
        try {
            const files = await vscode.workspace.findFiles(
                new vscode.RelativePattern(params.path, params.pattern)
            );
            return { 
                success: true,
                output: files.map(f => f.fsPath).join('\n')
            };
        } catch (error: any) {
            return { success: false, output: '', error: error?.message || 'Unknown error' };
        }
    }
};

export const listFilesTool: IMCPTool = {
    name: 'list_files',
    description: 'List files in a directory',
    requiresApproval: false,
    async execute(params: { path: string }): Promise<IMCPToolResult> {
        try {
            const files = await fs.readdir(params.path);
            return { success: true, output: files.join('\n') };
        } catch (error: any) {
            return { success: false, output: '', error: error?.message || 'Unknown error' };
        }
    }
};

export const replaceInFileTool: IMCPTool = {
    name: 'replace_in_file',
    description: 'Replace content in a file',
    requiresApproval: true,
    async execute(params: { path: string; search: string; replace: string }): Promise<IMCPToolResult> {
        try {
            const content = await fs.readFile(params.path, 'utf-8');
            const newContent = content.replace(params.search, params.replace);
            await fs.writeFile(params.path, newContent);
            return { success: true, output: `File updated successfully: ${params.path}` };
        } catch (error: any) {
            return { success: false, output: '', error: error?.message || 'Unknown error' };
        }
    }
};

export const tools: IMCPTool[] = [
    readFileTool,
    writeFileTool,
    executeCommandTool,
    searchFilesTool,
    listFilesTool,
    replaceInFileTool
];

export const toolsMap = new Map<string, IMCPTool>(
    tools.map(tool => [tool.name, tool])
);
