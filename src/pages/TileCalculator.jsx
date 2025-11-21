// src/pages/TileCalculator.jsx
import { useState, useEffect } from 'react';
import { saveCalculation, getSavedCalculations, removeFromFavorites } from '../services/storage';

const TileCalculator = () => {
  const [mode, setMode] = useState('floor'); // 'floor' или 'wall'
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    coverage: '', // Площадь покрытия одной пачки
    tileLength: '', // Длина плитки (доп. параметр)
    tileWidth: '',  // Ширина плитки (доп. параметр)
    waste: 10       // Запас на подрезку (в %)
  });
  
  const [showAdditional, setShowAdditional] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    setSavedCalculations(getSavedCalculations('tile'));
  }, []);

  const calculate = async () => {
    if (!formData.length || !formData.width || !formData.coverage) return;
    
    setLoading(true);
    
    // Имитация небольшой задержки для анимации
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const area = parseFloat(formData.length) * parseFloat(formData.width);
    const wasteFactor = 1 + (parseFloat(formData.waste) / 100);
    const totalArea = area * wasteFactor;
    const packs = Math.ceil(totalArea / parseFloat(formData.coverage));
    const remainder = totalArea - (packs * parseFloat(formData.coverage));
    
    setResult({
      area: area.toFixed(2),
      totalArea: totalArea.toFixed(2),
      packs: packs,
      remainder: remainder.toFixed(2),
      dimensions: `${formData.length} × ${formData.width} м`,
      coverage: formData.coverage,
      waste: parseFloat(formData.waste)
    });
    
    setLoading(false);
  };

  const saveResult = () => {
    if (!result) return;
    
    const calculation = {
      ...result,
      type: 'tile',
      title: mode === 'floor' ? 'Калькулятор плитки для пола' : 'Калькулятор плитки для стен',
      icon: '🟥',
      mode: mode
    };
    
    const updated = saveCalculation('tile', calculation);
    setSavedCalculations(updated);
    setResult(null);
    setFormData({
      length: '',
      width: '',
      coverage: '',
      tileLength: '',
      tileWidth: '',
      waste: 10
    });
  };

  const removeCalculation = (id) => {
    const updated = removeFromFavorites(id, 'tile');
    setSavedCalculations(updated);
  };

  const clearAll = () => {
    if (window.confirm('Вы уверены, что хотите удалить все расчеты?')) {
      setSavedCalculations([]);
      localStorage.removeItem('tileCalculations');
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Калькулятор плитки</h1>
      
      <div className="card mb-8">
        {/* Табы */}
        <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${mode === 'floor' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setMode('floor')}
          >
            Пол
          </button>
          <button
            className={`px-4 py-2 font-medium ${mode === 'wall' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            onClick={() => setMode('wall')}
          >
            Стена
          </button>
        </div>

        {/* Форма */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              {mode === 'floor' ? 'Длина пола' : 'Высота стены'}
            </label>
            <input 
              type="number" 
              value={formData.length}
              onChange={(e) => setFormData({...formData, length: e.target.value})}
              className="input w-full"
              placeholder="0.0"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              {mode === 'floor' ? 'Ширина пола' : 'Ширина стены'}
            </label>
            <input 
              type="number" 
              value={formData.width}
              onChange={(e) => setFormData({...formData, width: e.target.value})}
              className="input w-full"
              placeholder="0.0"
              step="0.01"
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Площадь покрытия одной пачки (м²)
            </label>
            <input 
              type="number" 
              value={formData.coverage}
              onChange={(e) => setFormData({...formData, coverage: e.target.value})}
              className="input w-full"
              placeholder="0.0"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Дополнительные параметры */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-left font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {showAdditional ? 'Скрыть дополнительные параметры' : 'Дополнительные параметры'}
          </button>
          
          {showAdditional && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Длина плитки (см)</label>
                  <input 
                    type="number" 
                    value={formData.tileLength}
                    onChange={(e) => setFormData({...formData, tileLength: e.target.value})}
                    className="input w-full"
                    placeholder="0"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Ширина плитки (см)</label>
                  <input 
                    type="number" 
                    value={formData.tileWidth}
                    onChange={(e) => setFormData({...formData, tileWidth: e.target.value})}
                    className="input w-full"
                    placeholder="0"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Запас на подрезку ({formData.waste}%)
                </label>
                <input 
                  type="range" 
                  value={formData.waste}
                  onChange={(e) => setFormData({...formData, waste: e.target.value})}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  min="0"
                  max="100"
                  step="1"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={calculate}
            disabled={loading}
            className={`btn btn-primary flex-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V6a6 6 0 616 6h2a8 8 0 11-16 0z"></path>
                </svg>
                Рассчитываем...
              </div>
            ) : (
              'Рассчитать'
            )}
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
          <h2 className="text-xl font-bold mb-4">Результаты расчета</h2>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Площадь поверхности:</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{result.area} м²</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">С учетом запаса ({result.waste}%):</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{result.totalArea} м²</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Необходимо пачек:</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{result.packs}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Остаток материала:</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{result.remainder} м²</div>
              </div>
            </div>
            
            <button 
              onClick={saveResult}
              className="btn btn-primary w-full mt-4 flex items-center justify-center"
            >
              <span className="mr-2">❤️</span>
              Сохранить расчет
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Сохраненные расчеты</h2>
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
            У вас пока нет сохраненных расчетов
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
                  <div className="text-sm text-gray-600 dark:text-gray-300">Площадь: {calc.area} м²</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Пачки: {calc.packs} шт</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Запас: {calc.waste}%</div>
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

export default TileCalculator;