import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BottomSheet, ListItem, Text } from '@rneui/themed';

interface RechargeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (amount: number) => void;
}

const rechargeOptions = [
  { amount: 60, coins: 600, price: '6' },
  { amount: 120, coins: 1200, price: '12' },
  { amount: 280, coins: 3000, price: '28' },
  { amount: 580, coins: 6500, price: '58' },
  { amount: 980, coins: 12000, price: '98' },
];

const RechargeModal: React.FC<RechargeModalProps> = ({ isVisible, onClose, onSelect }) => {
  return (
    <BottomSheet isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <Text h4 style={styles.title}>充值铜钱</Text>
        <ScrollView>
          {rechargeOptions.map((option, index) => (
            <ListItem
              key={index}
              onPress={() => onSelect(option.amount)}
              containerStyle={styles.optionContainer}
            >
              <ListItem.Content style={styles.optionContent}>
                <View style={styles.leftContent}>
                  <Text style={styles.coinsText}>{option.coins}铜钱</Text>
                  <Text style={styles.bonusText}>
                    {option.amount >= 280 ? '赠送20%' : ''}
                  </Text>
                </View>
                <Text style={styles.priceText}>￥{option.price}</Text>
              </ListItem.Content>
            </ListItem>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  optionContainer: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'column',
  },
  coinsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bonusText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default RechargeModal;