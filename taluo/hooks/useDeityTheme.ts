import { useMemo, useCallback } from 'react';
import { Dimensions } from 'react-native';
import { guanyinTheme, yuelaoTheme, caishenTheme } from '../theme/theme';
import { Deity } from '../models/Deity';

const { width } = Dimensions.get('window');

export const useDeityTheme = (currentIndex: number, setCurrentIndex: (index: number) => void, setTheme: (theme: any) => void) => {
  const themeMap = useMemo(() => ({
    guanyin: guanyinTheme,
    yuelao: yuelaoTheme,
    caishen: caishenTheme
  }), []);

  const deities = useMemo(() => Deity.getAllDeities().map(deity => ({
    id: deity.id,
    image: deity.imagePath
  })), []);

  const handleThemeChange = useCallback((index: number) => {
    if (index !== currentIndex && index >= 0 && index < deities.length) {
      setCurrentIndex(index);
      const characterId = deities[index].id;
      setTheme(themeMap[characterId]);
    }
  }, [currentIndex, deities, setCurrentIndex, setTheme, themeMap]);

  const handleScroll = useCallback((event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    handleThemeChange(index);
  }, [handleThemeChange]);

  return {
    deities,
    handleScroll,
    handleThemeChange
  };
};