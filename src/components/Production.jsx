import React, { useState, useEffect } from 'react';
    import { getOrders, getProducts, getCategories } from '../utils/storage';

    function Production() {
      const [orders, setOrders] = useState([]);
      const [products, setProducts] = useState([]);
      const [categories, setCategories] = useState([]);
      const [productionStatus, setProductionStatus] = useState({});

      useEffect(() => {
        const fetchOrders = async () => {
          const orders = await getOrders();
          setOrders(orders);
        };
        const fetchProducts = async () => {
          const products = await getProducts();
          setProducts(products);
        };
        const fetchCategories = async () => {
          const categories = await getCategories();
          setCategories(categories);
        };
        fetchOrders();
        fetchProducts();
        fetchCategories();
      }, []);

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

      const handleCheckboxChange = (orderIndex, productName, stepIndex, checked) => {
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
          newStatus[orderIndex][productName][stepIndex] = checked;
          return newStatus;
        });
      };

      const isOrderComplete = (orderIndex, productName, steps) => {
        if (!productionStatus[orderIndex] || !productionStatus[orderIndex][productName]) {
          return false;
        }
        return steps.every((_, stepIndex) => productionStatus[orderIndex][productName][stepIndex] === true);
      };

      const batchColors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];

      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Today's Production</h2>
          {todaysOrders.length === 0 ? (
            <p>No orders for today.</p>
          ) : (
            Object.entries(
              todaysOrders.reduce((acc, order, orderIndex) => {
                Object.entries(order.products).forEach(([productName, quantity]) => {
                  if (!acc[productName]) {
                    acc[productName] = [];
                  }
                  for (let i = 0; i < quantity; i++) {
                    acc[productName].push({ order, orderIndex });
                  }
                });
                return acc;
              }, {})
            ).map(([productName, productOrders], productIndex) => (
              <div key={productIndex} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{productName}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border p-2">Batch</th>
                        {getProductManufacturingSteps(productName).map((step, stepIndex) => (
                          <th key={stepIndex} className="border p-2">{step}</th>
                        ))}
                        <th className="border p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productOrders.map(({ order, orderIndex }, index) => {
                        const batchColor = batchColors[orderIndex % batchColors.length];
                        const steps = getProductManufacturingSteps(productName);
                        return (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className={`border p-2 ${batchColor} relative`}>
                              <span className="font-bold">{new Date(order.orderDate).toLocaleTimeString()}</span>
                              <div className="absolute top-0 left-0 p-1 text-xs bg-gray-700 text-white rounded opacity-0 hover:opacity-100 transition-opacity duration-200">
                                Batch: {new Date(order.orderDate).toLocaleString()}
                              </div>
                            </td>
                            {steps.map((step, stepIndex) => (
                              <td key={stepIndex} className="border p-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={productionStatus[orderIndex]?.[productName]?.[stepIndex] || false}
                                  onChange={(e) => handleCheckboxChange(orderIndex, productName, stepIndex, e.target.checked)}
                                />
                              </td>
                            ))}
                            <td className="border p-2 text-center">
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