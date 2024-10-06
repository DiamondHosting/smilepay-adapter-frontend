// src/components/InvoicePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StoreSelector from './StoreSelector';
import './InvoicePage.css'; // 可選，若有自訂樣式

function InvoicePage() {
	const { invoice_id } = useParams();
	const [invoice, setInvoice] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [canChangeStore, setCanChangeStore] = useState(true);

	const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

	useEffect(() => {
		// 取得發票資料
		const fetchInvoice = async () => {
			try {
				const response = await fetch(`${API_BASE_URL}/pay/${invoice_id}`);
				if (!response.ok) {
					throw new Error(`Error: ${response.status} ${response.statusText}`);
				}
				const data = await response.json();
				setInvoice(data);
				setLoading(false);
				checkStoreLock(data);
			} catch (err) {
				console.error(err);
				setError('無法取得發票資料。');
				setLoading(false);
			}
		};

		fetchInvoice();
	}, [invoice_id, API_BASE_URL]);

	useEffect(() => {
		// 設定定時器，每分鐘檢查一次是否可以變更超商
		const timer = setInterval(() => {
			if (invoice) {
				checkStoreLock(invoice);
			}
		}, 60000); // 每60秒檢查一次

		return () => clearInterval(timer);
	}, [invoice]);

	const checkStoreLock = (invoiceData) => {
		if (invoiceData.convenience_store && invoiceData.store_set_time) {
			const oneHour = 60 * 60 * 1000; // 一小時的毫秒數
			const currentTime = new Date();
			const storeSetTime = new Date(invoiceData.store_set_time);
			const timeDifference = currentTime - storeSetTime;

			if (timeDifference < oneHour) {
				setCanChangeStore(false);
			} else {
				setCanChangeStore(true);
			}
		} else {
			setCanChangeStore(true);
		}
	};

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
			// 重新取得發票資料
			const updatedInvoiceResponse = await fetch(`${API_BASE_URL}/pay/${invoice_id}`);
			const updatedInvoice = await updatedInvoiceResponse.json();
			setInvoice(updatedInvoice);
			checkStoreLock(updatedInvoice);
		} catch (err) {
			console.error(err);
			alert(`更新失敗: ${err.message}`);
		}
	};

	if (loading) {
		return <div>載入中...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (!invoice) {
		return <div>發票資料不存在。</div>;
	}

	return (
		<div className="invoice-container">
			<h1>發票詳情</h1>
			<p><strong>發票 ID:</strong> {invoice.invoice_id}</p>
			<p><strong>總金額:</strong> {invoice.total}</p>
			<h2>產品列表</h2>
			<ul>
				{invoice.products.map((product, index) => (
					<li key={index}>{product.name} - {product.price}</li>
				))}
			</ul>
			<p><strong>支付連結:</strong> <a href={invoice.paymentLink} target="_blank" rel="noopener noreferrer">點此支付</a></p>
			<h2>選擇超商</h2>
			<StoreSelector
				currentStore={invoice.convenience_store}
				canChange={canChangeStore}
				onSelectStore={handleStoreUpdate}
			/>
			{!canChangeStore && <p>一小時內不得更改超商選項。</p>}
		</div>
	);
}

export default InvoicePage;
