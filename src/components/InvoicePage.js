// src/components/InvoicePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StoreSelector from './StoreSelector';
import './InvoicePage.css'; // 確保有此 CSS 檔案

function InvoicePage() {
	const { invoice_id } = useParams();
	const [invoice, setInvoice] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [canChangeStore, setCanChangeStore] = useState(true);

	const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://test.api.com';

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
			setError('更新超商失敗。');
		}
	};

	if (loading) {
		return <div>載入中...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div className="invoice-page">
			<h1>發票編號: {invoice.invoice_id}</h1>
			<p>總金額: {invoice.total}</p>
			<h2>產品列表:</h2>
			<ul>
				{invoice.products.map((product, index) => (
					<li key={index}>{product.name} - {product.price}元</li>
				))}
			</ul>
			{/* 移除或註解掉支付連結的部分 */}
			{/* <a href={invoice.paymentLink} target="_blank" rel="noopener noreferrer">
        前往支付
      </a> */}

			{/* 未來可以加入超商代碼的部分 */}
			<StoreSelector
				convenienceStore={invoice.convenience_store}
				canChangeStore={canChangeStore}
				onStoreChange={handleStoreUpdate}
			/>
		</div>
	);
}

export default InvoicePage;
