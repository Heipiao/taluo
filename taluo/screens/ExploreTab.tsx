// ExploreTab.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  FortuneTab: { buttonId: string } | undefined;
};

const { width } = Dimensions.get('window');

// 模拟走马灯的图片数据（根据需求添加更多）
const carouselItems = [
  { id: '1', image: require('../assets/caishen.jpg') }, // 请确保路径正确
  { id: '2', image: require('../assets/yuelao.jpg') },
  { id: '3', image: require('../assets/guanyin.jpg') },
];

// 下方按钮数据
const bottomButtons = [
  { id: 'daily', title: '每日一签' },
  { id: 'relationship', title: '姻缘' },
  { id: 'career', title: '事业' },
  { id: 'wealth', title: '财富' },
];

const ExploreTab: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // 渲染走马灯中的每一项
  const renderCarouselItem = (item: { id: string; image: any }) => {
    return (
      <View style={styles.carouselItem} key={item.id}>
        <Image source={item.image} style={styles.carouselImage} resizeMode="cover" />
        <TouchableOpacity
          style={styles.luckButton}
          onPress={() => console.log(`求签：${item.id}`)}
        >
          <Text style={styles.luckButtonText}>求签</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 上半部分：走马灯，正方形区域 */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {carouselItems.map(renderCarouselItem)}
        </ScrollView>
      </View>

      {/* 下半部分：四个功能按钮 */}
      <View style={styles.bottomButtonsContainer}>
        {bottomButtons.map(button => (
          <TouchableOpacity
            key={button.id}
            style={styles.bottomButton}
            onPress={() => {
              navigation.navigate('FortuneTab', { buttonId: button.id });
            }}
          >
            <Text style={styles.bottomButtonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    width: width,
    height: width, // 走马灯区域为正方形
  },
  carouselItem: {
    width: width,
    height: width, // 确保每个页面与容器保持正方形
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: width,
    height: width, // 图片铺满正方形区域
  },
  luckButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#ff5722',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  luckButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  bottomButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: (width - 60) / 2, // 根据屏幕宽度计算按钮宽度（两按钮一行）
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ExploreTab;
