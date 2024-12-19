import React from 'react';
import ReactDOM from 'react-dom/client';
import { VSCodeButton, VSCodeTextArea } from '@vscode/webview-ui-toolkit/react';
import './index.css';
import App from './App';

// Define custom elements
if (!customElements.get('vscode-button')) {
  customElements.define('vscode-button', VSCodeButton as any);
}
if (!customElements.get('vscode-text-area')) {
  customElements.define('vscode-text-area', VSCodeTextArea as any);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
