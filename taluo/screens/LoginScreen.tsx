import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Input, Button, Text, Tab, TabView } from '@rneui/themed';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [phoneForm, setPhoneForm] = useState({ phone: '', verificationCode: '' });
  const [countdown, setCountdown] = useState(0);
  const navigation = useNavigation();
  const { dispatch, state } = useAuth();  // 在组件顶层获取 state

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailInputChange = (key: string, value: string) => {
    setEmailForm({ ...emailForm, [key]: value });
  };

  const handlePhoneInputChange = (key: string, value: string) => {
    setPhoneForm({ ...phoneForm, [key]: value });
  };

  const handleSendVerificationCode = async () => {
    if (!phoneForm.phone) {
      Alert.alert('错误', '请输入手机号');
      return;
    }

    console.log('开始发送验证码请求，手机号:', phoneForm.phone);

    try {
      const requestBody = { phone_number: phoneForm.phone };
      console.log('请求参数:', requestBody);
      console.log('请求地址:', API_ENDPOINTS.SEND_CODE);

      const response = await fetch(API_ENDPOINTS.SEND_CODE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('响应状态:', response.status, response.statusText);
      const result = await response.json();
      console.log('响应数据:', result);

      if (response.ok) {
        setCountdown(60);
        Alert.alert('成功', '验证码已发送');
        console.log('验证码发送成功');
      } else {
        console.error('验证码发送失败:', result);
        throw new Error(result.message || '发送验证码失败');
      }
    } catch (error: any) {
      console.error('发送验证码出错:', error);
      Alert.alert('错误', error.message);
    }
  };

  const handlePhoneLogin = async () => {
    try {
      if (!phoneForm.phone || !phoneForm.verificationCode) {
        Alert.alert('提示', '请填写所有字段');
        return;
      }

      console.log('开始手机号登录请求，参数:', {
        phone_number: phoneForm.phone,
        code: phoneForm.verificationCode
      });
      
      const response = await fetch(API_ENDPOINTS.PHONE_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneForm.phone,
          code: phoneForm.verificationCode
        }),
      });

      console.log('手机号登录响应状态:', response.status, response.statusText);
      const result = await response.json();
      console.log('手机号登录响应数据:', result);

      if (response.ok) {
        const { message, token, user_id, username } = result;
        console.log('邮箱登录成功，完整响应数据:', result);
        console.log('准备处理的用户信息:', { user_id, token, message });

        dispatch({ 
          type: 'LOGIN', 
          payload: { 
            user_id, 
            username,
            email: '', // 手机登录时email为空
            token 
          }
        });
        console.log('已更新登录状态');

        Alert.alert('成功', `欢迎回来，${username}`);
        navigation.navigate('Home' as never);
      } else {
        console.error('手机号登录失败:', result);
        throw new Error(result.message || '登录失败');
      }
    } catch (error: any) {
      console.error('手机号登录出错:', error);
      Alert.alert('错误', error.message);
    }
  };

  const handleEmailLogin = async () => {
    try {
      if (!emailForm.email || !emailForm.password) {
        Alert.alert('错误', '请填写所有字段');
        return;
      }

      console.log('开始邮箱登录请求，参数:', {
        email: emailForm.email,
        password: '***'
      });

      const response = await fetch(API_ENDPOINTS.EMAIL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      });

      console.log('邮箱登录响应状态:', response.status, response.statusText);
      const result = await response.json();
      console.log('邮箱登录响应数据:', result);

      if (response.ok) {
        const { message, token, user_id, username} = result;
        console.log('邮箱登录成功，完整响应数据:', result);

        try {
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userData', JSON.stringify({
            user_id,
            username,
            email: ''
          }));
          console.log('用户数据保存成功');
        } catch (storageError) {
          console.error('保存数据失败:', storageError);
        }

        const loginPayload = { 
          user_id,
          username,
          email: '',
          token 
        };
        
        dispatch({ 
          type: 'LOGIN', 
          payload: loginPayload
        });
        console.log('dispatch执行完成');

        Alert.alert('成功', `欢迎回来，${user_id}`);
        navigation.navigate('Home' as never);
      } else {
        console.error('邮箱登录失败:', result);
        throw new Error(result.message || '登录失败');
      }
    } catch (error: any) {
      console.error('邮箱登录出错:', error);
      Alert.alert('错误', error.message);
    }
  };

  const handleLogin = () => {
    if (index === 0) {
      handlePhoneLogin();
    } else {
      handleEmailLogin();
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>欢迎回来</Text>
      <Text style={styles.subtitle}>登录你的账号</Text>

      <View style={styles.formContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, index === 0 && styles.activeTabButton]}
            onPress={() => setIndex(0)}
          >
            <Text style={[styles.tabButtonText, index === 0 && styles.activeTabButtonText]}>手机号登录</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, index === 1 && styles.activeTabButton]}
            onPress={() => setIndex(1)}
          >
            <Text style={[styles.tabButtonText, index === 1 && styles.activeTabButtonText]}>邮箱登录</Text>
          </TouchableOpacity>
        </View>

        {index === 0 ? (
          <View>
            <Input
              placeholder="请输入手机号"
              value={phoneForm.phone}
              onChangeText={(value) => handlePhoneInputChange('phone', value)}
              leftIcon={{
                type: 'font-awesome',
                name: 'phone',
                color: '#007BFF',
                size: 20,
              }}
              keyboardType="phone-pad"
              containerStyle={[styles.inputContainer, { marginBottom: 10 }]}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputInnerContainer}
            />
            <View style={styles.verificationCodeContainer}>
              <Input
                placeholder="请输入验证码"
                value={phoneForm.verificationCode}
                onChangeText={(value) => handlePhoneInputChange('verificationCode', value)}
                leftIcon={{
                  type: 'font-awesome',
                  name: 'key',
                  color: '#007BFF',
                  size: 18,
                }}
                containerStyle={[styles.inputContainer, styles.verificationInput]}
                inputStyle={styles.inputText}
                inputContainerStyle={styles.inputInnerContainer}
              />
              <Button
                title={countdown > 0 ? `${countdown}s` : "发送验证码"}
                onPress={handleSendVerificationCode}
                disabled={countdown > 0}
                buttonStyle={[styles.sendCodeButton, countdown > 0 && styles.sendCodeButtonDisabled]}
                titleStyle={styles.sendCodeButtonText}
              />
            </View>
          </View>
        ) : (
          <View>
            <Input
              placeholder="请输入邮箱地址"
              value={emailForm.email}
              onChangeText={(value) => handleEmailInputChange('email', value)}
              leftIcon={{
                type: 'font-awesome',
                name: 'envelope',
                color: '#007BFF',
                size: 18,
              }}
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputInnerContainer}
            />
            <Input
              placeholder="请输入密码"
              value={emailForm.password}
              onChangeText={(value) => handleEmailInputChange('password', value)}
              leftIcon={{
                type: 'font-awesome',
                name: 'lock',
                color: '#007BFF',
                size: 20,
              }}
              secureTextEntry
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputInnerContainer}
            />
          </View>
        )}

        <Button
          title="登录"
          onPress={handleLogin}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
        
        <Text style={styles.footerText}>
          还没有账号？{' '}
          <Text
            style={styles.signUpText}
            onPress={() => navigation.navigate('Signup' as never)}
          >
            注册
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 5,
    marginBottom: 20,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8
  },
  activeTabButton: {
    backgroundColor: '#007BFF20'
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666'
  },
  activeTabButtonText: {
    color: '#007BFF',
    fontWeight: 'bold'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputInnerContainer: {
    borderBottomWidth: 0,
    paddingHorizontal: 5
  },
  inputText: {
    fontSize: 16,
  },
  verificationCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5
  },
  verificationInput: {
    flex: 1,
    marginRight: 10
  },
  sendCodeButton: {
    width: 120,
    height: 45,
    backgroundColor: '#007BFF',
    borderRadius: 8
  },
  sendCodeButtonDisabled: {
    backgroundColor: '#E9ECEF'
  },
  sendCodeButtonText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#007BFF',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  signUpText: {
    color: '#007BFF',
    fontWeight: 'bold',
  }
});

export default LoginScreen;
