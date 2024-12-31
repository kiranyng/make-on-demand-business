import React, { useState, useEffect } from 'react';
    import localforage from 'localforage';
    import {
      saveRawMaterial,
      saveProduct,
      saveOrder,
      saveCategory,
      getCategories,
    } from '../utils/storage';

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

      const insertDummyData = async () => {
        const rawMaterials = [
          { name: 'Cotton', unit: 'kg', pricePerUnit: 2.5 },
          { name: 'Polyester', unit: 'kg', pricePerUnit: 1.8 },
          { name: 'Wool', unit: 'kg', pricePerUnit: 5.0 },
          { name: 'Silk', unit: 'kg', pricePerUnit: 10.0 },
          { name: 'Leather', unit: 'sqm', pricePerUnit: 8.0 },
          { name: 'Wood', unit: 'cubic meter', pricePerUnit: 50 },
          { name: 'Iron', unit: 'kg', pricePerUnit: 0.5 },
          { name: 'Plastic', unit: 'kg', pricePerUnit: 1.2 },
          { name: 'Rubber', unit: 'kg', pricePerUnit: 3.0 },
          { name: 'Glass', unit: 'sqm', pricePerUnit: 4.0 },
        ];

        const categories = [
          { title: 'Clothing', description: 'Fashionable items', manufacturingStages: ['Design', 'Cut', 'Sew', 'Finish'] },
          { title: 'Furniture', description: 'Home and office furniture', manufacturingStages: ['Design', 'Cut', 'Assemble', 'Polish'] },
          { title: 'Electronics', description: 'Electronic gadgets', manufacturingStages: ['Design', 'Manufacture', 'Assemble', 'Test'] },
        ];

        const products = [
          { name: 'T-Shirt', image: 'https://via.placeholder.com/150', price: 20, rawMaterials: { 'Cotton': 0.2 }, category: 'Clothing' },
          { name: 'Jeans', image: 'https://via.placeholder.com/150', price: 50, rawMaterials: { 'Cotton': 0.8, 'Polyester': 0.2 }, category: 'Clothing' },
          { name: 'Sofa', image: 'https://via.placeholder.com/150', price: 300, rawMaterials: { 'Wood': 0.5, 'Cotton': 5, 'Leather': 2 }, category: 'Furniture' },
          { name: 'Table', image: 'https://via.placeholder.com/150', price: 150, rawMaterials: { 'Wood': 0.7, 'Iron': 1 }, category: 'Furniture' },
          { name: 'Laptop', image: 'https://via.placeholder.com/150', price: 1200, rawMaterials: { 'Plastic': 0.5, 'Iron': 0.2, 'Glass': 0.3 }, category: 'Electronics' },
          { name: 'Smartphone', image: 'https://via.placeholder.com/150', price: 800, rawMaterials: { 'Plastic': 0.2, 'Glass': 0.2, 'Iron': 0.1 }, category: 'Electronics' },
        ];

        const orders = [
          { products: { 'T-Shirt': 2, 'Jeans': 1 }, orderDate: new Date().toISOString() },
          { products: { 'Sofa': 1 }, orderDate: new Date().toISOString() },
        ];

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

        alert('Dummy data inserted successfully.');
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
            <button onClick={insertDummyData} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
              Insert Dummy Data
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
