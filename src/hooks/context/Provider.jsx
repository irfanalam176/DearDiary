import { View, Text } from 'react-native'
import React, { useState } from 'react'
import AdContext from './context'

const Provider = ({children}) => {
  const [adFrequency, setAdFrequency] = useState(0);
  const [saveCount, setSaveCount] = useState(0); // ✅ Global save counter

  const incrementSaveCount = () => {
    setSaveCount(prev => prev + 1);
  };

  const resetSaveCount = () => {
    setSaveCount(0);
  };

  const shouldShowAd = () => {
   return saveCount === 0 || (saveCount > 0 && saveCount % 3 === 0);
  };

  return (
    <AdContext.Provider value={{
      adFrequency,
      setAdFrequency,
      saveCount,
      incrementSaveCount,
      resetSaveCount,
      shouldShowAd
    }}>
        {children}
    </AdContext.Provider>
  )
}

export default Provider