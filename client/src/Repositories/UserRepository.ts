import axios from "axios";
import User from "../models/User";
import { API_URL } from "../utils/constants";

const API_ENDPOINT = `${API_URL}/users`;

export default class UserRepository {
  private static instance: UserRepository;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async createUser(user: Omit<User, "id">): Promise<User | null> {
    try {
      const response = await axios.post(API_ENDPOINT, user);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    try {
      const response = await axios.put(`${API_ENDPOINT}/${id}`, user);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}
