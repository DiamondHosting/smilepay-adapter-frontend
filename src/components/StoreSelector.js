// src/components/StoreSelector.jsx

import React from 'react';
import './StoreSelector.css'; // 可選，根據需要添加樣式

function StoreSelector({ paymentMethod, canChangeStore, onStoreChange }) {
	const handleChange = (e) => {
		onStoreChange(e.target.value);
	};

	return (
		<div className="store-selector">
			<label htmlFor="payment-method">選擇繳費方式：</label>
			<select
				id="payment-method"
				value={paymentMethod || ''}
				onChange={handleChange}
				disabled={!canChangeStore}
			>
				<option value="" disabled>
					-- 請選擇 --
				</option>
				<option value="SevenEleven">ibon繳費(7-11)</option>
				<option value="FamilyMart">FamiPort繳費(全家)</option>
				<option value="ATM">ATM繳費(虛擬帳號)</option>
				{/* 根據需要添加更多選項 */}
			</select>
			{!canChangeStore && paymentMethod && (
				<p className="store-lock-message">
					您已選擇 {paymentMethod}，無法更改。
				</p>
			)}
		</div>
	);
}

export default StoreSelector;
