import axios from 'axios';
import { API_URL } from "../utils/constants";
import { Review } from '../models/Review';

class ReviewService {
    private static instance: ReviewService;
    private ENDPOINT = API_URL + 'reviews';

    constructor() {
        if (ReviewService.instance) {
            return ReviewService.instance;
        }
        ReviewService.instance = this;
    }

    static getInstance() {
        if (!ReviewService.instance) {
            ReviewService.instance = new ReviewService();
        }
        return ReviewService.instance;
    }

    async getAll(): Promise<Review[]> {
        try {
            const response = await axios.get<Review[]>(this.ENDPOINT);
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    }

    async get(id: string): Promise<Review> {
        try {
            const response = await axios.get<Review>(`${this.ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching review with ID ${id}:`, error);
            throw error;
        }
    }
    
    async getByPropertyId(propertyId: string): Promise<Review[]> {
        try {
            const response = await axios.get<Review[]>(`${this.ENDPOINT}/property/${propertyId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reviews for property ID ${propertyId}:`, error);
            throw error;
        }
    }
    async create(review: Omit<Review, 'id'>): Promise<Review> {
        try {
            const response = await axios.post<Review>(this.ENDPOINT, review);
            return response.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }

    async update(id: string, review: Partial<Review>): Promise<Review> {
        try {
            const response = await axios.put<Review>(`${this.ENDPOINT}/${id}`, review);
            return response.data;
        } catch (error) {
            console.error(`Error updating review with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${this.ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error deleting review with ID ${id}:`, error);
            throw error;
        }
    }
}

export default ReviewService.getInstance();