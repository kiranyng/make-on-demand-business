import React from 'react';
    import { Routes, Route } from 'react-router-dom';
    import RawMaterials from './components/RawMaterials';
    import Products from './components/Products';
    import Orders from './components/Orders';
    import Production from './components/Production';
    import Navigation from './components/Navigation';
    import ProductCategories from './components/ProductCategories';

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
            <Route path="/" element={<Products />} />
          </Routes>
        </div>
      );
    }

    export default App;
