import React, { createContext, useReducer, useContext, ReactNode } from 'react';

type AuthState = {
  isAuthenticated: boolean;
  user: { username: string; email: string } | null;
};

type AuthAction =
  | { type: 'LOGIN'; payload: { username: string; email: string } }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({ state: initialState, dispatch: () => null });

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
