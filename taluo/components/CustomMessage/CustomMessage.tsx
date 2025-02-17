import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Message, MessageProps } from 'react-native-gifted-chat';
import { CustomMessage as CustomMessageType } from '../../interfaces/MessageInterfaces';
import styles from './CustomMessage.styles';

interface CustomMessageProps extends MessageProps<CustomMessageType> {
  onPress: (buttonText: string) => void;
}

const CustomMessage: React.FC<CustomMessageProps> = (props) => {
  const { currentMessage, onPress } = props;

  if (!currentMessage) return null;

  switch (currentMessage.type) {
    case 'button':
      // 确保 buttons 存在且非空
      if (!currentMessage.buttons?.length) return null;
      return (
        <View style={styles.buttonMessageContainer}>
          <Text>{currentMessage.text}</Text>
          <View style={styles.buttonContainer}>
            {currentMessage.buttons.map((button) => (
              <TouchableOpacity
                key={button.value} // 假设 button 有唯一标识符 value
                onPress={() => onPress(button.text)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    case 'image':
      if (!currentMessage.imageUri) return null;
      return (
        <View style={styles.imageMessageContainer}>
          <Image
            source={{ uri: currentMessage.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      );
    default:
      // 使用 Gifted Chat 默认组件渲染 text 和其他类型
      return <Message {...props} />;
  }
};

export default CustomMessage;