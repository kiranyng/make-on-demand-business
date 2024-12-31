import React from 'react';
    import { Routes, Route } from 'react-router-dom';
    import RawMaterials from './components/RawMaterials';
    import Products from './components/Products';
    import Orders from './components/Orders';
    import Production from './components/Production';
    import Navigation from './components/Navigation';
    import ProductCategories from './components/ProductCategories';
    import Settings from './components/Settings';
    import Suppliers from './components/Suppliers';
    import SupplierDetails from './components/SupplierDetails';
    import AddSupplier from './components/AddSupplier';

    function App() {
      return (
        <div className="container mx-auto p-4">
          <Navigation />
          <Routes>
            <Route path="/raw-materials" element={<RawMaterials />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/production" element={<Production />} />
            <Route path="/product-categories" element={<ProductCategories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/suppliers/add" element={<AddSupplier />} />
            <Route path="/suppliers/:supplierName" element={<SupplierDetails />} />
            <Route path="/" element={<Products />} />
          </Routes>
        </div>
      );
    }

    export default App;