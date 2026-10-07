import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

(window as unknown as Record<string, boolean>).__VITE_APP_MOUNTED__ = true;

const rootEl = document.getElementById('root');
if (rootEl && !rootEl.hasAttribute('data-mounted')) {
  rootEl.setAttribute('data-mounted', 'true');
  createRoot(rootEl).render(<App />);
}
