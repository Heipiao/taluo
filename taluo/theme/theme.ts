// theme.ts
export interface Theme {
  id: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  headerBackground: string;
  buttonBackground: string;
  buttonText: string;
  avatarBorderColor: string;
  backgroundColor: string;
  backgroundGradient?: string;  // 添加渐变背景属性
  tabBackground: string;  // 添加标签背景色属性
  activeTintColor: string;  // 底部导航栏激活状态颜色
  inactiveTintColor: string;  // 底部导航栏未激活状态颜色
  chatBackgroundColor: string;  // 聊天框背景色
}

export const guanyinTheme: Theme = {
  id: 'guanyin',
  primary: '#B48850',      // 观音主题色
  secondary: '#E1BEE7',
  background: '#F3E5F5',
  text: '#4A148C',
  headerBackground: '#CE93D8',
  buttonBackground: '#B48850',
  buttonText: '#FFFFFF', 
  avatarBorderColor: '#B48850',
  backgroundColor: '#B48850',
  backgroundGradient: 'linear-gradient(0.29deg, #B48850 71.5%, rgba(180, 136, 80, 0) 99.09%)',
  tabBackground: '#704C1E',
  activeTintColor: '#FFFFFF',
  inactiveTintColor: '#666666',
  chatBackgroundColor: '#F9ECDB'
};

export const caishenTheme: Theme = {
  id: 'caishen',
  primary: '#9A4B32',      // 财神主题色
  secondary: '#FFE0B2',
  background: '#FFF3E0',
  text: '#E65100',
  headerBackground: '#FFB74D',
  buttonBackground: '#9A4B32',
  buttonText: '#FFFFFF',
  avatarBorderColor: '#9A4B32',
  backgroundColor: '#184147',
  backgroundGradient: 'linear-gradient(0.29deg, #9A4B32 71.5%, rgba(180, 136, 80, 0) 99.09%)',
  tabBackground: '#3C676D',
  activeTintColor: '#FFFFFF',
  inactiveTintColor: '#666666',
  chatBackgroundColor: '#E2ECEE'
};

export const yuelaoTheme: Theme = {
  id: 'yuelao',
  primary: '#994B32',      // 月老主题色
  secondary: '#F8BBD0',
  background: '#FCE4EC',
  text: '#880E4F',
  headerBackground: '#F48FB1',
  buttonBackground: '#994B32',
  buttonText: '#FFFFFF',
  avatarBorderColor: '#994B32',
  backgroundColor: '#994B32',
  backgroundGradient: 'linear-gradient(0.29deg, #994B32 71.5%, rgba(180, 136, 80, 0) 99.09%)',
  tabBackground: '#70311E',
  activeTintColor: '#FFFFFF',
  inactiveTintColor: '#666666',
  chatBackgroundColor: '#F9E0DB'
};