import { Platform, Alert } from 'react-native';
import {
  initConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  requestPurchase,
  getProducts,
  ProductPurchase,
  finishTransaction,
} from 'react-native-iap';

// 定义商品 ID
const productIds = [
  'com.taluo.coins.60',
  'com.taluo.coins.120',
  'com.taluo.coins.280',
  'com.taluo.coins.580',
  'com.taluo.coins.980',
];

class IAPManager {
  private static purchaseUpdateSubscription: any;
  private static purchaseErrorSubscription: any;

  static async initialize() {
    try {
      if (Platform.OS === 'ios') {
        await initConnection();
        this.setupListeners();
      }
    } catch (err) {
      console.error('IAP 初始化失败:', err);
    }
  }

  private static setupListeners() {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            // 验证收据
            await this.validateReceipt(receipt);
            // 完成交易
            await finishTransaction({ purchase });
          } catch (err) {
            console.error('处理购买失败:', err);
          }
        }
      }
    );

    this.purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.error('购买错误:', error);
      Alert.alert('购买失败', '请稍后重试');
    });
  }

  static async getAvailableProducts() {
    try {
      const products = await getProducts({ skus: productIds });
      return products;
    } catch (err) {
      console.error('获取商品列表失败:', err);
      return [];
    }
  }

  static async purchaseProduct(productId: string) {
    try {
      await requestPurchase({ sku: productId });
    } catch (err) {
      console.error('发起购买失败:', err);
      Alert.alert('购买失败', '请稍后重试');
    }
  }

  private static async validateReceipt(receipt: string) {
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_APPLE_PAY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          receipt,
          user_id: '2' // 这里需要传入实际的用户ID
        }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error('收据验证失败');
      }
      return result;
    } catch (err) {
      console.error('验证收据失败:', err);
      throw err;
    }
  }

  static cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
  }
}

export default IAPManager;
import { API_ENDPOINTS } from '../config';

// 首先在 config.ts 中添加新的端点