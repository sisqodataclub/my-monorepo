import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Signal to vite-plugin-prerender that the app is fully rendered
setTimeout(() => {
  document.dispatchEvent(new Event('custom-render-trigger'));
}, 0);
