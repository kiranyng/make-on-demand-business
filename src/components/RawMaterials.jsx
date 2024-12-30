import React, { useState, useEffect } from 'react';
    import { saveRawMaterial, getRawMaterials } from '../utils/storage';
    import { FaChevronDown, FaChevronUp, FaEdit, FaCheck } from 'react-icons/fa';

    function RawMaterials() {
      const [rawMaterials, setRawMaterials] = useState([]);
      const [name, setName] = useState('');
      const [unit, setUnit] = useState('');
      const [pricePerUnit, setPricePerUnit] = useState('');
      const [isFormOpen, setIsFormOpen] = useState(false);

      useEffect(() => {
        const fetchRawMaterials = async () => {
          const materials = await getRawMaterials();
          setRawMaterials(materials);
        };
        fetchRawMaterials();
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

      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Raw Materials</h2>
          <div className="mb-4">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-gray-200 p-2 rounded w-full text-left flex items-center justify-between"
            >
              <span>Add Material</span>
              {isFormOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isFormOpen && (
              <form onSubmit={handleSubmit} className="mt-2 p-4 border rounded">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 mr-2 mb-2 w-full" required />
                <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="border p-2 mr-2 mb-2 w-full" required />
                <input type="number" placeholder="Price per unit" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className="border p-2 mr-2 mb-2 w-full" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Material</button>
              </form>
            )}
          </div>
          <ul className="space-y-2">
            {rawMaterials.map((material, index) => (
              <li key={index} className="border p-2 flex items-center justify-between">
                <span>{material.name} - {material.unit} - ${material.pricePerUnit}</span>
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

    export default RawMaterials;
