// src/components/StoreSelector.jsx

import React from 'react';
import './StoreSelector.css'; // 可選，根據需要添加樣式

function StoreSelector({ convenienceStore, canChangeStore, onStoreChange }) {
	const handleChange = (e) => {
		onStoreChange(e.target.value);
	};

	return (
		<div className="store-selector">
			<label htmlFor="convenience-store">選擇超商：</label>
			<select
				id="convenience-store"
				value={convenienceStore || ''}
				onChange={handleChange}
				disabled={!canChangeStore}
			>
				<option value="" disabled>
					-- 請選擇 --
				</option>
				<option value="SevenEleven">ibon繳費(7-11)</option>
				<option value="FamilyMart">FamiPort(全家)</option>
				{/* 根據需要添加更多選項 */}
			</select>
			{!canChangeStore && convenienceStore && (
				<p className="store-lock-message">
					您已選擇 {convenienceStore}，無法更改。
				</p>
			)}
		</div>
	);
}

export default StoreSelector;
