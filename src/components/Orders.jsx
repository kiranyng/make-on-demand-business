import React, { useState, useEffect, useRef } from 'react';
    import { getProducts, saveOrder, getOrders, getRawMaterials, getCategories } from '../utils/storage';
    import { FaShoppingCart } from 'react-icons/fa';
    import localforage from 'localforage';

    function Orders() {
      const [products, setProducts] = useState([]);
      const [orders, setOrders] = useState([]);
      const [droppedProducts, setDroppedProducts] = useState([]);
      const [totalPrice, setTotalPrice] = useState(0);
      const [totalProfit, setTotalProfit] = useState(0);
      const dropZoneRef = useRef(null);
      const [categories, setCategories] = useState([]);
      const [currency, setCurrency] = useState('USD');

      useEffect(() => {
        const fetchProducts = async () => {
          const products = await getProducts();
          setProducts(products);
        };
        const fetchOrders = async () => {
          const orders = await getOrders();
          setOrders(orders);
        };
        const fetchCategories = async () => {
          const categories = await getCategories();
          setCategories(categories);
        };
        const fetchCurrency = async () => {
          const storedCurrency = await localforage.getItem('currency');
          if (storedCurrency) setCurrency(storedCurrency);
        };
        fetchProducts();
        fetchOrders();
        fetchCategories();
        fetchCurrency();
      }, []);

      const handleDragStart = (e, product) => {
        e.dataTransfer.setData('product', JSON.stringify(product));
      };

      const handleDragOver = (e) => {
        e.preventDefault();
      };

      const handleDrop = (e) => {
        e.preventDefault();
        const product = JSON.parse(e.dataTransfer.getData('product'));
        setDroppedProducts([...droppedProducts, product]);
        calculatePriceAndProfit([...droppedProducts, product]);
      };

      const calculatePriceAndProfit = async (products) => {
        let price = 0;
        let profit = 0;
        const rawMaterials = await getRawMaterials();

        products.forEach(product => {
          price += product.price;
          let cost = 0;
          for (const materialName in product.rawMaterials) {
            const material = rawMaterials.find(mat => mat.name === materialName);
            if (material) {
              cost += material.pricePerUnit * product.rawMaterials[materialName];
            }
          }
          profit += product.price - cost;
        });
        setTotalPrice(price);
        setTotalProfit(profit);
      };

      const handlePlaceOrder = async () => {
        if (droppedProducts.length === 0) return;

        const productQuantities = droppedProducts.reduce((acc, product) => {
          acc[product.name] = (acc[product.name] || 0) + 1;
          return acc;
        }, {});

        const newOrder = {
          products: productQuantities,
          orderDate: new Date().toISOString(),
        };
        await saveOrder(newOrder);
        setOrders([...orders, newOrder]);
        setDroppedProducts([]);
        setTotalPrice(0);
        setTotalProfit(0);
        // Update the badge on the Production menu item
        const event = new CustomEvent('newOrderPlaced');
        window.dispatchEvent(event);
      };

      const clearDropZone = () => {
        setDroppedProducts([]);
        setTotalPrice(0);
        setTotalProfit(0);
      };

      const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
        });
        return formatter.format(amount);
      };

      const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});

      return (
        <div className="flex">
          <div className="w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4">Products</h2>
            {Object.entries(groupedProducts).map(([category, products]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.name}
                      draggable
                      onDragStart={(e) => handleDragStart(e, product)}
                      className="border p-2 cursor-grab flex flex-col"
                    >
                      <h3 className="font-bold">{product.name}</h3>
                      <img src={product.image} alt={product.name} className="w-24 h-24 object-cover mb-2" />
                      <p>Price: {formatCurrency(product.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-4">Order Dropzone</h2>
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-400 p-4 min-h-[200px] mb-4"
            >
              {droppedProducts.length === 0 ? (
                <p className="text-gray-500 text-center">Drag products here to place an order</p>
              ) : (
                <ul className="space-y-2">
                  {droppedProducts.map((product, index) => (
                    <li key={index} className="flex items-center">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover mr-2" />
                      <span>{product.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-2">
              <p>Total Price: {formatCurrency(totalPrice)}</p>
              <p>Total Profit: {formatCurrency(totalProfit)}</p>
            </div>
            <div className="flex justify-between">
              <button onClick={handlePlaceOrder} className="bg-blue-500 text-white p-2 rounded flex items-center">
                <FaShoppingCart className="mr-2" />
                Place Order
              </button>
              <button onClick={clearDropZone} className="bg-gray-300 text-gray-700 p-2 rounded">Clear</button>
            </div>
          </div>
        </div>
      );
    }

    export default Orders;
