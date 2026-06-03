import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { FONT_FACE_CSS } from './data/fonts';

const style = document.createElement('style');
style.textContent = FONT_FACE_CSS;
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
