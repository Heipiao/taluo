import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { BottomSheet, ListItem, Text } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import IAPManager from '../utils/IAPManager';

interface RechargeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (amount: number) => void;
}

const rechargeOptions = [
  { amount: 60, coins: 600, price: '6', productId: 'com.taluo.coins.60', popular: false },
  { amount: 120, coins: 1200, price: '12', productId: 'com.taluo.coins.120', popular: false },
  { amount: 280, coins: 3000, price: '28', productId: 'com.taluo.coins.280', popular: true },
  { amount: 580, coins: 6500, price: '58', productId: 'com.taluo.coins.580', popular: false },
  { amount: 980, coins: 12000, price: '98', productId: 'com.taluo.coins.980', popular: false },
];

const RechargeModal: React.FC<RechargeModalProps> = ({ isVisible, onClose, onSelect }) => {
  const handlePurchase = async (option: typeof rechargeOptions[0]) => {
    try {
      await IAPManager.purchaseProduct(option.productId);
      onSelect(option.amount);
    } catch (error) {
      console.error('购买失败:', error);
    }
  };
  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      <LinearGradient
        colors={['#FFF7E6', '#FFFFFF']}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <Image 
            source={require('../assets/images/coins.png')}
            style={styles.headerIcon}
          />
          <Text h4 style={styles.title}>充值铜钱</Text>
          <Text style={styles.subtitle}>选择最适合您的充值方案</Text>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {rechargeOptions.map((option, index) => (
            <ListItem
              key={index}
              onPress={() => handlePurchase(option)}
              containerStyle={[
                styles.optionContainer,
                option.popular && styles.popularOption
              ]}
            >
              {option.popular && (
                <View style={styles.popularTag}>
                  <Text style={styles.popularTagText}>最受欢迎</Text>
                </View>
              )}
              <ListItem.Content style={styles.optionContent}>
                <View style={styles.leftContent}>
                  <View style={styles.coinsContainer}>
                    <Image
                      source={require('../assets/images/coin.png')}
                      style={styles.coinIcon}
                    />
                    <Text style={styles.coinsText}>{option.coins}铜钱</Text>
                  </View>
                  {option.amount >= 280 && (
                    <View style={styles.bonusContainer}>
                      <Text style={styles.bonusText}>赠送20%</Text>
                    </View>
                  )}
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceSymbol}>￥</Text>
                  <Text style={styles.priceText}>{option.price}</Text>
                </View>
              </ListItem.Content>
            </ListItem>
          ))}
        </ScrollView>
      </LinearGradient>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 66,
    height: 119,
    marginBottom: 12,
    resizeMode: 'contain',  // 确保图片完整显示
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
  },
  optionContainer: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  popularOption: {
    borderColor: '#FFB800',
    borderWidth: 2,
  },
  popularTag: {
    position: 'absolute',
    top: -12,
    right: 12,
    backgroundColor: '#FFB800',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  leftContent: {
    flex: 1,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 40,
    height: 72,
    marginRight: 8,
    resizeMode: 'contain',  // 确保图片完整显示
  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  bonusContainer: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  bonusText: {
    fontSize: 12,
    color: '#FF4D4F',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceSymbol: {
    fontSize: 16,
    color: '#FF4D4F',
    fontWeight: '600',
    marginBottom: 2,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
});

export default RechargeModal;