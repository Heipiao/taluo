// src/interfaces/MessageInterfaces.ts

import { IMessage } from 'react-native-gifted-chat';

export interface User {
  _id: number;
  name: string;
  avatar?: string;
}

export interface CustomMessage extends IMessage {
  // 强制要求自定义消息必须有 type 属性，如果某些消息不需要 type，则可以改为可选属性
  type?: 'text' | 'button' | 'image';
  // 对于按钮消息，buttons 为可选属性
  buttons?: { text: string }[];
  // 对于图片消息，imageUri 为可选属性
  imageUri?: string;
}
