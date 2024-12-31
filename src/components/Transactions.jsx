import React, { useState, useEffect } from 'react';
    import localforage from 'localforage';
    import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

    function Transactions({ supplierName, expandTransactionId }) {
      const [transactions, setTransactions] = useState([]);
      const [expandedTransactions, setExpandedTransactions] = useState({});
      const [currency, setCurrency] = useState('USD');

      useEffect(() => {
        const fetchTransactions = async () => {
          const allTransactions = await localforage.getItem('transactions') || [];
          const filteredTransactions = supplierName ? allTransactions.filter(transaction => transaction.supplier === supplierName) : allTransactions;
          setTransactions(filteredTransactions);
        };
        const fetchCurrency = async () => {
          const storedCurrency = await localforage.getItem('currency');
          if (storedCurrency) setCurrency(storedCurrency);
        };
        fetchTransactions();
        fetchCurrency();
      }, [supplierName]);

      useEffect(() => {
        if (expandTransactionId) {
          setExpandedTransactions(prev => ({
            ...prev,
            [expandTransactionId]: true
          }));
        }
      }, [expandTransactionId]);

      const handleCompleteTransaction = async (transactionId) => {
        const updatedTransactions = transactions.map(transaction => {
          if (transaction.id === transactionId) {
            return { ...transaction, status: 'completed' };
          }
          return transaction;
        });
        setTransactions(updatedTransactions);
        await localforage.setItem('transactions', updatedTransactions);

        const transaction = updatedTransactions.find(t => t.id === transactionId);
        if (transaction) {
          const materials = await localforage.getItem('rawMaterials') || [];
          const updatedMaterials = materials.map(material => {
            if (material.name === transaction.materialName) {
              return { ...material, availableQuantity: material.availableQuantity + transaction.quantity };
            }
            return material;
          });
          await localforage.setItem('rawMaterials', updatedMaterials);
        }
      };

      const toggleTransaction = (transactionId) => {
        setExpandedTransactions(prev => ({
          ...prev,
          [transactionId]: !prev[transactionId]
        }));
      };

      const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
        });
        return formatter.format(amount);
      };

      return (
        <div className="dark:bg-gray-700 p-4">
          <h3 className="text-xl font-semibold mb-4 dark:text-gray-300">Transactions</h3>
          {transactions.length === 0 ? (
            <p className="dark:text-gray-300">No transactions available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                  <tr>
                    <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Material</th>
                    <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Quantity</th>
                    <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Supplier</th>
                    <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Estimated Price</th>
                    <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Actual Price</th>
                    <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Date</th>
                    <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Status</th>
                    <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>
                      <tr className="hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={() => toggleTransaction(transaction.id)}>
                        <td className="border p-2 dark:border-gray-600 dark:text-gray-300">
                          <div className="flex items-center justify-between">
                            <span>{transaction.materialName}</span>
                            {expandedTransactions[transaction.id] ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
                          </div>
                        </td>
                        <td className="border p-2 dark:border-gray-600 dark:text-gray-300">{transaction.quantity}</td>
                        <td className="border p-2 dark:border-gray-600 dark:text-gray-300">{transaction.supplier}</td>
                        <td className="border p-2 dark:border-gray-600 dark:text-gray-300">{formatCurrency(transaction.estimatedPrice)}</td>
                        <td className="border p-2 dark:border-gray-600 dark:text-gray-300">{formatCurrency(transaction.actualPrice)}</td>
                        <td className="border p-2 dark:border-gray-600 dark:text-gray-300">{new Date(transaction.date).toLocaleString()}</td>
                        <td className="border p-2 dark:border-gray-600 dark:text-gray-300">{transaction.status}</td>
                        <td className="border p-2 dark:border-gray-600 dark:text-gray-300">
                          {transaction.status === 'pending' && (
                            <button onClick={() => handleCompleteTransaction(transaction.id)} className="bg-green-500 text-white p-1 rounded">Complete</button>
                          )}
                        </td>
                      </tr>
                      {expandedTransactions[transaction.id] && (
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <td colSpan="8" className="p-4">
                            <div className="flex flex-col">
                              <p className="dark:text-gray-300">Invoice No: {transaction.invoiceNo || 'N/A'}</p>
                              <p className="dark:text-gray-300">Bank Transaction ID: {transaction.bankTransactionId || 'N/A'}</p>
                              <p className="dark:text-gray-300">Shipping ID: {transaction.shippingId || 'N/A'}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    }

    export default Transactions;
