import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  isAuthenticated: boolean;
  user: {
    user_id: string;
    username: string;
    email: string;
    token: string;
    coins: number;  
  } | null;
  loading: boolean;
};

type AuthAction =
  | { type: 'LOGIN'; payload: { user_id: string; username: string; email: string; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_COINS'; payload: number }
  | { type: 'UPDATE_PROFILE'; payload: { username: string; email: string } };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({ state: initialState, dispatch: () => null });

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        username: action.payload.username,
        email: action.payload.email
      };
      // 更新 AsyncStorage 中的用户数据
      AsyncStorage.setItem('userData', JSON.stringify({
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        email: updatedUser.email
      }));
      return {
        ...state,
        user: updatedUser
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: { ...action.payload, coins: 0 },
        loading: false
      };
    case 'LOGOUT':
      return {
        ...initialState,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'UPDATE_COINS':
        return {
          ...state,
          user: state.user ? {
            ...state.user,
            coins: action.payload
          } : null
        };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 添加自动登录检查
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // 如果有token，恢复用户会话
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const user = JSON.parse(userData);
            dispatch({
              type: 'LOGIN',
              payload: {
                user_id: user.user_id,
                username: user.username,
                email: user.email || '',
                token
              }
            });
          }
        }
      } catch (error) {
        console.error('检查认证状态失败:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
