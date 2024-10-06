import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InvoicePage from './components/InvoicePage';

function RedirectToExternal() {
    useEffect(() => {
        window.location.href = 'https://store.mcloudtw.com';
    }, []);

    return null; // 返回空的內容，因為我們只是進行重定向
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/invoice/:invoice_id" element={<InvoicePage />} />
                {/* 所有不符合的路由將會被導向到外部網址 */}
                <Route path="*" element={<RedirectToExternal />} />
            </Routes>
        </Router>
    );
}

export default App;
