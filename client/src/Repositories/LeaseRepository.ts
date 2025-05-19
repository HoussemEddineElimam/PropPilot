import axios from "axios";
import { Lease } from "../models/Lease";
import { API_URL } from "../utils/constants";

const API_ENDPOINT = `${API_URL}/leases`; 

export default class LeaseRepository {
  private static instance: LeaseRepository;

  private constructor() {}

  public static getInstance(): LeaseRepository {
    if (!LeaseRepository.instance) {
      LeaseRepository.instance = new LeaseRepository();
    }
    return LeaseRepository.instance;
  }

  async getAllLeases(): Promise<Lease[]> {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }

  async getLeaseById(id: string): Promise<Lease | null> {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching lease:", error);
      return null;
    }
  }

  async createLease(lease: Omit<Lease, "id">): Promise<Lease | null> {
    try {
      const response = await axios.post(API_ENDPOINT, lease);
      return response.data;
    } catch (error) {
      console.error("Error creating lease:", error);
      return null;
    }
  }

  async updateLease(id: string, lease: Partial<Lease>): Promise<Lease | null> {
    try {
      const response = await axios.put(`${API_ENDPOINT}/${id}`, lease);
      return response.data;
    } catch (error) {
      console.error("Error updating lease:", error);
      return null;
    }
  }

  async deleteLease(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting lease:", error);
      return false;
    }
  }
}

