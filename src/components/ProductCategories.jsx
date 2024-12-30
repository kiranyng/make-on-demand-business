import React, { useState, useEffect } from 'react';
    import { saveCategory, getCategories } from '../utils/storage';
    import { FaChevronDown } from 'react-icons/fa';
    import { FaChevronUp } from 'react-icons/fa';
    import { FaEdit } from 'react-icons/fa';
    import { FaCheck } from 'react-icons/fa';

    function ProductCategories() {
      const [categories, setCategories] = useState([]);
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [manufacturingStages, setManufacturingStages] = useState(['']);
      const [isFormOpen, setIsFormOpen] = useState(false);

      useEffect(() => {
        const fetchCategories = async () => {
          const categories = await getCategories();
          setCategories(categories);
        };
        fetchCategories();
      }, []);

      const handleStageChange = (index, value) => {
        const newStages = [...manufacturingStages];
        newStages[index] = value;
        setManufacturingStages(newStages);
      };

      const addStage = () => {
        setManufacturingStages([...manufacturingStages, '']);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const newCategory = {
          title,
          description,
          manufacturingStages: manufacturingStages.filter(stage => stage.trim() !== '')
        };
        await saveCategory(newCategory);
        setCategories([...categories, newCategory]);
        setTitle('');
        setDescription('');
        setManufacturingStages(['']);
        setIsFormOpen(false);
      };

      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Product Categories</h2>
          <div className="mb-4">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-gray-200 p-2 rounded w-full text-left flex items-center justify-between"
            >
              <span>Add Category</span>
              {isFormOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isFormOpen && (
              <form onSubmit={handleSubmit} className="mt-2 p-4 border rounded">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 mr-2 mb-2 w-full" required />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 mr-2 mb-2 w-full" required />
                <div className="mb-2">
                  <h3 className="text-lg font-semibold mb-2">Manufacturing Stages</h3>
                  {manufacturingStages.map((stage, index) => (
                    <div key={index} className="flex items-center mb-1">
                      <input
                        type="text"
                        placeholder={`Stage ${index + 1}`}
                        value={stage}
                        onChange={(e) => handleStageChange(index, e.target.value)}
                        className="border p-1 mr-2 w-full"
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addStage} className="bg-gray-300 text-gray-700 p-1 rounded">Add Stage</button>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Category</button>
              </form>
            )}
          </div>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index} className="border p-2 flex items-center justify-between">
                <span>
                  <h3 className="font-bold">{category.title}</h3>
                  <p>{category.description}</p>
                  <p>Manufacturing Steps: {category.manufacturingStages.join(', ')}</p>
                </span>
                <div>
                  <button className="text-blue-500 hover:text-blue-700 mr-2"><FaEdit /></button>
                  <button className="text-green-500 hover:text-green-700"><FaCheck /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default ProductCategories;
