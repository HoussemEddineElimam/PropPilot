import axios from 'axios';
import { API_URL } from "../utils/constants";
import User from '../models/User';

class UserService {
    private static instance: UserService;
    private ENDPOINT = API_URL + 'users';

    constructor() {
        if (UserService.instance) {
            return UserService.instance;
        }
        UserService.instance = this;
    }

    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    //Get all users
    async getAll(): Promise<User[]> {
        try {
            const response = await axios.get<User[]>(this.ENDPOINT);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async get(id: string): Promise<User> {
        try {
            const response = await axios.get<User>(`${this.ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with ID ${id}:`, error);
            throw error;
        }
    }

    async create(user: Omit<User, 'id'>): Promise<User> {
        try {
            const response = await axios.post<User>(this.ENDPOINT, user);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update(
        id: string,
        user: Partial<User & { password: string; currentPassword: string; image?: File }>
      ): Promise<User> {
        try {
          const formData = new FormData();
          Object.entries(user).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, value instanceof File ? value : String(value));
            }
          });
          const response = await axios.put<User>(`${this.ENDPOINT}/${id}`, formData, {
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          });
      
          return response.data;
        } catch (error) {
          console.error(`Error updating user with ID ${id}:`, error);
          if (axios.isAxiosError(error)) {
            console.error('Server responded with:', error.response?.data);
          }
          throw error;
        }
      }
    async updateFormData(id: string, user: FormData): Promise<User> {
        try {
            
            const response = await axios.put<User>(`${this.ENDPOINT}/${id}`, user, {
                headers: { "Content-Type": "multipart/form-data",Authorization: `${localStorage.getItem('token')}` },
            });
    
            return response.data;
        } catch (error) {
            console.error(`Error updating user with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${this.ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error deleting user with ID ${id}:`, error);
            throw error;
        }
    }
}

export default UserService.getInstance();