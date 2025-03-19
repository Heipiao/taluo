import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import CustomMessageComponent  from '../components/CustomMessage/CustomMessage';
import { CustomMessage as CustomMessageType } from '../interfaces/MessageInterfaces';

import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; // 添加这行导入
import { API_ENDPOINTS } from '../config';

import { Deity } from '../models/Deity';
const carouselItems = Deity.getAllDeities().map(deity => ({
  id: deity.id,
  image: deity.imagePath
}));

const FortuneTab: React.FC = () => {
  const route = useRoute();
  const fortuneId = (route.params as { fortuneId?: string })?.fortuneId;  // 获取传递的 fortuneId
  const { state } = useAuth();
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  // 可以根据 fortuneId 来处理不同类型的占卜
  useEffect(() => {
    console.log('当前占卜类型 ID:', fortuneId);
    
    // 如果有占卜类型ID，发送初始消息
    if (fortuneId && state.isAuthenticated && state.user) {
      // 清空当前消息列表
      setMessages([]);
      
      // 根据 fortuneId 获取对应的占卜类型
      const fortuneTypeMap = {
        '1': '今日运势',
        '2': '事业运',
        '3': '感情运',
        '4': '财运'
      };
      
      const fortuneType = fortuneTypeMap[fortuneId] || '占卜';
      
      // 创建一个临时消息变量，而不是直接修改状态
      const initialMessage = `我想了解我的${fortuneType}`;
      
      // 直接创建用户消息并添加到消息列表
      const userMessage: CustomMessageType = {
        _id: Date.now(),
        text: initialMessage,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'User'
        }
      };
      
      // 设置消息并开始处理
      setMessages([userMessage]);
      setTyping(true);
      setStreaming(true);
      
      // 构建历史消息数组
      const historyMessages = [{
        role: "user",
        content: initialMessage
      }];
      
      // 构建请求参数
      const requestBody = {
        user_id: state.user.user_id || "anonymous",
        role: theme?.id ? Deity.getDeityById(theme.id)?.name : "财神",
        task: theme?.id ? `${Deity.getDeityById(theme.id)?.tags[0].name}分析` : "财运分析",
        messages: historyMessages
      };
      
      // 打印请求参数
      console.log('发送初始请求参数:', JSON.stringify(requestBody, null, 2));
      
      // 调用API获取回复
      fetch(API_ENDPOINTS.CHAT_QUESTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user.token}`
        },
        body: JSON.stringify(requestBody),
      })
      .then(response => response.json())
      .then(result => {
        console.log('API初始响应:', result);
        
        if (result.success && result.data?.question?.answer) {
          const botMessage: CustomMessageType = {
            _id: Date.now() + 1,
            text: result.data.question.answer,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: theme?.id ? Deity.getDeityById(theme.id)?.name : "财神",
              avatar: theme?.id ? Deity.getDeityById(theme.id)?.imagePath : require('../assets/images/caishen.jpg')
            }
          };
          
          setMessages(prevMessages => GiftedChat.append(prevMessages, [botMessage]));
        } else {
          throw new Error('获取回复失败');
        }
      })
      .catch(error => {
        console.error('初始消息发送失败:', error);
        // 显示错误消息
        const errorMessage: CustomMessageType = {
          _id: Date.now() + 1,
          text: '抱歉，我暂时无法回应，请稍后再试。',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: theme?.id ? Deity.getDeityById(theme.id)?.name : "财神",
            avatar: theme?.id ? Deity.getDeityById(theme.id)?.imagePath : require('../assets/images/caishen.jpg')
          }
        };
        setMessages(prevMessages => GiftedChat.append(prevMessages, [errorMessage]));
      })
      .finally(() => {
        setTyping(false);
        setStreaming(false);
      });
    }
  }, [fortuneId, state.isAuthenticated, state.user, theme]);
  

  
  // 添加消息相关的状态
  const [messages, setMessages] = useState<CustomMessageType[]>([]);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState(false);
  
  useEffect(() => {
    console.log('FortuneTab - 认证状态变化:', {
      isAuthenticated: state?.isAuthenticated,
      loading: state?.loading,
      user: state?.user
    });

    if (!state.isAuthenticated && !state.loading) {
      navigation.navigate('Login' as never);
    }
  }, [state]);

 

  // 处理按钮点击
  const handleButtonPress = async (option: string) => {
    try {
      setTyping(true);
      // 这里可以根据选项处理不同的逻辑
      console.log('选择了选项:', option);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTyping(false);
    } catch (error) {
      console.error('处理选项出错:', error);
      setTyping(false);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!message.trim() || streaming) return;

    try {
      // 先清空输入框内容，再收起键盘
      setMessage('');
      
      // 使用setTimeout确保在UI更新后再收起键盘
      setTimeout(() => {
        console.log('延迟收起键盘...');
        Keyboard.dismiss();
      }, 100);
      
      setStreaming(true);
      // 创建用户消息
      const userMessage: CustomMessageType = {
        _id: Date.now(),
        text: message,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'User'
        }
      };

      // 添加用户消息到消息列表
      setMessages(prevMessages => GiftedChat.append(prevMessages, [userMessage]));
      setTyping(true);

      // 构建历史消息数组
      const historyMessages = messages.map(msg => ({
        role: msg.user._id === 1 ? "user" : "assistant", 
        content: msg.text
      }));
      
      // 添加当前用户消息
      historyMessages.push({
        role: "user",
        content: message
      });

      // 构建请求参数
      const requestBody = {
        user_id: state.user?.user_id || "anonymous",
        role: theme?.id ? Deity.getDeityById(theme.id)?.name : "财神",
        task: theme?.id ? `${Deity.getDeityById(theme.id)?.tags[0].name}分析` : "财运分析",
        messages: historyMessages
      };
      
      // 打印请求参数
      console.log('发送请求参数:', JSON.stringify(requestBody, null, 2));

      // 调用API获取回复
      const response = await fetch(API_ENDPOINTS.CHAT_QUESTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user?.token}`
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('API响应:', result);

      if (result.success && result.data?.question?.answer) {
        const botMessage: CustomMessageType = {
          _id: Date.now() + 1,
          text: result.data.question.answer,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: theme?.id ? Deity.getDeityById(theme.id)?.name : "财神",
            avatar: theme?.id ? Deity.getDeityById(theme.id)?.imagePath : require('../assets/images/caishen.jpg')
          }
        };

        setMessages(prevMessages => GiftedChat.append(prevMessages, [botMessage]));
      } else {
        throw new Error('获取回复失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      // 显示错误消息
      const errorMessage: CustomMessageType = {
        _id: Date.now() + 1,
        text: '抱歉，我暂时无法回应，请稍后再试。',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: theme?.id ? Deity.getDeityById(theme.id)?.name : "财神",
          avatar: theme?.id ? Deity.getDeityById(theme.id)?.imagePath : require('../assets/images/caishen.jpg')
        }
      };
      setMessages(prevMessages => GiftedChat.append(prevMessages, [errorMessage]));
    } finally {
      setTyping(false);
      setStreaming(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Image 
          source={theme?.id ? Deity.getDeityById(theme.id)?.imagePath : require('../assets/images/caishen.jpg')}
          style={styles.avatar}
        />
        <Text style={styles.title}>
          {theme?.id 
            ? Deity.getDeityById(theme.id)?.name 
            : '财神'}
        </Text>
        <Text style={styles.description}>
          {theme?.id 
            ? Deity.getDeityById(theme.id)?.description 
            : '吾乃财神，掌管天下财运。汝若欲求金银财宝，事业如意，望通当为尔指路，保汝富贵安康，财源滚滚来。'}
        </Text>
      </View>
      {typing && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>{theme?.id ? `${Deity.getDeityById(theme.id)?.name}正在输入...` : '财神正在输入...'}</Text>
        </View>
      )}
      <View style={[styles.chatContainer]}>
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => setMessages((prevMessages) => GiftedChat.append(newMessages, prevMessages))}
          user={{ _id: 1, name: 'User'  }}
          isTyping={typing}
          renderInputToolbar={() => null}
          renderMessage={(props) => <CustomMessageComponent {...props} onPress={handleButtonPress} />}
          inverted={true}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: theme?.chatBackgroundColor || '#007bff',
                  },
                  left: {
                    backgroundColor: '#FFFFFF'
                  }
                }}
                textStyle={{
                  right: {
                    color: '#000000'
                  },
                  left: {
                    color: '#000000'
                  }
                }}
              />
            );
          }}
          renderTime={(props) => {
            return (
              <Time
                {...props}
                timeTextStyle={{
                  left: {
                    color: '#000000', // 接收方时间文本颜色
                  },
                  right: {
                    color: '#000000', // 发送方时间文本颜色
                  },
                }}
              />
            );
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="请输入消息..."
          style={styles.textInput}
        />
        <TouchableOpacity 
          onPress={sendMessage} 
          style={[styles.sendButton, { 
            backgroundColor: theme?.backgroundColor || '#007bff',
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center'
          }]} 
          disabled={streaming}
        >
          <Text style={[styles.sendButtonText, { 
            color: '#FFFFFF',
            fontSize: 24,
            transform: [{ rotate: '-90deg' }]
          }]}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  typingContainer: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
  },
  typingText: {
    color: '#888',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    width: 689,
    height: 50,
    padding: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    flexShrink: 0
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FortuneTab;
