/// <reference types="react-scripts" />

declare module '@vscode/webview-ui-toolkit/react' {
    export const VSCodeButton: React.FC<{
        appearance?: 'primary' | 'secondary' | 'icon';
        'aria-label'?: string;
        children?: React.ReactNode;
    }>;
}
