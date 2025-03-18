import React, { useState } from 'react';
// import Clipboard from '@react-native-clipboard/clipboard';
import { View, StyleSheet, TouchableOpacity, Alert, Platform, ImageBackground } from 'react-native';
import { Text, Avatar, ListItem, Button, Input, Overlay } from '@rneui/themed';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import RechargeModal from '../components/RechargeModal';
import { API_ENDPOINTS } from '../config';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const ProfileTab: React.FC = () => {
  const isFocused = useIsFocused();
  const { state, dispatch } = useAuth();
  const navigation = useNavigation();
  const { theme } = useTheme(); // 获取当前主题
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isRechargeVisible, setIsRechargeVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [inviteInfo, setInviteInfo] = useState({ code: '', usageCount: 0 });
  const [coins, setCoins] = useState(0);
  const [editForm, setEditForm] = useState({
    username: state.user?.username || '',
    email: state.user?.email || ''
  });
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      console.log('ProfileTab - useEffect 触发, 状态:', {
        hasToken: !!state.user?.token,
        isFocused
      });

      if (state.user?.token) {
        console.log('ProfileTab - 开始获取用户信息');
        await fetchUserInfo();
      } else {
        console.log('ProfileTab - 未检测到 token，跳转到登录页');
        navigation.navigate('Login' as never);
      }
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused, state.user?.token]);

  const fetchUserInfo = async () => {
    try {
      console.log('ProfileTab - 开始获取邀请码信息');
      const inviteResponse = await fetch(API_ENDPOINTS.GET_INVITE_INFO, {
        headers: {
          'Authorization': `Bearer ${state.user?.token}`
        }
      });

      console.log('ProfileTab - 邀请码接口响应状态:', inviteResponse.status);

      if (!inviteResponse.ok) {
        throw new Error(`获取邀请码失败: ${inviteResponse.status}`);
      }

      const inviteData = await inviteResponse.json();
      console.log('ProfileTab - 邀请码接口响应数据:', inviteData);
      
      const inviteCode = inviteData.invite_code || inviteData;
      setInviteInfo(typeof inviteCode === 'string' ? { code: inviteCode, usageCount: 0 } : inviteCode);
      console.log('ProfileTab - 邀请码信息已更新:', inviteCode);

      console.log('ProfileTab - 开始获取铜钱余额');
      const coinsResponse = await fetch(API_ENDPOINTS.GET_COINS, {
        headers: {
          'Authorization': `Bearer ${state.user?.token}`
        }
      });

      console.log('ProfileTab - 铜钱余额接口响应状态:', coinsResponse.status);

      if (!coinsResponse.ok) {
        throw new Error(`获取铜钱余额失败: ${coinsResponse.status}`);
      }

      const coinsData = await coinsResponse.json();
      console.log('ProfileTab - 铜钱余额接口响应数据:', coinsData);
      
      setCoins(coinsData.balance);
      console.log('ProfileTab - 铜钱余额已更新:', coinsData.balance);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.error('ProfileTab - 获取用户信息失败:', errorMessage);
      Alert.alert('错误', `获取用户信息失败: ${errorMessage}`);
    }
  };

  // const handleCopyInviteCode = async () => {
  //   try {
  //     // 使用新的 Clipboard API
  //     Clipboard.setString(inviteInfo.code);
  //     Alert.alert('成功', '邀请码已复制到剪贴板');
  //   } catch (error) {
  //     console.error('复制邀请码失败:', error);
  //     Alert.alert('错误', '复制邀请码失败');
  //   }
  // };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      dispatch({ type: 'LOGOUT' });
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  const handleAvatarPick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('错误', '选择头像失败');
    }
  };

  const handleRecharge = async (amount: number) => {
    if (Platform.OS === 'ios') {
      // 这里添加 iOS IAP 支付逻辑
      Alert.alert('提示', '正在接入 iOS 支付...');
    } else {
      Alert.alert('提示', '暂时只支持 iOS 设备充值');
    }
    setIsRechargeVisible(false);
  };

  const handleUseInviteCode = async () => {
    if (!inviteCode) {
      Alert.alert('提示', '请输入邀请码');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.REFERRER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user?.token}`
        },
        body: JSON.stringify({ code: inviteCode })
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('成功', '邀请码使用成功');
        setInviteCode('');
      } else {
        Alert.alert('错误', '邀请码使用失败');
      }
    } catch (error) {
      console.error('使用邀请码失败:', error);
      Alert.alert('错误', '使用邀请码失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user?.token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const result = await response.json();
        dispatch({
          type: 'UPDATE_PROFILE',
          payload: {
            username: editForm.username,
            email: editForm.email
          }
        });
        Alert.alert('成功', '个人信息已更新');
        setIsEditVisible(false);
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      Alert.alert('错误', '更新个人信息失败');
    }
  };

  return (
    <View style={styles.container}>
      {/* 头部个人信息 - 使用动态渐变背景 */}
      <LinearGradient
        colors={[theme.backgroundColor || '#6a11cb', theme.tabBackground || '#2575fc']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleAvatarPick}>
            <Avatar
              size={90}
              rounded
              source={avatar ? { uri: avatar } : require('../assets/images/default-avatar.png')}
              containerStyle={styles.avatar}
            >
              <Avatar.Accessory size={26} />
            </Avatar>
          </TouchableOpacity>
          <Text h4 style={styles.username}>{state.user?.username || '未设置昵称'}</Text>
          <Text style={styles.email}>{state.user?.email || '未绑定邮箱'}</Text>
          
          {/* 添加铜钱显示在头部 */}
          <View style={styles.coinsContainer}>
            <Text style={styles.coinsText}>铜钱余额: {coins}</Text>
            <Button
              title="充值"
              type="outline"
              size="sm"
              buttonStyle={styles.rechargeButtonHeader}
              titleStyle={styles.rechargeButtonText}
              onPress={() => setIsRechargeVisible(true)}
            />
          </View>
        </View>
      </LinearGradient>

      {/* 账户信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>邀请信息</Text>
        <View style={styles.card}>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={styles.listItemTitle}>我的邀请码</ListItem.Title>
              <View style={styles.inviteCodeDisplay}>
                <Text style={styles.inviteCodeText}>{inviteInfo.code}</Text>
                <Button
                  title="复制"
                  type="clear"
                  size="sm"
                  titleStyle={{ color: '#2575fc' }}
                  icon={{
                    name: 'content-copy',
                    type: 'material',
                    size: 16,
                    color: '#2575fc'
                  }}
                  iconRight
                />
              </View>
            </ListItem.Content>
          </ListItem>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title style={styles.listItemTitle}>使用邀请码</ListItem.Title>
              <View style={styles.inviteCodeContainer}>
                <Input
                  placeholder="请输入好友邀请码"
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  containerStyle={styles.inviteCodeInput}
                  inputContainerStyle={styles.inviteInputContainer}
                  disabled={isSubmitting}
                />
                <Button
                  title={isSubmitting ? '提交中' : '使用'}
                  onPress={handleUseInviteCode}
                  disabled={isSubmitting || !inviteCode}
                  buttonStyle={styles.useInviteCodeButton}
                />
              </View>
            </ListItem.Content>
          </ListItem>
        </View>
      </View>

      {/* 功能列表 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设置</Text>
        <View style={styles.card}>
          <ListItem bottomDivider onPress={() => setIsEditVisible(true)}>
            <ListItem.Content>
              <View style={styles.listItemRow}>
                <Text style={styles.iconText}>👤</Text>
                <ListItem.Title style={styles.listItemTitle}>修改个人信息</ListItem.Title>
              </View>
            </ListItem.Content>
            <ListItem.Chevron color="#2575fc" />
          </ListItem>
        </View>
      </View>

      {/* 充值弹窗 */}
      <RechargeModal
        isVisible={isRechargeVisible}
        onClose={() => setIsRechargeVisible(false)}
        onSelect={handleRecharge}
      />

      {/* 编辑个人信息弹窗 */}
      <Overlay
        isVisible={isEditVisible}
        onBackdropPress={() => setIsEditVisible(false)}
        overlayStyle={styles.overlay}
      >
        <View style={styles.editForm}>
          <Text h4 style={styles.editTitle}>修改个人信息</Text>
          <Input
            label="昵称"
            value={editForm.username}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, username: text }))}
            placeholder="请输入昵称"
            labelStyle={styles.inputLabel}
          />
          <Input
            label="邮箱"
            value={editForm.email}
            onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
            placeholder="请输入邮箱"
            keyboardType="email-address"
            labelStyle={styles.inputLabel}
          />
          <Button
            title="保存"
            onPress={handleEditProfile}
            containerStyle={styles.saveButtonContainer}
            buttonStyle={styles.saveButton}
          />
        </View>
      </Overlay>

      {/* 退出登录按钮 */}
      <Button
        title="退出登录"
        onPress={handleLogout}
        buttonStyle={styles.logoutButton}
        titleStyle={styles.logoutButtonText}
        icon={{
          name: 'logout',
          type: 'material',
          size: 20,
          color: 'white'
        }}
        iconRight
      />
    </View>
  );
};

// 更新样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  headerGradient: {
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  username: {
    marginBottom: 6,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 12,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  coinsText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 12,
  },
  rechargeButtonHeader: {
    borderColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 16,
    height: 32,
  },
  rechargeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listItemTitle: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
  },
  inviteCodeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  inviteCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2575fc',
    marginRight: 10,
  },
  inviteCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  inviteCodeInput: {
    flex: 1,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  inviteInputContainer: {
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  useInviteCodeButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2575fc',
    borderRadius: 8,
  },
  overlay: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
  },
  editForm: {
    width: '100%',
  },
  editTitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  inputLabel: {
    color: '#555',
    fontSize: 14,
  },
  saveButtonContainer: {
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#2575fc',
    borderRadius: 10,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: '#ff4d4f',
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    marginRight: 10,
    color: '#2575fc',
  }
});

export default ProfileTab;