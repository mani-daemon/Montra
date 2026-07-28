import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState({ symbol: '$', code: 'USD' });

  const toggleCurrency = () => {
    setCurrency((prev) => 
      prev.code === 'USD' ? { symbol: '€', code: 'EUR' } : { symbol: '$', code: 'USD' }
    );
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
