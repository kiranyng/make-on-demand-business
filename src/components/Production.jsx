import React, { useState, useEffect } from 'react';
    import { getOrders, getProducts, getCategories } from '../utils/storage';
    import localforage from 'localforage';

    function Production() {
      const [orders, setOrders] = useState([]);
      const [products, setProducts] = useState([]);
      const [categories, setCategories] = useState([]);
      const [productionStatus, setProductionStatus] = useState({});
      const [productionCount, setProductionCount] = useState(0);
      const [currency, setCurrency] = useState('USD');

      useEffect(() => {
        const fetchOrders = async () => {
          const orders = await getOrders();
          setOrders(orders);
          updateProductionCount(orders);
        };
        const fetchProducts = async () => {
          const products = await getProducts();
          setProducts(products);
        };
        const fetchCategories = async () => {
          const categories = await getCategories();
          setCategories(categories);
        };
        const fetchCurrency = async () => {
          const storedCurrency = await localforage.getItem('currency');
          if (storedCurrency) setCurrency(storedCurrency);
        };
        fetchOrders();
        fetchProducts();
        fetchCategories();
        fetchCurrency();

        const handleNewOrder = () => {
          fetchOrders();
        };

        window.addEventListener('newOrderPlaced', handleNewOrder);

        return () => {
          window.removeEventListener('newOrderPlaced', handleNewOrder);
        };
      }, []);

      const updateProductionCount = (orders) => {
        const today = new Date().toLocaleDateString();
        const todaysOrders = orders.filter(order => new Date(order.orderDate).toLocaleDateString() === today);
        let count = 0;
        todaysOrders.forEach(order => {
          Object.values(order.products).forEach(quantity => {
            count += quantity;
          });
        });
        setProductionCount(count);
      };

      const getTodaysOrders = () => {
        const today = new Date().toLocaleDateString();
        return orders.filter(order => new Date(order.orderDate).toLocaleDateString() === today);
      };

      const todaysOrders = getTodaysOrders();

      const getProductManufacturingSteps = (productName) => {
        const product = products.find(p => p.name === productName);
        if (product) {
          const category = categories.find(c => c.title === product.category);
          return category ? category.manufacturingStages : [];
        }
        return [];
      };

      const handleCheckboxChange = (productName, orderIndex, itemIndex, stepIndex, checked) => {
        setProductionStatus(prevStatus => {
          const newStatus = { ...prevStatus };
          if (!newStatus[productName]) {
            newStatus[productName] = {};
          }
          if (!newStatus[productName][orderIndex]) {
            newStatus[productName][orderIndex] = {};
          }
          if (!newStatus[productName][orderIndex][itemIndex]) {
            newStatus[productName][orderIndex][itemIndex] = {};
          }
          newStatus[productName][orderIndex][itemIndex][stepIndex] = checked;
          return newStatus;
        });
      };

      const isOrderComplete = (productName, orderIndex, itemIndex, steps) => {
        if (!productionStatus[productName] || !productionStatus[productName][orderIndex] || !productionStatus[productName][orderIndex][itemIndex]) {
          return false;
        }
        return steps.every((_, stepIndex) => productionStatus[productName][orderIndex][itemIndex][stepIndex]);
      };

      const handleAction = async (order, productName) => {
        if (order.source === 'shipped') {
          alert(`Product ${productName} has been shipped.`);
        } else if (order.source === 'placed') {
          const materials = await localforage.getItem('rawMaterials') || [];
          const products = await localforage.getItem('products') || [];
          const product = products.find(p => p.name === productName);
          if (product) {
            const updatedMaterials = materials.map(material => {
              if (product.rawMaterials[material.name]) {
                return { ...material, availableQuantity: material.availableQuantity - (product.rawMaterials[material.name] * order.products[productName]) };
              }
              return material;
            });
            await localforage.setItem('rawMaterials', updatedMaterials);
          }
          alert(`Product ${productName} added to inventory.`);
        }
      };

      const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
        });
        return formatter.format(amount);
      };

      const batchColors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];

      return (
        <div className="dark:bg-gray-700 p-4">
          <h2 className="text-2xl font-bold mb-4 dark:text-gray-300">Today's Production</h2>
          {todaysOrders.length === 0 ? (
            <p className="dark:text-gray-300">No orders for today.</p>
          ) : (
            Object.entries(
              todaysOrders.reduce((acc, order, orderIndex) => {
                Object.entries(order.products).forEach(([productName, quantity]) => {
                  if (!acc[productName]) {
                    acc[productName] = [];
                  }
                  for (let i = 0; i < quantity; i++) {
                    acc[productName].push({ order, orderIndex, itemIndex: i });
                  }
                });
                return acc;
              }, {})
            ).map(([productName, productOrders], productIndex) => (
              <div key={productIndex} className="mb-8">
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-300">{productName}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr>
                        <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Batch</th>
                        {getProductManufacturingSteps(productName).map((step, stepIndex) => (
                          <th key={stepIndex} className="border p-2 dark:border-gray-600 dark:text-gray-300">{step}</th>
                        ))}
                        <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Status</th>
                        <th className="border p-2 dark:border-gray-600 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productOrders.map(({ order, orderIndex, itemIndex }, index) => {
                        const batchColor = batchColors[orderIndex % batchColors.length];
                        const steps = getProductManufacturingSteps(productName);
                        return (
                          <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                            <td className={`border p-2 ${batchColor} relative dark:border-gray-600 dark:text-gray-300 z-10`}>
                              <span className="font-bold">{new Date(order.orderDate).toLocaleTimeString()}</span>
                              <div className="absolute top-0 left-0 p-1 text-xs bg-gray-700 text-white rounded opacity-0 hover:opacity-100 transition-opacity duration-200">
                                Batch: {new Date(order.orderDate).toLocaleString()}
                              </div>
                            </td>
                            {steps.map((step, stepIndex) => (
                              <td key={stepIndex} className="border p-2 text-center dark:border-gray-600">
                                <input
                                  type="checkbox"
                                  checked={productionStatus[productName]?.[orderIndex]?.[itemIndex]?.[stepIndex] || false}
                                  onChange={(e) => handleCheckboxChange(productName, orderIndex, itemIndex, stepIndex, e.target.checked)}
                                />
                              </td>
                            ))}
                            <td className="border p-2 text-center dark:border-gray-600 dark:text-gray-300">
                              {isOrderComplete(productName, orderIndex, itemIndex, steps) ? 'Completed' : 'In Progress'}
                            </td>
                            <td className="border p-2 text-center dark:border-gray-600 dark:text-gray-300">
                              {isOrderComplete(productName, orderIndex, itemIndex, steps) && (
                                order.source === 'shipped' ? (
                                  <button onClick={() => handleAction(order, productName)} className="bg-blue-500 text-white p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isOrderComplete(productName, orderIndex, itemIndex, steps)}>Ship</button>
                                ) : (
                                  <button onClick={() => handleAction(order, productName)} className="bg-green-500 text-white p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isOrderComplete(productName, orderIndex, itemIndex, steps)}>Add to Inventory</button>
                                )
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    export default Production;
