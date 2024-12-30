import React, { useState, useEffect } from 'react';
    import localforage from 'localforage';

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
