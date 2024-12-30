import React, { useState, useEffect } from 'react';
    import { saveRawMaterial, getRawMaterials } from '../utils/storage';

    function RawMaterials() {
      const [rawMaterials, setRawMaterials] = useState([]);
      const [name, setName] = useState('');
      const [unit, setUnit] = useState('');
      const [pricePerUnit, setPricePerUnit] = useState('');

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
      };

      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Raw Materials</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 mr-2" required />
            <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="border p-2 mr-2" required />
            <input type="number" placeholder="Price per unit" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className="border p-2 mr-2" required />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Material</button>
          </form>
          <ul className="space-y-2">
            {rawMaterials.map((material, index) => (
              <li key={index} className="border p-2">
                {material.name} - {material.unit} - ${material.pricePerUnit}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default RawMaterials;
