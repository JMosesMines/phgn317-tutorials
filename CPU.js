import React from 'react';
import { createRoot } from 'react-dom/client';
// 1. Import your App component here (adjust the path if needed)
import App from './App.jsx'; 

const container = document.getElementById('CPU');
const root = createRoot(container);

// 2. Render your imported App component
root.render(<App />);
