declare module '@vscode/webview-ui-toolkit/react' {
    import { FC, ReactNode } from 'react';

    interface VSCodeButtonProps {
        appearance?: 'primary' | 'secondary' | 'icon';
        'aria-label'?: string;
        children?: ReactNode;
    }

    interface VSCodeTextAreaProps {
        value?: string;
        onChange?: (event: any) => void;
        onKeyDown?: (event: any) => void;
        placeholder?: string;
        resize?: 'none' | 'both' | 'horizontal' | 'vertical';
        style?: React.CSSProperties;
    }

    export const VSCodeButton: FC<VSCodeButtonProps>;
    export const VSCodeTextArea: FC<VSCodeTextAreaProps>;
}
