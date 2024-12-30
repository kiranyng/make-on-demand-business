import React, { useState, useEffect } from 'react';
    import { saveRawMaterial, getRawMaterials } from '../utils/storage';
    import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
    import localforage from 'localforage';

    function RawMaterials() {
      const [rawMaterials, setRawMaterials] = useState([]);
      const [name, setName] = useState('');
      const [unit, setUnit] = useState('');
      const [pricePerUnit, setPricePerUnit] = useState('');
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [currency, setCurrency] = useState('USD');

      useEffect(() => {
        const fetchRawMaterials = async () => {
          const materials = await getRawMaterials();
          setRawMaterials(materials);
        };
        const fetchCurrency = async () => {
          const storedCurrency = await localforage.getItem('currency');
          if (storedCurrency) setCurrency(storedCurrency);
        };
        fetchRawMaterials();
        fetchCurrency();
      }, []);

      const handleSubmit = async (e) => {
        e.preventDefault();
        const newMaterial = { name, unit, pricePerUnit: parseFloat(pricePerUnit) };
        await saveRawMaterial(newMaterial);
        setRawMaterials([...rawMaterials, newMaterial]);
        setName('');
        setUnit('');
        setPricePerUnit('');
        setIsFormOpen(false);
      };

      const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
        });
        return formatter.format(amount);
      };

      return (
        <div className="dark:bg-gray-700 p-4">
          <h2 className="text-2xl font-bold mb-4">Raw Materials</h2>
          <div className="mb-4">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-gray-200 p-2 rounded w-full text-left flex items-center justify-between dark:bg-gray-800 dark:text-gray-300"
            >
              <span>Add Material</span>
              {isFormOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isFormOpen && (
              <form onSubmit={handleSubmit} className="mt-2 p-4 border rounded dark:bg-gray-800 dark:border-gray-600">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="border p-2 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                <input type="number" placeholder="Price per unit" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className="border p-2 mr-2 mb-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Material</button>
              </form>
            )}
          </div>
          <ul className="space-y-2">
            {rawMaterials.map((material, index) => (
              <li key={index} className="border p-2 flex items-center justify-between dark:bg-gray-800 dark:border-gray-600">
                <span className="dark:text-gray-300">{material.name} - {material.unit} - {formatCurrency(material.pricePerUnit)}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default RawMaterials;
