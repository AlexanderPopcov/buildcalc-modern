// src/pages/ConcreteCalculator.jsx
import { useState, useEffect } from 'react';
import { saveCalculation, getSavedCalculations, removeFromFavorites } from '../services/storage';

const ConcreteCalculator = () => {
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    setSavedCalculations(getSavedCalculations('concrete'));
  }, []);

  const calculate = async () => {
    const { length, width, height } = formData;
    if (!length || !width || !height) return;

    setLoading(true);
    
    // Имитация небольшой задержки для анимации
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
    const weight = volume * 2400; // Средняя плотность бетона 2400 кг/м³

    setResult({
      volume: volume.toFixed(3),
      weight: weight.toFixed(2),
      dimensions: `${length} × ${width} × ${height} м`
    });
    
    setLoading(false);
  };

  const saveResult = () => {
    if (!result) return;
    
    const calculation = {
      ...result,
      type: 'concrete',
      title: 'Калькулятор бетона',
      icon: '🏗️'
    };
    
    const updated = saveCalculation('concrete', calculation);
    setSavedCalculations(updated);
    setResult(null);
    setFormData({ length: '', width: '', height: '' });
  };

  const removeCalculation = (id) => {
    const updated = removeFromFavorites(id, 'concrete');
    setSavedCalculations(updated);
  };

  const clearAll = () => {
    if (window.confirm('Вы уверены, что хотите удалить все расчеты?')) {
      setSavedCalculations([]);
      localStorage.removeItem('concreteCalculations');
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Калькулятор бетона</h1>
      
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Длина (м)</label>
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
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Ширина (м)</label>
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
          
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Высота (м)</label>
            <input 
              type="number" 
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              className="input w-full"
              placeholder="0.0"
              step="0.01"
              min="0"
            />
          </div>
        </div>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">Объем</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.volume} м³</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">Вес</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.weight} кг</div>
            </div>
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
                  <div className="text-sm text-gray-600 dark:text-gray-300">Размеры: {calc.dimensions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Объем: {calc.volume} м³</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Вес: {calc.weight} кг</div>
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

export default ConcreteCalculator;