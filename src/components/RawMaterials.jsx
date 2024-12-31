import React, { useState, useEffect } from 'react';
    import { saveRawMaterial, getRawMaterials } from '../utils/storage';
    import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
    import localforage from 'localforage';
    import { Link } from 'react-router-dom';
    import TransactionOverlay from './TransactionOverlay';

    function RawMaterials() {
      const [rawMaterials, setRawMaterials] = useState([]);
      const [name, setName] = useState('');
      const [unit, setUnit] = useState('');
      const [pricePerUnit, setPricePerUnit] = useState('');
      const [availableQuantity, setAvailableQuantity] = useState('');
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [currency, setCurrency] = useState('USD');
      const [lowStockThreshold, setLowStockThreshold] = useState(10);
      const [transactions, setTransactions] = useState([]);
      const [selectedTransaction, setSelectedTransaction] = useState(null);

      useEffect(() => {
        const fetchRawMaterials = async () => {
          const materials = await getRawMaterials();
          setRawMaterials(materials);
        };
        const fetchCurrency = async () => {
          const storedCurrency = await localforage.getItem('currency');
          if (storedCurrency) setCurrency(storedCurrency);
        };
        const fetchLowStockThreshold = async () => {
          const storedThreshold = await localforage.getItem('lowStockThreshold');
          if (storedThreshold) setLowStockThreshold(parseInt(storedThreshold, 10) || 10);
        };
        const fetchTransactions = async () => {
          const allTransactions = await localforage.getItem('transactions') || [];
          setTransactions(allTransactions);
        };
        fetchRawMaterials();
        fetchCurrency();
        fetchLowStockThreshold();
        fetchTransactions();
      }, []);

      const handleSubmit = async (e) => {
        e.preventDefault();
        const newMaterial = { name, unit, pricePerUnit: parseFloat(pricePerUnit), availableQuantity: parseFloat(availableQuantity) };
        await saveRawMaterial(newMaterial);
        setRawMaterials([...rawMaterials, newMaterial]);
        setName('');
        setUnit('');
        setPricePerUnit('');
        setAvailableQuantity('');
        setIsFormOpen(false);
      };

      const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
        });
        return formatter.format(amount);
      };

      const handleLowStockThresholdChange = async (e) => {
        const newThreshold = parseInt(e.target.value, 10);
        setLowStockThreshold(newThreshold);
        await localforage.setItem('lowStockThreshold', newThreshold);
      };

      const isLowStock = (quantity) => {
        return quantity <= lowStockThreshold;
      };

      const getOngoingTransaction = (materialName) => {
        return transactions.filter(transaction => transaction.materialName === materialName && transaction.status !== 'completed');
      };

      const getLastReplenishedDate = (materialName) => {
        const completedTransactions = transactions.filter(transaction => transaction.materialName === materialName && transaction.status === 'completed');
        if (completedTransactions.length === 0) return 'Never';
        const lastTransaction = completedTransactions.reduce((prev, current) => (new Date(current.date) > new Date(prev.date) ? current : prev));
        return new Date(lastTransaction.date).toLocaleDateString();
      };

      const getTransactionStatusColor = (status) => {
        switch (status) {
          case 'pending':
            return 'bg-yellow-200 text-yellow-800';
          case 'completed':
            return 'bg-green-200 text-green-800';
          default:
            return 'bg-gray-200 text-gray-800';
        }
      };

      const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
      };

      const handleCloseOverlay = () => {
        setSelectedTransaction(null);
      };

      return (
        <div className="dark:bg-gray-700 p-4 relative">
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-300">Raw Materials</h2>
          <div className="mb-4">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-gray-200 p-2 rounded w-full text-left flex items-center justify-between dark:bg-gray-800 dark:text-gray-300"
            >
              <span>Add Material</span>
              {isFormOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isFormOpen && (
              <form onSubmit={handleSubmit} className="mt-2 p-4 border rounded dark:bg-gray-800 dark:border-gray-600">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="border p-2 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                <input type="number" placeholder="Price per unit" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className="border p-2 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                <input type="number" placeholder="Available Quantity" value={availableQuantity} onChange={(e) => setAvailableQuantity(e.target.value)} className="border p-2 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Material</button>
              </form>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Low Stock Threshold</label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={handleLowStockThresholdChange}
              className="border p-2 rounded w-24 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>
          <ul className="space-y-2">
            {rawMaterials.map((material, index) => (
              <li key={index} className="border p-2 flex items-center justify-between dark:bg-gray-800 dark:border-gray-600">
                <span className="dark:text-gray-300">
                  <h3 className="font-bold">{material.name}</h3>
                  <p>{material.unit} - {formatCurrency(material.pricePerUnit)}</p>
                  <p>Available Quantity: {material.availableQuantity}</p>
                  <p>Last Replenished: {getLastReplenishedDate(material.name)}</p>
                  {getOngoingTransaction(material.name).map((transaction, index) => (
                    <button key={index} onClick={() => handleTransactionClick(transaction)} className={`badge ${getTransactionStatusColor(transaction.status)} mr-1`}>
                      {transaction.quantity} - {transaction.status}
                    </button>
                  ))}
                  {isLowStock(material.availableQuantity) && (
                    <span className="ml-2 text-red-500 font-bold">Low Stock</span>
                  )}
                </span>
                <Link to={`/raw-materials/${material.name}/replenish`} className="bg-green-500 text-white p-2 rounded">Replenish</Link>
              </li>
            ))}
          </ul>
          {selectedTransaction && (
            <TransactionOverlay transaction={selectedTransaction} onClose={handleCloseOverlay} />
          )}
        </div>
      );
    }

    export default RawMaterials;
