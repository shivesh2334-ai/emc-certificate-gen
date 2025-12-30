import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // This imports Tailwind and your custom styles
import App from './App';

/**
 * React 18 Rendering Engine
 * This connects your code to the <div id="root"></div> inside index.html
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Optional: Performance Monitoring
 * If you want to measure how fast your app is loading, 
 * you can add web-vitals here later.
 */
