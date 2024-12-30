import React, { useState, useEffect } from 'react';
    import { saveProduct, getProducts, getRawMaterials, getCategories } from '../utils/storage';
    import { FaChevronDown, FaChevronUp, FaEdit, FaCheck } from 'react-icons/fa';

    function Products() {
      const [products, setProducts] = useState([]);
      const [rawMaterials, setRawMaterials] = useState([]);
      const [categories, setCategories] = useState([]);
      const [name, setName] = useState('');
      const [image, setImage] = useState('');
      const [price, setPrice] = useState('');
      const [selectedRawMaterials, setSelectedRawMaterials] = useState({});
      const [selectedCategory, setSelectedCategory] = useState('');
      const [isFormOpen, setIsFormOpen] = useState(false);

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
        setIsFormOpen(false);
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

      const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});

      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <div className="mb-4">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-gray-200 p-2 rounded w-full text-left flex items-center justify-between"
            >
              <span>Add Product</span>
              {isFormOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isFormOpen && (
              <form onSubmit={handleSubmit} className="mt-2 p-4 border rounded">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 mr-2 mb-2 w-full" required />
                <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="border p-2 mr-2 mb-2 w-full" required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 mr-2 mb-2 w-full" required />
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
            )}
          </div>
          <div>
            {Object.entries(groupedProducts).map(([category, products]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product, index) => (
                    <div key={index} className="border p-2 flex flex-col">
                      <h3 className="font-bold">{product.name}</h3>
                      <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mb-2" />
                      <p>Price: ${product.price}</p>
                      <p>Raw Materials: {Object.entries(product.rawMaterials).map(([name, quantity]) => `${name}: ${quantity}`).join(', ')}</p>
                      <div className="mt-2 flex justify-end">
                        <button className="text-blue-500 hover:text-blue-700 mr-2"><FaEdit /></button>
                        <button className="text-green-500 hover:text-green-700"><FaCheck /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    export default Products;
