import React, { useState, useEffect } from 'react';
    import localforage from 'localforage';
    import {
      saveRawMaterial,
      saveProduct,
      saveOrder,
      saveCategory,
      saveSupplier,
      getCategories,
    } from '../utils/storage';
    import { v4 as uuidv4 } from 'uuid';

    function Settings() {
      const [currency, setCurrency] = useState('USD');
      const [theme, setTheme] = useState('light');
      const [showConfirmation, setShowConfirmation] = useState(false);

      useEffect(() => {
        const fetchSettings = async () => {
          const storedCurrency = await localforage.getItem('currency');
          const storedTheme = await localforage.getItem('theme');
          if (storedCurrency) setCurrency(storedCurrency);
          if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === 'dark') {
              document.documentElement.classList.add('dark');
            }
          }
        };
        fetchSettings();
      }, []);

      const handleCurrencyChange = async (e) => {
        const newCurrency = e.target.value;
        setCurrency(newCurrency);
        await localforage.setItem('currency', newCurrency);
      };

      const handleThemeChange = async (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        await localforage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };

      const handleResetData = () => {
        setShowConfirmation(true);
      };

      const confirmResetData = async () => {
        await localforage.clear();
        setShowConfirmation(false);
        alert('All data has been reset.');
        window.location.reload();
      };

      const cancelResetData = () => {
        setShowConfirmation(false);
      };

      const insertDummyData = async (dataType) => {
        let rawMaterials = [];
        let categories = [];
        let products = [];
        let orders = [];
        let suppliers = [];
        let transactions = [];

        if (dataType === 'magnets') {
          rawMaterials = [
            { name: 'Magnet', unit: 'piece', pricePerUnit: 0.5, availableQuantity: 500 },
            { name: 'Cardboard', unit: 'sheet', pricePerUnit: 0.2, availableQuantity: 1000 },
            { name: 'Ink', unit: 'ml', pricePerUnit: 0.1, availableQuantity: 2000 },
          ];
          categories = [
            { title: 'Fridge Magnets', description: 'Decorative fridge magnets', manufacturingStages: ['Print', 'Cut', 'Assemble', 'Package'] },
          ];
          products = [
            { name: 'Animal Magnet', image: 'https://via.placeholder.com/150', price: 3, rawMaterials: { 'Magnet': 1, 'Cardboard': 1, 'Ink': 2 }, category: 'Fridge Magnets' },
          ];
          suppliers = [
            { name: 'Magnet Supplier', address: '123 Main St', phone: '555-1234', contactPersons: [{ name: 'John Doe', phone: '555-4321', email: 'john@example.com' }], gstId: 'GST123', rating: 4, rawMaterials: ['Magnet'] },
          ];
          orders = [
            { products: { 'Animal Magnet': 5 }, orderDate: new Date().toISOString() },
          ];
          transactions = [
            { id: uuidv4(), materialName: 'Magnet', quantity: 100, supplier: 'Magnet Supplier', estimatedPrice: 50, actualPrice: 45, date: new Date().toISOString(), status: 'completed' },
          ];
        } else if (dataType === 'posters') {
          rawMaterials = [
            { name: 'Paper', unit: 'sheet', pricePerUnit: 0.1, availableQuantity: 5000 },
            { name: 'Ink', unit: 'ml', pricePerUnit: 0.08, availableQuantity: 10000 },
          ];
          categories = [
            { title: 'Posters', description: 'Decorative posters', manufacturingStages: ['Design', 'Print', 'Laminate', 'Package'] },
          ];
          products = [
            { name: 'Landscape Poster', image: 'https://via.placeholder.com/150', price: 8, rawMaterials: { 'Paper': 1, 'Ink': 5 }, category: 'Posters' },
          ];
          suppliers = [
            { name: 'Paper Supplier', address: '789 Pine Ln', phone: '555-9012', contactPersons: [{ name: 'Peter Jones', phone: '555-2109', email: 'peter@example.com' }], gstId: 'GST789', rating: 4, rawMaterials: ['Paper'] },
          ];
          orders = [
            { products: { 'Landscape Poster': 5 }, orderDate: new Date().toISOString() },
          ];
          transactions = [
            { id: uuidv4(), materialName: 'Paper', quantity: 1000, supplier: 'Paper Supplier', estimatedPrice: 100, actualPrice: 90, date: new Date().toISOString(), status: 'completed' },
          ];
        } else if (dataType === 'boardgames') {
          rawMaterials = [
            { name: 'Cardboard', unit: 'sheet', pricePerUnit: 0.3, availableQuantity: 3000 },
            { name: 'Wood', unit: 'piece', pricePerUnit: 1.0, availableQuantity: 500 },
            { name: 'Plastic', unit: 'piece', pricePerUnit: 0.2, availableQuantity: 1000 },
          ];
          categories = [
            { title: 'Board Games', description: 'Fun board games', manufacturingStages: ['Design', 'Print', 'Cut', 'Assemble', 'Package'] },
          ];
          products = [
            { name: 'Strategy Game', image: 'https://via.placeholder.com/150', price: 40, rawMaterials: { 'Cardboard': 2, 'Wood': 5, 'Plastic': 10 }, category: 'Board Games' },
          ];
          suppliers = [
            { name: 'Cardboard Supplier', address: '222 Maple Dr', phone: '555-7890', contactPersons: [{ name: 'Alice White', phone: '555-0987', email: 'alice@example.com' }], gstId: 'GST222', rating: 4, rawMaterials: ['Cardboard'] },
          ];
          orders = [
            { products: { 'Strategy Game': 2 }, orderDate: new Date().toISOString() },
          ];
          transactions = [
            { id: uuidv4(), materialName: 'Cardboard', quantity: 500, supplier: 'Cardboard Supplier', estimatedPrice: 150, actualPrice: 140, date: new Date().toISOString(), status: 'completed' },
          ];
        }

        for (const material of rawMaterials) {
          await saveRawMaterial(material);
        }

        for (const category of categories) {
          await saveCategory(category);
        }

        for (const product of products) {
          await saveProduct(product);
        }

        for (const order of orders) {
          await saveOrder(order);
        }

        for (const supplier of suppliers) {
          await saveSupplier(supplier);
        }

        for (const transaction of transactions) {
          const allTransactions = await localforage.getItem('transactions') || [];
          await localforage.setItem('transactions', [...allTransactions, transaction]);
        }

        alert(`Dummy data for ${dataType} inserted successfully.`);
        window.location.reload();
      };

      return (
        <div className="p-4 dark:bg-gray-700">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Currency</label>
            <select value={currency} onChange={handleCurrencyChange} className="border p-2 rounded w-full text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Theme</label>
            <select value={theme} onChange={handleThemeChange} className="border p-2 rounded w-full text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="border-t pt-4 mt-4 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">Data Management</h3>
            <button onClick={() => insertDummyData('magnets')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 mr-2">
              Insert Fridge Magnets Data
            </button>
            <button onClick={() => insertDummyData('posters')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 mr-2">
              Insert Posters Data
            </button>
            <button onClick={() => insertDummyData('boardgames')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 mr-2">
              Insert Board Games Data
            </button>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Danger Zone</h3>
            <button onClick={handleResetData} className="bg-red-500 text-white p-2 rounded">Reset All Data</button>
            {showConfirmation && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded dark:bg-gray-800 dark:text-gray-300">
                  <p className="mb-4">Are you sure you want to reset all application data?</p>
                  <div className="flex justify-end">
                    <button onClick={confirmResetData} className="bg-red-500 text-white p-2 rounded mr-2">Yes</button>
                    <button onClick={cancelResetData} className="bg-gray-300 text-gray-700 p-2 rounded dark:bg-gray-700 dark:text-gray-300">No</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    export default Settings;
