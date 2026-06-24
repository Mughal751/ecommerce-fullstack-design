import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from './api';
import API from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shopzone_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const saveUser = (data) => {
    setUser(data);
    localStorage.setItem('shopzone_user', JSON.stringify(data));
  };

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    saveUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    saveUser(data);
    return data;
  };

  // Google login — called after Google returns user info
  const googleLogin = async (googleUser) => {
    const { data } = await API.post('/auth/google', {
      name:     googleUser.name,
      email:    googleUser.email,
      googleId: googleUser.sub,        // Google's unique user ID
      avatar:   googleUser.picture,
    });
    saveUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopzone_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
