import React, { useState } from 'react';
import { StyleSheet, View, Alert, Image, Dimensions } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useAuth } from '../context/AuthContext.tsx'; 
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS } from '../config';  // 引入配置文件

const { width } = Dimensions.get('window'); // 获取屏幕宽度

const SignupScreen: React.FC = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { dispatch } = useAuth();
  const { navigate } = useNavigation(); 

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSignup = async () => {
    const { username, email, password } = form;

    // 输入字段检查
    if (!username || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      console.log('Signup error: All fields are required!');
      return;
    }

    try {
      console.log('Sending signup request:', { username, email, password });
      
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      console.log('Received response:', response);

      const result = await response.json();
      console.log('Parsed response:', result);

      if (response.ok) {
        // 如果注册成功，保存登录状态并跳转
        dispatch({ type: 'LOGIN', payload: { username, email } });
        Alert.alert('Success', `Welcome, ${result.username}`);
        console.log('Signup success:', result);
        navigate('Home');
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
      <Image
        source={{ uri: 'https://your-logo-url.com/logo.png' }} // 替换为实际的 logo 链接
        style={styles.logo}
      />
      <Text h3 style={styles.title}>
        Create Account
      </Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <Input
        placeholder="Username"
        value={form.username}
        onChangeText={(value) => handleInputChange('username', value)}
        leftIcon={{ type: 'font-awesome', name: 'user', color: '#888' }}
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />
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
        title="Sign Up"
        onPress={handleSignup}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
      />
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text style={styles.loginText} onPress={() => navigate('Login')}>
          Login
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
    backgroundColor: '#28a745',
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
});

export default SignupScreen;
