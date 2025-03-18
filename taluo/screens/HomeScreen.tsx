// HomeScreen.tsx
import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import HomeIcon from '../assets/icons/tab/home.svg';
import FortuneIcon from '../assets/icons/tab/fortune.svg';
import ProfileIcon from '../assets/icons/tab/profile.svg';
import BackIcon from '../assets/icons/home/back.svg';
import MYIcon from '../assets/icons/home/my.svg';
import Carousel from 'react-native-reanimated-carousel';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import ExploreTab from './ExploreTab';
import FortuneTab from './FortuneTab';
import ProfileTab from './ProfileTab';
import { guanyinTheme, yuelaoTheme, caishenTheme } from '../theme/theme';
const { width, height } = Dimensions.get('window');
import { Deity } from '../models/Deity';
import CloudIcon from '../assets/icons/home/cloud.svg';  // 添加在文件顶部其他图标导入处
import { useNavigation } from '@react-navigation/native';  // 添加在文件顶部的导入部分
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

const FortuneCard = ({ title, id }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentDeityIndex } = useTheme();
  
  const handlePress = () => {
    navigation.navigate('占卜', {
      fortuneId: id,
      fortuneType: title,
      deityId: carouselItems[currentDeityIndex].id
    });
  };

  return (
    <TouchableOpacity style={styles.fortuneCard} onPress={handlePress}>
      <View style={styles.cardLeftContent}>
        <CloudIcon
          width={48}
          height={48}
          style={{ marginRight: 25 }}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const carouselItems = Deity.getAllDeities().map(deity => ({
  id: deity.id,
  image: deity.imagePath
}));


const HomeScreen: React.FC = () => {
  const Tab = createBottomTabNavigator();
  const { theme, setTheme, currentDeityIndex, setCurrentDeityIndex } = useTheme();

  // 预加载所有图片
  useEffect(() => {
    const preloadImages = async () => {
      const imageAssets = carouselItems.map(item => {
        return Asset.fromModule(item.image).downloadAsync();
      });
      await Promise.all(imageAssets);
    };

    preloadImages();
  }, []);

  const MainContent = () => {
    const handleSnapToItem = useCallback((index) => {
      if (index !== currentDeityIndex) {
        setCurrentDeityIndex(index);
        const characterId = carouselItems[index].id;
        const themeMap = {
          guanyin: guanyinTheme,
          yuelao: yuelaoTheme,
          caishen: caishenTheme
        };
        setTheme(themeMap[characterId]);
      }
    }, [currentDeityIndex, setCurrentDeityIndex, setTheme]);

    const renderCarouselItem = useCallback(( item ) => {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.backgroundImage}
            resizeMode="cover"
            fadeDuration={0} // 禁用淡入效果以提高性能
          />
          <LinearGradient
            colors={[theme.backgroundColor || '#f5f5f5', 'transparent']}
            style={styles.gradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
        </View>
      );
    }, [theme.backgroundColor]);

    return (
      <Animated.ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.header}>
          <Carousel
            loop
            width={width}
            height={height * 0.35}
            data={carouselItems}
            renderItem={({ item }) => renderCarouselItem(item)}
            onSnapToItem={handleSnapToItem}
            defaultIndex={currentDeityIndex}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 1,
              parallaxScrollingOffset: 10,
            }}
            scrollAnimationDuration={10}
          />
        </View>
        
        <View style={styles.content}>
          
          <View style={styles.tagContainer}>
            <View style={styles.avatarNameContainer}>
              <Image
                source={Deity.getDeityById(carouselItems[currentDeityIndex].id)?.imagePath}
                style={styles.avatarImage}
              />
              <Text style={[styles.blessingText]}>{Deity.getDeityById(carouselItems[currentDeityIndex].id)?.name || ''}</Text>
            </View>
            <View style={styles.tagContainer}>
              {Deity.getDeityTags(carouselItems[currentDeityIndex].id).map((tag) => (
                <TouchableOpacity key={tag.id} style={[styles.tag, { backgroundColor:  theme.tabBackground }]}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={styles.blessingTextdescription}>{Deity.getDeityById(carouselItems[currentDeityIndex].id)?.description || ''}</Text>
          {/* <TouchableOpacity style={styles.fortuneButton}>
            <Text style={styles.fortuneButtonText}>开始占卜</Text>
          </TouchableOpacity> */}

          <View style={styles.cardsContainer}>
            <View style={styles.cardRow}>
              <FortuneCard title="今日运势" id="1" />
              <FortuneCard title="事业运" id="2" />
            </View>
            <View style={styles.cardRow}>
              <FortuneCard title="感情运" id="3" />
              <FortuneCard title="财运" id="4" />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: theme.backgroundColor
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            '主页': HomeIcon,
            '占卜': FortuneIcon,
            '我的': ProfileIcon
          };

          const IconComponent = icons[route.name];

          return (
            <IconComponent
              width={24}
              height={24}
              fill={focused ? theme.activeTintColor : theme.inactiveTintColor}
            />
          );
        },
        tabBarActiveTintColor: theme.activeTintColor,
        tabBarInactiveTintColor: theme.inactiveTintColor,
        headerShown: false
      })}
    >
      <Tab.Screen name="主页" component={MainContent} />
      <Tab.Screen 
        name="占卜" 
        component={FortuneTab}
        options={({ navigation }) => ({
          tabBarStyle: { display: 'none' },
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('主页')}
              style={{ marginLeft: 16 }}
            >
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('我的')}
              style={{ marginRight: 16 }}
            >
              <MYIcon width={24} height={24} />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen 
            name="我的" 
            component={ProfileTab}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#FFFFFF',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0
              },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('占卜')}
                  style={{ marginLeft: 16 }}
                >
                  <BackIcon width={24} height={24} />
                </TouchableOpacity>
              ),
            })}
          />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    height: height * 0.35,
    width: width,
    overflow: 'hidden'
  },
  backgroundImage: {
    width: width,
    height: height * 0.35,
    resizeMode: 'cover'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  blessingText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF'
  },
  blessingTextdescription: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF'
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  avatarNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  fortuneButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
  },
  fortuneButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardsContainer: {
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  fortuneCard: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    width: (width - 60) / 2,
    borderWidth: 0.5,  // 改为更细的边框
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    height: 80,  // 减小高度
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  cardButton: {
    width: 24,
    height: 24,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',  // 改为白色
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  scrollViewContent: {
    flexDirection: 'row',
    width: width * carouselItems.length
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: height * 0.35
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.35
  },

  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF'
  },
 
});

export default HomeScreen;