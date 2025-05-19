import axios from "axios";
import { MaintenanceRequest } from "../models/MaintenanceRequest";
import { Booking } from "../models/Booking";
import { API_URL } from "../utils/constants";

const API_ENDPOINT = `${API_URL}/maintenance-requests`;
const BOOKING_API_ENDPOINT = `${API_URL}/bookings`;

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

export class BookingRepository {
  private static instance: BookingRepository;

  private constructor() {}

  public static getInstance(): BookingRepository {
    if (!BookingRepository.instance) {
      BookingRepository.instance = new BookingRepository();
    }
    return BookingRepository.instance;
  }

  async getAllBookings(): Promise<Booking[]> {
    const response = await axios.get(BOOKING_API_ENDPOINT);
    return response.data;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const response = await axios.get(`${BOOKING_API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }

  async createBooking(booking: Omit<Booking, "id">): Promise<Booking | null> {
    try {
      const response = await axios.post(BOOKING_API_ENDPOINT, booking);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      return null;
    }
  }

  async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | null> {
    try {
      const response = await axios.put(`${BOOKING_API_ENDPOINT}/${id}`, booking);
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      return null;
    }
  }

  async deleteBooking(id: string): Promise<boolean> {
    try {
      await axios.delete(`${BOOKING_API_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting booking:", error);
      return false;
    }
  }
}
