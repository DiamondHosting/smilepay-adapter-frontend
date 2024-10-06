// src/components/StoreSelector.jsx

import React, { useState } from 'react';
import './StoreSelector.css'; // 可選，若有自訂樣式

/**
 * StoreSelector 組件
 * @param {string|null} currentStore - 當前選擇的超商
 * @param {boolean} canChange - 是否允許變更超商
 * @param {function(string): void} onSelectStore - 當選擇超商時的回調函數
 */
function StoreSelector({ currentStore, canChange, onSelectStore }) {
	const [selectedStore, setSelectedStore] = useState(currentStore || '');

	const handleChange = (e) => {
		const store = e.target.value;
		setSelectedStore(store);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (selectedStore) {
			onSelectStore(selectedStore);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<select value={selectedStore} onChange={handleChange} disabled={!canChange}>
				<option value="">選擇超商</option>
				<option value="SevenEleven">7-11</option>
				<option value="FamilyMart">全家</option>
			</select>
			<button type="submit" disabled={!canChange || !selectedStore}>
				提交
			</button>
		</form>
	);
}

export default StoreSelector;
