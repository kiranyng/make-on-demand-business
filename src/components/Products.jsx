import React, { useState, useEffect } from 'react';
    import { saveProduct, getProducts, getRawMaterials, getCategories } from '../utils/storage';

    function Products() {
      const [products, setProducts] = useState([]);
      const [rawMaterials, setRawMaterials] = useState([]);
      const [categories, setCategories] = useState([]);
      const [name, setName] = useState('');
      const [image, setImage] = useState('');
      const [price, setPrice] = useState('');
      const [selectedRawMaterials, setSelectedRawMaterials] = useState({});
      const [selectedCategory, setSelectedCategory] = useState('');

      useEffect(() => {
        const fetchProducts = async () => {
          const products = await getProducts();
          setProducts(products);
        };
        const fetchRawMaterials = async () => {
          const materials = await getRawMaterials();
          setRawMaterials(materials);
        };
        const fetchCategories = async () => {
          const categories = await getCategories();
          setCategories(categories);
        };
        fetchProducts();
        fetchRawMaterials();
        fetchCategories();
      }, []);

      const handleRawMaterialChange = (materialName, quantity) => {
        setSelectedRawMaterials({ ...selectedRawMaterials, [materialName]: parseFloat(quantity) });
      };

      const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const newProduct = {
          name,
          image,
          price: parseFloat(price),
          rawMaterials: selectedRawMaterials,
          category: selectedCategory
        };
        await saveProduct(newProduct);
        setProducts([...products, newProduct]);
        setName('');
        setImage('');
        setPrice('');
        setSelectedRawMaterials({});
        setSelectedCategory('');
      };

      const calculateEstimatedPrice = () => {
        let estimatedPrice = 0;
        for (const materialName in selectedRawMaterials) {
          const material = rawMaterials.find(mat => mat.name === materialName);
          if (material) {
            estimatedPrice += material.pricePerUnit * selectedRawMaterials[materialName];
          }
        }
        return estimatedPrice;
      };

      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 mr-2" required />
            <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="border p-2 mr-2" required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 mr-2" required />
            <div className="mb-2">
              <h3 className="text-lg font-semibold mb-2">Raw Materials</h3>
              {rawMaterials.map((material) => (
                <div key={material.name} className="flex items-center mb-1">
                  <label className="mr-2">{material.name}:</label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    step="0.01"
                    className="border p-1 w-20"
                    onChange={(e) => handleRawMaterialChange(material.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-semibold mb-2">Category</h3>
              <select value={selectedCategory} onChange={handleCategoryChange} className="border p-2 w-full">
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.title} value={category.title}>{category.title}</option>
                ))}
              </select>
            </div>
            <p className="mb-2">Estimated Price: ${calculateEstimatedPrice()}</p>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Product</button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
              <div key={index} className="border p-2">
                <h3 className="font-bold">{product.name}</h3>
                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mb-2" />
                <p>Price: ${product.price}</p>
                <p>Raw Materials: {Object.entries(product.rawMaterials).map(([name, quantity]) => `${name}: ${quantity}`).join(', ')}</p>
                <p>Category: {product.category}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    export default Products;
