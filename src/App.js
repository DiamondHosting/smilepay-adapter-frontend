// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoicePage from './components/InvoicePage';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/invoice/:invoice_id" element={<InvoicePage />} />
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
		</Router>
	);
}

export default App;
