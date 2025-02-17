import React, { useState } from 'react';
import { StyleSheet, View, Alert, Image, Dimensions } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigation } from '@react-navigation/native'; // 导入 useNavigation 钩子
import { API_ENDPOINTS } from '../config';  // 引入配置文件

const { width } = Dimensions.get('window'); // 获取屏幕宽度

const LoginScreen: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigation = useNavigation(); // 获取导航
  const { dispatch } = useAuth();

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // 移除 username，只发送 email 和 password
      });

      const result = await response.json();

      if (response.ok) {
        // 从响应中获取 username
        const { username } = result;
        dispatch({ type: 'LOGIN', payload: { username, email } });
        Alert.alert('Success', `Welcome, ${username}`);
        
        // 登录成功后跳转到主页
        navigation.navigate('Home');  // 假设跳转到 'Home' 页面
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* 添加一个头部 Logo */}
      <Image
        source={{ uri: 'https://your-logo-url.com/logo.png' }} // 替换为实际的 logo 链接
        style={styles.logo}
      />
      <Text h3 style={styles.title}>
        Welcome Back
      </Text>
      <Text style={styles.subtitle}>Log in to your account</Text>

      <Input
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleInputChange('email', value)}
        leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#888' }}
        keyboardType="email-address"
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />
      <Input
        placeholder="Password"
        value={form.password}
        onChangeText={(value) => handleInputChange('password', value)}
        leftIcon={{ type: 'font-awesome', name: 'lock', color: '#888' }}
        secureTextEntry
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />
      
      <Button
        title="Login"
        onPress={handleLogin}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
      
      <Text style={styles.footerText}>
        Don't have an account?{' '}
        <Text
          style={styles.signUpText}
          onPress={() => navigation.navigate('Signup')} // 这里是跳转到 Signup 页面
        >
          Sign Up
        </Text>
      </Text>
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
    elevation: 1, // 添加阴影 (仅限 Android)
    shadowColor: '#000', // 添加阴影 (仅限 iOS)
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
  signUpText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
