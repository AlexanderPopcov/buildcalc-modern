// src/pages/Favorites.jsx
import { useState, useEffect } from 'react';
import { getFavorites, removeFromFavoritesAll, removeFromFavorites } from '../services/storage';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allFavorites = getFavorites();
    setFavorites(allFavorites);
    setLoading(false);
  }, []);

  const removeItem = (id, type) => {
    removeFromFavorites(id, type);
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Вы уверены, что хотите удалить все сохраненные расчеты?')) {
      removeFromFavoritesAll();
      setFavorites([]);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="text-2xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Избранное</h1>
        {favorites.length > 0 && (
          <button 
            onClick={clearAll}
            className="btn btn-outline text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Очистить все
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold mb-4">Избранное пусто</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Вы еще не сохранили ни одного расчета
          </p>
          <a 
            href="/" 
            className="btn btn-primary inline-block w-fit mx-auto"
          >
            Начать расчеты
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((calc) => (
            <div key={calc.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{calc.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{calc.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{calc.timestamp}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(calc.id, calc.type)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Удалить"
                >
                  🗑️
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calc.type === 'concrete' && (
                  <>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Размеры</div>
                      <div className="font-medium">{calc.dimensions}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Объем</div>
                      <div className="font-medium">{calc.volume} м³</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Вес</div>
                      <div className="font-medium">{calc.weight} кг</div>
                    </div>
                  </>
                )}
                
                {calc.type === 'tile' && (
                  <>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Площадь</div>
                      <div className="font-medium">{calc.area} м²</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Плитка</div>
                      <div className="font-medium">{calc.tileSize}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Всего</div>
                      <div className="font-medium">{calc.total} шт</div>
                    </div>
                  </>
                )}
                
                {calc.type === 'unit' && (
                  <>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Из</div>
                      <div className="font-medium">{calc.input} {calc.from}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">В</div>
                      <div className="font-medium">{calc.result.toFixed(6)} {calc.to}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;