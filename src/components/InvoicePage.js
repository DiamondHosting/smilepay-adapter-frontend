// src/components/InvoicePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import StoreSelector from './StoreSelector';
import './InvoicePage.css'; // 確保有此 CSS 文件

function InvoicePage() {
	const { invoice_id } = useParams();
	const [invoice, setInvoice] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [canChangeStore, setCanChangeStore] = useState(true);
	const [timeLeft, setTimeLeft] = useState('');

	const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://test.api.com';

	// 設置頁面標題和元標籤
	useEffect(() => {
		// 可以根據需要動態設置
		document.title = '雲麥網路工作室帳務處理中心';
	}, []);

	useEffect(() => {
		const fetchInvoice = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/pay/${invoice_id}`);
				if (!response.ok) {
					throw new Error(`Error: ${response.status} ${response.statusText}`);
				}
				const data = await response.json();
				setInvoice(data);
				setLoading(false);
				updateCanChangeStore(data);
			} catch (err) {
				console.error(err);
				setError('無法取得帳單資料。');
				setLoading(false);
			}
		};

		fetchInvoice();
	}, [invoice_id, API_BASE_URL]);

	const updateCanChangeStore = (invoiceData) => {
		if (invoiceData.convenience_store) {
			setCanChangeStore(false);
		} else {
			setCanChangeStore(true);
		}
	};

	// 倒數計時邏輯
	useEffect(() => {
		if (invoice && invoice.store_set_time) {
			// 計算繳費截止時間
			const deadline = new Date(invoice.store_set_time);
			deadline.setDate(deadline.getDate() + 7); // 加7天
			deadline.setHours(0, 0, 0, 0); // 設置為當天的0點0分0秒

			// 更新倒數計時
			const interval = setInterval(() => {
				const now = new Date();
				const difference = deadline - now;

				if (difference <= 0) {
					setTimeLeft('繳費期限已過');
					clearInterval(interval);
				} else {
					const days = Math.floor(difference / (1000 * 60 * 60 * 24));
					const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
					const minutes = Math.floor((difference / (1000 * 60)) % 60);
					const seconds = Math.floor((difference / 1000) % 60);

					setTimeLeft(
						`剩餘時間：${days}天 ${hours}時 ${minutes}分 ${seconds}秒`
					);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [invoice]);

	const handleStoreUpdate = async (selectedStore) => {
		try {
			const response = await fetch(`${API_BASE_URL}/pay`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					invoice_id,
					convenience_store: selectedStore,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || '更新失敗');
			}

			const result = await response.json();
			console.log(result.status);
			// 重新取得帳單資料
			const updatedInvoiceResponse = await fetch(`${API_BASE_URL}/pay/${invoice_id}`);
			const updatedInvoice = await updatedInvoiceResponse.json();
			setInvoice(updatedInvoice);
			updateCanChangeStore(updatedInvoice);
		} catch (err) {
			console.error(err);
			setError(err.message || '更新超商失敗。');
		}
	};

	if (loading) {
		return <div className="loader">載入中...</div>;
	}

	if (error) {
		return <div className="error">{error}</div>;
	}

	return (
		<div className="invoice-page-container">
			<div className="invoice-page">
				{/* 顶部图片，添加类名 */}
				<a href="https://mcloudtw.com/" target="_blank" rel="noopener noreferrer" className="logo-link">
					<img
						src="https://store.mcloudtw.com/logo2.png"
						alt="MineCloud 雲麥網路工作室"
						className="logo-image"
					/>
				</a>
				<h1>帳單編號: {invoice.invoice_id}</h1>
				<h2>產品列表:</h2>
				<ul>
					{invoice.products.map((product, index) => (
						<li key={index}>
							{product.name} - {product.price}元
						</li>
					))}
					<li className="total">
						總金額: {invoice.total}
					</li>
				</ul>

				{/* 繳費期限倒數計時 */}
				{timeLeft && <p className="countdown-timer">{timeLeft}</p>}

				{/* 繳費代碼 */}
				{invoice.code && (
					<div className="payment-code">
						<h2>繳費代碼：</h2>
						<p>{invoice.code}</p>
						{/* QR Code */}
						<div className="qr-code">
							<QRCodeCanvas value={invoice.code} size={200} />
						</div>
					</div>
				)}

				{/* 超商選擇部分 */}
				<StoreSelector
					convenienceStore={invoice.convenience_store}
					canChangeStore={canChangeStore}
					onStoreChange={handleStoreUpdate}
				/>

				{/* 底部图片，添加类名 */}
				<a href="https://www.smilepay.net/help.htm" target="_blank" rel="noopener noreferrer" className="footer-logo-link">
					<img
						src="https://www.smilepay.net/images/26-8.png"
						alt="SmilePay 訊航科技金流中心"
						className="footer-logo-image"
					/>
				</a>

				{/* 版权声明 */}
				<div className="footer-copyright">
					Copyright © 2024 - 雲麥網路工作室帳務處理中心
				</div>
			</div>
		</div>
	);
}

export default InvoicePage;
