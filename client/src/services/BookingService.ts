import axios from 'axios';
import { API_URL } from "../utils/constants";
import { Booking } from '../models/Booking';

class BookingService {
    private static instance: BookingService;
    private ENDPOINT = API_URL + 'bookings';

    constructor() {
        if (BookingService.instance) {
            return BookingService.instance;
        }
        BookingService.instance = this;
    }

    static getInstance() {
        if (!BookingService.instance) {
            BookingService.instance = new BookingService();
        }
        return BookingService.instance;
    }

    async getAll(): Promise<Booking[]> {
        try {
            const response = await axios.get<Booking[]>(this.ENDPOINT,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            throw error;
        }
    }

    async get(id: string): Promise<Booking> {
        try {
            const response = await axios.get<Booking>(`${this.ENDPOINT}/${id}`,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error(`Error fetching booking with ID ${id}:`, error);
            throw error;
        }
    }

    async create(booking: Omit<Booking, '_id'>): Promise<Booking> {
        try {
            const response = await axios.post<Booking>(this.ENDPOINT+"create", booking,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    }

    async update(id: string, booking: Partial<Booking>): Promise<Booking> {
        try {
            const response = await axios.put<Booking>(`${this.ENDPOINT}/${id}`, booking,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error(`Error updating booking with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${this.ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error deleting booking with ID ${id}:`, error);
            throw error;
        }
    }
}

export default BookingService.getInstance();