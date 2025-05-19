import axios from "axios";
import { Property } from "../models/Property";
import { API_URL } from "../utils/constants";

const API_ENDPOINT = `${API_URL}/properties`;

export default class PropertyRepository {
  private static instance: PropertyRepository;

  private constructor() {}

  public static getInstance(): PropertyRepository {
    if (!PropertyRepository.instance) {
      PropertyRepository.instance = new PropertyRepository();
    }
    return PropertyRepository.instance;
  }

  async getAllProperties(): Promise<Property[]> {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching property:", error);
      return null;
    }
  }

  async createProperty(property: Omit<Property, "id">): Promise<Property | null> {
    try {
      const response = await axios.post(API_ENDPOINT, property);
      return response.data;
    } catch (error) {
      console.error("Error creating property:", error);
      return null;
    }
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property | null> {
    try {
      const response = await axios.put(`${API_ENDPOINT}/${id}`, property);
      return response.data;
    } catch (error) {
      console.error("Error updating property:", error);
      return null;
    }
  }

  async deleteProperty(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      return false;
    }
  }
}
