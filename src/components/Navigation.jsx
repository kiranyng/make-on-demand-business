import React, { useState, useEffect } from 'react';
    import { NavLink } from 'react-router-dom';
    import { getOrders } from '../utils/storage';

    function Navigation() {
      const [newOrdersCount, setNewOrdersCount] = useState(0);

      useEffect(() => {
        const fetchOrders = async () => {
          const orders = await getOrders();
          const today = new Date().toLocaleDateString();
          const todaysOrders = orders.filter(order => new Date(order.orderDate).toLocaleDateString() === today);
          setNewOrdersCount(todaysOrders.length);
        };
        fetchOrders();
      }, []);

      useEffect(() => {
        const fetchOrders = async () => {
          const orders = await getOrders();
          const today = new Date().toLocaleDateString();
          const todaysOrders = orders.filter(order => new Date(order.orderDate).toLocaleDateString() === today);
          setNewOrdersCount(todaysOrders.length);
        };
        fetchOrders();
      }, [newOrdersCount]);

      return (
        <nav className="bg-gray-800 p-4 mb-4">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-white font-bold text-xl">Business App</span>
            <div className="space-x-4">
              <NavLink to="/raw-materials" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-white'}>Raw Materials</NavLink>
              <NavLink to="/product-categories" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-white'}>Categories</NavLink>
              <NavLink to="/products" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-white'}>Products</NavLink>
              <NavLink to="/orders" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-white'}>Orders</NavLink>
              <NavLink to="/production" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white relative' : 'text-gray-500 hover:text-white relative'}>
                Production
                {newOrdersCount > 0 && (
                  <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full px-2 text-xs">{newOrdersCount}</span>
                )}
              </NavLink>
            </div>
          </div>
        </nav>
      );
    }

    export default Navigation;
