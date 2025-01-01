import React, { useState, useEffect, useRef } from 'react';
    import { getProducts, saveOrder, getOrders, getRawMaterials, getCategories } from '../utils/storage';
    import { FaShoppingCart, FaTruck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
    import localforage from 'localforage';

    function Orders() {
      const [products, setProducts] = useState([]);
      const [orders, setOrders] = useState([]);
      const [droppedProducts, setDroppedProducts] = useState({});
      const [totalPrice, setTotalPrice] = useState(0);
      const [totalProfit, setTotalProfit] = useState(0);
      const dropZoneRef = useRef(null);
      const [categories, setCategories] = useState([]);
      const [currency, setCurrency] = useState('USD');
      const [quantities, setQuantities] = useState({});
      const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

      const calculatePriceAndProfit = async (products) => {
        let price = 0;
        let profit = 0;
        const rawMaterials = await getRawMaterials();

        products.forEach(product => {
          price += product.price * product.quantity;
          let cost = 0;
          for (const materialName in product.rawMaterials) {
            const material = rawMaterials.find(mat => mat.name === materialName);
            if (material) {
              cost += material.pricePerUnit * product.rawMaterials[materialName] * product.quantity;
            }
          }
          profit += (product.price - cost) * product.quantity;
        });
        setTotalPrice(price);
        setTotalProfit(profit);
      };

      const handlePlaceOrder = async () => {
        if (Object.keys(droppedProducts).length === 0) return;

        const newOrder = {
          products: droppedProducts,
          orderDate: new Date().toISOString(),
          source: 'placed',
        };
        await saveOrder(newOrder);
        setOrders([...orders, newOrder]);
        setDroppedProducts({});
        setTotalPrice(0);
        setTotalProfit(0);
        // Update the badge on the Production menu item
        const event = new CustomEvent('newOrderPlaced');
        window.dispatchEvent(event);
      };

      const handleShipOrder = async () => {
        if (Object.keys(droppedProducts).length === 0) return;

        const newOrder = {
          products: droppedProducts,
          orderDate: new Date().toISOString(),
          source: 'shipped',
        };
        await saveOrder(newOrder);
        setOrders([...orders, newOrder]);
        setDroppedProducts({});
        setTotalPrice(0);
        setTotalProfit(0);
        // Update the badge on the Production menu item
        const event = new CustomEvent('newOrderPlaced');
        window.dispatchEvent(event);
      };

      const clearDropZone = () => {
        setDroppedProducts({});
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

      const handleQuantityChange = (e, product) => {
        setQuantities({ ...quantities, [product.name]: parseInt(e.target.value, 10) });
      };

      const handleAddProduct = (product) => {
        const quantityToAdd = quantities[product.name] || 1;
        setDroppedProducts(prev => {
          const newProducts = { ...prev };
          newProducts[product.name] = (newProducts[product.name] || 0) + quantityToAdd;
          calculatePriceAndProfit(Object.keys(newProducts).map(key => ({ ...product, quantity: newProducts[key] })));
          return newProducts;
        });
        setQuantities({ ...quantities, [product.name]: '' });
      };

      const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
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
          <div className={`p-4 ${isSidebarCollapsed ? 'w-full' : 'w-1/2'}`}>
            <h2 className="text-2xl font-bold mb-4">Products</h2>
            {Object.entries(groupedProducts).map(([category, products]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.name}
                      className="border p-2 flex flex-col"
                    >
                      <h3 className="font-bold">{product.name}</h3>
                      <img src={product.image} alt={product.name} className="w-24 h-24 object-cover mb-2" />
                      <p>Price: {formatCurrency(product.price)}</p>
                      <div className="flex items-center mt-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={quantities[product.name] || ''}
                          onChange={(e) => handleQuantityChange(e, product)}
                          className="border p-1 mr-2 w-16"
                        />
                        <button onClick={() => handleAddProduct(product)} className="bg-blue-500 text-white p-1 rounded">Add</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={`p-4 ${isSidebarCollapsed ? 'collapsed-sidebar-end' : 'expanded-sidebar'}`}>
            {isSidebarCollapsed ? (
              <div className="flex flex-col items-center">
                <button onClick={toggleSidebar} className="focus:outline-none self-start mb-2">
                  <FaChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
                {Object.entries(droppedProducts).map(([productName, quantity]) => {
                  const product = products.find(p => p.name === productName);
                  return (
                    <div key={productName} className="flex items-center mb-2">
                      {product && <img src={product.image} alt={productName} className="w-8 h-8 object-cover mr-1" />}
                      <span className="badge badge-primary">{quantity}</span>
                    </div>
                  );
                })}
                <div className="flex flex-col mt-2">
                  <button onClick={handlePlaceOrder} className="bg-blue-500 text-white p-2 rounded flex items-center mb-2">
                    <FaShoppingCart className="mr-1" />
                  </button>
                  <button onClick={handleShipOrder} className="bg-green-500 text-white p-2 rounded flex items-center mb-2">
                    <FaTruck className="mr-1" />
                  </button>
                  <button onClick={clearDropZone} className="bg-gray-300 text-gray-700 p-2 rounded">Clear</button>
                </div>
              </div>
            ) : (
              <div
                ref={dropZoneRef}
                className="border-2 border-dashed border-gray-400 p-4 min-h-[200px] mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold dark:text-gray-300">Production Order List</h2>
                  <button onClick={toggleSidebar} className="focus:outline-none">
                    <FaChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
                {Object.keys(droppedProducts).length === 0 ? (
                  <p className="text-gray-500 text-center">Add products to create an order</p>
                ) : (
                  <ul className="space-y-2">
                    {Object.entries(droppedProducts).map(([productName, quantity]) => {
                      const product = products.find(p => p.name === productName);
                      return (
                        <li key={productName} className="flex items-center">
                          {product && <img src={product.image} alt={productName} className="w-12 h-12 object-cover mr-2" />}
                          <span>{productName}</span>
                          <span className="badge badge-primary ml-2">{quantity}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mb-2">
                  <p>Total Price: {formatCurrency(totalPrice)}</p>
                  <p>Total Profit: {formatCurrency(totalProfit)}</p>
                </div>
                <div className="flex justify-between">
                  <button onClick={handlePlaceOrder} className="bg-blue-500 text-white p-2 rounded flex items-center">
                    <FaShoppingCart className="mr-2" />
                    Place Order
                  </button>
                  <button onClick={handleShipOrder} className="bg-green-500 text-white p-2 rounded flex items-center">
                    <FaTruck className="mr-2" />
                    Ship Order
                  </button>
                  <button onClick={clearDropZone} className="bg-gray-300 text-gray-700 p-2 rounded">Clear</button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    export default Orders;
