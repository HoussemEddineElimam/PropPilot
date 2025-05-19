import { create } from "zustand";
import axios from "axios";
import User from "../models/User";
import { API_URL } from "../utils/constants";
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  googleLogin: (googleToken: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string, role: string) => Promise<boolean>;
  LogOut: () => void;
  refresh: () => Promise<void>;
  setTOwner: () => Promise<void>;
  googleRegister: (googleToken: string, role: string) => Promise<boolean>
} 

const useAuthStore = create<AuthState>((set) => ({
  user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")!) :null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  login: async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}login`, { email, password });
      const { token }: { token: string } = res.data;
      const user:User = {_id:res.data.user._id, fullName:res.data.user.fullName,email:res.data.user.email,isVerified:res.data.user.isVerified,role:res.data.user.role,avatar:res.data.user.avatar};
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
      return true;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message);
      return false;
    }
  },
  setTOwner:async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!token || !userData) {
        console.warn('Token or user data is missing in localStorage');
        return; // Exit silently if not available
      }
      const user = JSON.parse(userData);
     
  
      const myUser: User = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        role: "owner",
        avatar: user.avatar,
      };
  
      set({ user: myUser});
      localStorage.setItem('user', JSON.stringify(myUser));
    }
    catch (error) {
      console.error('Error setting owner:', error);
    }
  },
  
  refresh: async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!token || !userData) {
        console.warn('Token or user data is missing in localStorage');
        return; // Exit silently if not available
      }
  
      const userId = JSON.parse(userData)?.id || JSON.parse(userData)?._id;
      if (!userId) {
        console.warn('User ID missing in parsed user data');
        return;
      }
  
      const { data } = await axios.post(
        `${API_URL}refresh`,
        { userId },
        { headers: { Authorization: token } }
      );
  
      const { user, token: newToken } = data;
  
      const myUser: User = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
        avatar: user.avatar,
      };
  
      set({ user: myUser, token: newToken, isAuthenticated: !!newToken });
      localStorage.setItem('user', JSON.stringify(myUser));
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }
  
,  
  googleLogin: async (googleToken) => {
    try {
      const res = await axios.post(`${API_URL}google-login`, { token: googleToken });
      const { token}: { token: string } = res.data;
      const user:User = {_id:res.data.user._id, fullName:res.data.user.fullName,email:res.data.user.email,isVerified:res.data.user.isVerified,role:res.data.user.role,avatar:res.data.user.avatar};
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
      return true;
    } catch (error: any) {
      console.error("Google login failed:", error.response?.data?.message);
      return false;
    }
  },
  googleRegister: async (googleToken:string, role:string) => {
    try {
      const res = await axios.post(`${API_URL}google-register`, { token: googleToken, role });
      const { token }: { token: string} = res.data;
      const user:User = {_id:res.data.user._id, fullName:res.data.fullName,email:res.data.user.email,isVerified:res.data.user.isVerified,role:res.data.user.role};
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
      return true;
    } catch (error: any) {
      console.error("Google registration failed:", error.response?.data?.message);
      return false;
    }
  },

  register: async (fullName, email, password, role) => {
    try {
      await axios.post(`${API_URL}register`, {fullName, email, password, role });
      return true;
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data?.message);
      return false;
    }
  },
  LogOut: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;