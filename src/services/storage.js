// src/services/storage.js
const STORAGE_KEYS = {
  CONCRETE_CALCULATIONS: 'concreteCalculations',
  TILE_CALCULATIONS: 'tileCalculations',
  UNIT_CALCULATIONS: 'unitCalculations',
  FAVORITES: 'favorites'
};

// Функции для работы с localStorage
export const saveCalculation = (type, calculation) => {
  const key = STORAGE_KEYS[`${type.toUpperCase()}_CALCULATIONS`];
  const existing = getSavedCalculations(type);
  const newCalculation = {
    ...calculation,
    id: Date.now(),
    timestamp: new Date().toLocaleString('ru-RU')
  };
  const updated = [newCalculation, ...existing];
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const getSavedCalculations = (type) => {
  const key = STORAGE_KEYS[`${type.toUpperCase()}_CALCULATIONS`];
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const removeFromFavorites = (id, type) => {
  const key = STORAGE_KEYS[`${type.toUpperCase()}_CALCULATIONS`];
  const existing = getSavedCalculations(type);
  const updated = existing.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const clearAllCalculations = (type) => {
  const key = STORAGE_KEYS[`${type.toUpperCase()}_CALCULATIONS`];
  localStorage.removeItem(key);
};

export const getFavorites = () => {
  const concrete = getSavedCalculations('concrete');
  const tile = getSavedCalculations('tile');
  const unit = getSavedCalculations('unit');
  return [...concrete, ...tile, ...unit].sort((a, b) => b.timestamp - a.timestamp);
};

export const removeFromFavoritesAll = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};