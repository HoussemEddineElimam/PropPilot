import axios from "axios";
import { MaintenanceRequest } from "../models/MaintenanceRequest";
import { API_URL } from "../utils/constants";

const API_ENDPOINT = `${API_URL}/maintenance-requests`;

export default class MaintenanceRequestRepository {
  private static instance: MaintenanceRequestRepository;

  private constructor() {}

  public static getInstance(): MaintenanceRequestRepository {
    if (!MaintenanceRequestRepository.instance) {
      MaintenanceRequestRepository.instance = new MaintenanceRequestRepository();
    }
    return MaintenanceRequestRepository.instance;
  }

  async getAllRequests(): Promise<MaintenanceRequest[]> {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }

  async getRequestById(id: string): Promise<MaintenanceRequest | null> {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching maintenance request:", error);
      return null;
    }
  }

  async createRequest(request: Omit<MaintenanceRequest, "id">): Promise<MaintenanceRequest | null> {
    try {
      const response = await axios.post(API_ENDPOINT, request);
      return response.data;
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      return null;
    }
  }

  async updateRequest(id: string, request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | null> {
    try {
      const response = await axios.put(`${API_ENDPOINT}/${id}`, request);
      return response.data;
    } catch (error) {
      console.error("Error updating maintenance request:", error);
      return null;
    }
  }

  async deleteRequest(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting maintenance request:", error);
      return false;
    }
  }
}
