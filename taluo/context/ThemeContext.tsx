import React, { createContext, useContext, useState } from 'react';
import { Theme, guanyinTheme, caishenTheme, yuelaoTheme } from '../theme/theme';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentDeityIndex: number;
  setCurrentDeityIndex: (index: number) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(guanyinTheme); // 默认使用观音主题
  const [currentDeityIndex, setCurrentDeityIndex] = useState<number>(0); // 假设观音是第一个

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentDeityIndex, setCurrentDeityIndex }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 辅助函数：根据人物ID获取对应主题
export const getThemeByCharacter = (characterId: string): Theme => {
  switch (characterId) {
    case 'guanyin':
      return guanyinTheme;
    case 'yuelao':
      return yuelaoTheme;
    case 'caishen':
    default:
      return caishenTheme;
  }
};