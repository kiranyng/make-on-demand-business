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

      const handleCheckboxChange = (orderIndex, productName, stepIndex, itemIndex, checked) => {
        setProductionStatus(prevStatus => {
          const newStatus = { ...prevStatus };
           if (!newStatus[orderIndex]) {
            newStatus[orderIndex] = {};
          }
          if (!newStatus[orderIndex][productName]) {
            newStatus[orderIndex][productName] = {};
          }
          if (!newStatus[orderIndex][productName][stepIndex]) {
             newStatus[orderIndex][productName][stepIndex] = {};
          }
          newStatus[orderIndex][productName][stepIndex][itemIndex] = checked;
          return newStatus;
        });
      };


      const isOrderComplete = (orderIndex, productName, steps) => {
        if (!productionStatus[orderIndex] || !productionStatus[orderIndex][productName]) {
          return false;
        }
        return steps.every((_, stepIndex) => {
          if (!productionStatus[orderIndex][productName][stepIndex]) {
            return false;
          }
          return Object.values(productionStatus[orderIndex][productName][stepIndex]).every(val => val === true);
        });
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
                                  checked={productionStatus[orderIndex]?.[productName]?.[stepIndex]?.[itemIndex] || false}
                                  onChange={(e) => handleCheckboxChange(orderIndex, productName, stepIndex, itemIndex, e.target.checked)}
                                />
                              </td>
                            ))}
                            <td className="border p-2 text-center dark:border-gray-600 dark:text-gray-300">
                              {isOrderComplete(orderIndex, productName, steps) ? 'Completed' : 'In Progress'}
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
