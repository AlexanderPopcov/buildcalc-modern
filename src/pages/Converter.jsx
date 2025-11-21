// src/pages/Converter.jsx
import { useState, useEffect } from 'react';
import { saveCalculation, getSavedCalculations, removeFromFavorites } from '../services/storage';

const Converter = () => {
  const [category, setCategory] = useState('length'); // 'length', 'volume', 'weight'
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    setSavedCalculations(getSavedCalculations('unit'));
  }, []);

  // Определение единиц измерения
  const units = {
    length: [
      { value: 'm', label: 'Метры', factor: 1 },
      { value: 'cm', label: 'Сантиметры', factor: 0.01 },
      { value: 'mm', label: 'Миллиметры', factor: 0.001 },
      { value: 'km', label: 'Километры', factor: 1000 },
      { value: 'in', label: 'Дюймы', factor: 0.0254 },
      { value: 'ft', label: 'Футы', factor: 0.3048 }
    ],
    volume: [
      { value: 'm3', label: 'М³', factor: 1 },
      { value: 'l', label: 'Литры', factor: 0.001 },
      { value: 'cm3', label: 'См³', factor: 0.000001 },
      { value: 'ml', label: 'Миллилитры', factor: 0.000001 },
      { value: 'gal', label: 'Галлоны', factor: 0.00378541 }
    ],
    weight: [
      { value: 'kg', label: 'Килограммы', factor: 1 },
      { value: 'g', label: 'Граммы', factor: 0.001 },
      { value: 't', label: 'Тонны', factor: 1000 },
      { value: 'mg', label: 'Миллиграммы', factor: 0.000001 },
      { value: 'lb', label: 'Фунты', factor: 0.453592 }
    ]
  };

  // Быстрые шаблоны
  const quickTemplates = {
    length: [
      { from: 'm', to: 'cm', label: 'М → См' },
      { from: 'cm', to: 'mm', label: 'См → Мм' },
      { from: 'm', to: 'ft', label: 'М → Футы' },
      { from: 'km', to: 'm', label: 'Км → М' }
    ],
    volume: [
      { from: 'm3', to: 'l', label: 'М³ → Л' },
      { from: 'l', to: 'ml', label: 'Л → Мл' },
      { from: 'm3', to: 'cm3', label: 'М³ → См³' }
    ],
    weight: [
      { from: 'kg', to: 'g', label: 'Кг → Г' },
      { from: 'kg', to: 't', label: 'Кг → Т' },
      { from: 'g', to: 'mg', label: 'Г → Мг' }
    ]
  };

  // Установка начальных значений при смене категории
  useEffect(() => {
    const availableUnits = units[category];
    if (availableUnits.length >= 2) {
      setFromUnit(availableUnits[0].value);
      setToUnit(availableUnits[1].value);
    }
  }, [category]);

  const convert = () => {
    if (!value || !fromUnit || !toUnit) return;

    const inputValue = parseFloat(value);
    if (isNaN(inputValue)) return;

    const fromUnitData = units[category].find(u => u.value === fromUnit);
    const toUnitData = units[category].find(u => u.value === toUnit);

    if (!fromUnitData || !toUnitData) return;

    // Преобразование в базовую единицу (например, метры, кубометры, килограммы)
    const baseValue = inputValue * fromUnitData.factor;
    // Преобразование из базовой в целевую
    const convertedValue = baseValue / toUnitData.factor;

    setResult({
      input: inputValue,
      from: fromUnit,
      to: toUnit,
      result: convertedValue,
      category: category
    });
  };

  const saveResult = () => {
    if (!result) return;
    
    const calculation = {
      ...result,
      type: 'unit',
      title: 'Конвертер единиц',
      icon: '🔄'
    };
    
    const updated = saveCalculation('unit', calculation);
    setSavedCalculations(updated);
    setResult(null);
    setValue('');
  };

  const removeCalculation = (id) => {
    const updated = removeFromFavorites(id, 'unit');
    setSavedCalculations(updated);
  };

  const clearAll = () => {
    if (window.confirm('Вы уверены, что хотите удалить все конвертации?')) {
      setSavedCalculations([]);
      localStorage.removeItem('unitCalculations');
    }
  };

  const useTemplate = (template) => {
    setFromUnit(template.from);
    setToUnit(template.to);
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Конвертер единиц</h1>
      
      <div className="card mb-8">
        <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${category === 'length' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setCategory('length')}
          >
            Длина
          </button>
          <button
            className={`px-4 py-2 font-medium ${category === 'volume' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setCategory('volume')}
          >
            Объем
          </button>
          <button
            className={`px-4 py-2 font-medium ${category === 'weight' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setCategory('weight')}
          >
            Вес
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Значение</label>
            <input 
              type="number" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input w-full"
              placeholder="Введите значение"
              step="any"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Из</label>
            <select 
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="input w-full"
            >
              {units[category].map(unit => (
                <option key={unit.value} value={unit.value}>{unit.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">В</label>
            <select 
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="input w-full"
            >
              {units[category].map(unit => (
                <option key={unit.value} value={unit.value}>{unit.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={convert}
            className="btn btn-primary flex-1"
          >
            Конвертировать
          </button>
          
          {result && (
            <button 
              onClick={saveResult}
              className="btn btn-outline flex-1"
            >
              Сохранить в избранное
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="card mb-8 animate-fade-in">
          <h2 className="text-xl font-bold mb-4">Результат конвертации</h2>
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.input} {result.from} = {result.result.toFixed(6)} {result.to}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {result.category === 'length' && 'Длина'}
              {result.category === 'volume' && 'Объем'}
              {result.category === 'weight' && 'Вес'}
            </div>
          </div>
        </div>
      )}

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Быстрые шаблоны</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {quickTemplates[category].map((template, index) => (
            <button
              key={index}
              onClick={() => useTemplate(template)}
              className="btn btn-outline text-sm p-2"
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Сохраненные конвертации</h2>
          {savedCalculations.length > 0 && (
            <button 
              onClick={clearAll}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Очистить все
            </button>
          )}
        </div>
        
        {savedCalculations.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center py-8">
            У вас пока нет сохраненных конвертаций
          </p>
        ) : (
          <div className="space-y-4">
            {savedCalculations.map((calc) => (
              <div key={calc.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{calc.icon}</span>
                    <span className="font-medium">{calc.title}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{calc.timestamp}</span>
                </div>
                
                <div className="mb-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {calc.input} {calc.from} = {calc.result.toFixed(6)} {calc.to}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {calc.category === 'length' && 'Длина'}
                    {calc.category === 'volume' && 'Объем'}
                    {calc.category === 'weight' && 'Вес'}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => removeCalculation(calc.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Converter;