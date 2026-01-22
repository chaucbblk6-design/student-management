import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants'; // Đảm bảo đã có link Render ở đây

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username: string, password: string) => {
    try {
      // Gọi API đến Render
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password
      });

      if (response.data.token) {
        // Lưu token vào máy để lần sau không phải đăng nhập lại
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);