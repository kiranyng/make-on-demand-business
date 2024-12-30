import React, { useState, useEffect } from 'react';
    import { NavLink } from 'react-router-dom';
    import { getOrders } from '../utils/storage';
    import { FaCog, FaBars, FaTimes } from 'react-icons/fa';

    function Navigation() {
      const [newOrdersCount, setNewOrdersCount] = useState(0);
      const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };

      return (
        <nav className="bg-gray-800 p-4 mb-4 dark:bg-gray-700 relative z-10">
          <div className="container mx-auto flex justify-between items-center">
            <span className="text-white font-bold text-xl">Business App</span>
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white focus:outline-none">
                {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
            <div className={`md:flex space-x-4 items-center absolute md:relative top-full left-0 md:top-0 md:left-auto w-full md:w-auto bg-gray-800 dark:bg-gray-700 p-4 md:p-0 z-20 ${isMenuOpen ? 'block' : 'hidden' } md:block`}>
              <div className="md:flex md:items-center md:space-x-4 md:ml-auto">
                <NavLink to="/raw-materials" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white block md:inline-block py-2 md:py-0' : 'text-gray-500 hover:text-white block md:inline-block py-2 md:py-0'}>Raw Materials</NavLink>
                <NavLink to="/product-categories" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white block md:inline-block py-2 md:py-0' : 'text-gray-500 hover:text-white block md:inline-block py-2 md:py-0'}>Categories</NavLink>
                <NavLink to="/products" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white block md:inline-block py-2 md:py-0' : 'text-gray-500 hover:text-white block md:inline-block py-2 md:py-0'}>Products</NavLink>
                <NavLink to="/orders" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white block md:inline-block py-2 md:py-0' : 'text-gray-500 hover:text-white block md:inline-block py-2 md:py-0'}>Orders</NavLink>
                <NavLink to="/production" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white relative block md:inline-block py-2 md:py-0' : 'text-gray-500 hover:text-white relative block md:inline-block py-2 md:py-0'}>
                  Production
                  {newOrdersCount > 0 && (
                    <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full px-2 text-xs">{newOrdersCount}</span>
                  )}
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'text-gray-300 hover:text-white block md:inline-block py-2 md:py-0' : 'text-gray-500 hover:text-white block md:inline-block py-2 md:py-0'}>
                  <FaCog className="text-xl" />
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      );
    }

    export default Navigation;
