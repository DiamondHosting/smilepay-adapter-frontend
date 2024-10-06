// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // 全域樣式（可選）

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
