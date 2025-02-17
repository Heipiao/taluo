import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import CustomMessageComponent  from '../components/CustomMessage/CustomMessage';
import { CustomMessage as CustomMessageType } from '../interfaces/MessageInterfaces';

const FortuneTab: React.FC = () => {
  const [messages, setMessages] = useState<CustomMessageType[]>([]);
  const [message, setMessage] = useState<string>('');
  const [streaming, setStreaming] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);

  const sendMessage = async () => {
    if (message.trim() && !streaming) {

      if (message.trim() && !streaming) {
        const userMessage: CustomMessageType = {
          _id: Math.random(),
          type: 'text',
          text: message,
          createdAt: new Date(),
          user: { _id: 1, name: 'User' },
        };
  
        setMessages((prevMessages) => [userMessage, ...prevMessages]);
        setMessage('');
        setStreaming(true);
        setTyping(true);

      const requestMessages = [
        {
          role: 'system',
          content: '你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议。',
        },
        {
          role: 'user',
          content: userMessage.text,
        },
      ];

      const url = 'https://api.aigcteacher.top/biz/chat/completions';
      const header = {
        'Content-Type': 'application/json',
      };
      const data = JSON.stringify({ messages: requestMessages });

      if (userMessage.text === 'Button')
        {
        const buttonMessage: CustomMessageType = {
            _id: Math.random(),
            type: 'button',
            text: '',
            buttons: [{text:'red'},{text:'yellow'}],
            createdAt: new Date(),
            user: { _id: 2, name: 'Bot' },
        };
        setMessages((prevMessages) => [buttonMessage, ...prevMessages]);
        setStreaming(false);
        setTyping(false);
    }
    else{
        try {
            const response = await fetch(url, {
              method: 'POST',
              headers: header,
              body: data,
            });
    
            const responseData = await response.json();
            const botReply = responseData.response;
    
            const botReplyMessage: CustomMessageType = {
                _id: Math.random(),
                type: 'text',
                text: botReply,
                createdAt: new Date(),
                user: { _id: 2, name: 'Bot' },
            };
    
            setMessages((prevMessages) => [botReplyMessage, ...prevMessages]);
            setStreaming(false);
            setTyping(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setStreaming(false);
            setTyping(false);
          }
    }
    }
  };
};

  const handleButtonPress = (buttonText: string) => {
    setMessage(buttonText);
  };

  return (
    <View style={styles.container}>
      {typing && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>机器人正在输入...</Text>
        </View>
      )}
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages))}
        user={{ _id: 1, name: 'User' }}
        isTyping={typing}
        renderInputToolbar={() => null}
        renderMessage={(props) => <CustomMessageComponent {...props} onPress={handleButtonPress} />}
        inverted={true}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="请输入消息..."
          style={styles.textInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={streaming}>
          <Text style={styles.sendButtonText}>{streaming ? '处理中...' : '发送'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
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
