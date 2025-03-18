import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Input, Button, Text, CheckBox } from '@rneui/themed';
import { useAuth } from '../context/AuthContext.tsx'; 
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS } from '../config';  // 引入配置文件
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window'); // 获取屏幕宽度

const SignupScreen: React.FC = () => {
  const [phoneForm, setPhoneForm] = useState({ phone: '', verificationCode: '' });
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const { dispatch } = useAuth();
  const { navigate } = useNavigation(); 

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePhoneInputChange = (key: string, value: string) => {
    setPhoneForm({ ...phoneForm, [key]: value });
  };

  const handleSendVerificationCode = async () => {
    if (!phoneForm.phone) {
      Alert.alert('提示', '请输入手机号');
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
        // setCountdown(60);
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

  const handleSignup = async () => {
    if (!phoneForm.phone || !phoneForm.verificationCode) {
      Alert.alert('提示', '请填写所有字段');
      return;
    }

    if (!agreed) {
      Alert.alert('提示', '请阅读并同意用户协议和隐私政策');
      return;
    }

    try {
      // #console.log('Sending signup request:', { username, email, password });
      
      const response = await fetch(API_ENDPOINTS.PHONE_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneForm.phone,
          code: phoneForm.verificationCode
        }),
      });


      const result = await response.json();
      console.log('Parsed response:', result);

      if (response.ok) {
        const { message, token, user_id, username } = result;
        console.log('邮箱登录成功，完整响应数据:', result);
        console.log('准备处理的用户信息:', { user_id, token, message });

        if (!token) {
          console.error('注册响应中缺少token');
          throw new Error('注册失败：无效的认证信息');
        }

        try {
          await AsyncStorage.setItem('userToken', token);


          console.log('Token已保存到AsyncStorage');

          dispatch({ 
            type: 'LOGIN', 
            payload: { 
              user_id: result.user_id,
              username, 
              email:"",
              token
            }
          });
          console.log('已更新登录状态');

          Alert.alert('成功', `欢迎加入，${username}`);
          navigate('Home' as never);
        } catch (storageError) {
          console.error('保存Token时出错:', storageError);
          throw new Error('注册失败：无法保存认证信息');
        }
      } else {
        throw new Error(result.message || 'Signup failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      console.error('Signup error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 添加一个头部 Logo */}
      <Text h3 style={styles.title}>创建账号</Text>
      <Text style={styles.subtitle}>欢迎加入我们</Text>

      <View style={styles.formContainer}>
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

        <CheckBox
          title={<Text style={styles.agreementText}>
            我已阅读并同意
            <Text style={styles.linkText} onPress={() => Alert.alert('用户协议')}>《用户协议》</Text>
            和
            <Text style={styles.linkText} onPress={() => Alert.alert('隐私政策')}>《隐私政策》</Text>
          </Text>}
          checked={agreed}
          onPress={() => setAgreed(!agreed)}
          containerStyle={styles.checkboxContainer}
          checkedColor="#007BFF"
        />

        <Button
          title="注册"
          onPress={handleSignup}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
        <Text style={styles.footerText}>
          已有账号？{' '}
          <Text style={styles.loginText} onPress={() => navigate('Login' as never)}>
            登录
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
    resizeMode: 'contain',
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
  inputText: {
    fontSize: 16,
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
  loginText: {
    color: '#007BFF',
    fontWeight: 'bold',
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
  inputInnerContainer: {
    borderBottomWidth: 0,
    paddingHorizontal: 5
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 20
  },
  agreementText: {
    fontSize: 14,
    color: '#666'
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline'
  }
});

export default SignupScreen;
