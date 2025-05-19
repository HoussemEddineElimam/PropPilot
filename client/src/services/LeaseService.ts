import axios from 'axios';
import { API_URL } from "../utils/constants";
import { Lease } from '../models/Lease';

class LeaseService {
    private static instance: LeaseService;
    private ENDPOINT = API_URL + 'leases';

    constructor() {
        if (LeaseService.instance) {
            return LeaseService.instance;
        }
        LeaseService.instance = this;
    }

    static getInstance() {
        if (!LeaseService.instance) {
            LeaseService.instance = new LeaseService();
        }
        return LeaseService.instance;
    }

    //Get all leases
    async getAll(): Promise<Lease[]> {
        try {
            const response = await axios.get<{leases:Lease[]}>(this.ENDPOINT,
                { headers: { Authorization: `${localStorage.getItem('token')}` }}
            );
            return response.data.leases;
        } catch (error) {
            console.error('Error fetching leases:', error);
            throw error;
        }
    }
    async getAllByOwnerId(ownerId:string): Promise<Lease[]> {
        try {
            const response = await axios.get<{leases:Lease[]}>(this.ENDPOINT+"/owner/"+ownerId,
                { headers: { Authorization: `${localStorage.getItem('token')}` }}
            );
            return response.data.leases;
        } catch (error) {
            console.error('Error fetching leases:', error);
            throw error;
        }
    }
    async getAllByClientId(ownerId:string): Promise<Lease[]> {
        try {
            const response = await axios.get<{leases:Lease[]}>(this.ENDPOINT+"/client/"+ownerId,
                { headers: { Authorization: `${localStorage.getItem('token')}` }}
            );
            return response.data.leases;
        } catch (error) {
            console.error('Error fetching leases:', error);
            throw error;
        }
    }
    async get(id: string): Promise<Lease> {
        try {
            const response = await axios.get<{lease:Lease}>(`${this.ENDPOINT}/${id}`);
            return response.data.lease
        } catch (error) {
            console.error(`Error fetching lease with ID ${id}:`, error);
            throw error;
        }
    }

    async create(lease: Omit<Lease, '_id'>): Promise<Lease> {
        try {
            const response = await axios.post<Lease>(this.ENDPOINT+"create", lease,
                { headers: { Authorization: `${localStorage.getItem('token')}` }}
            );
            return response.data;
        } catch (error) {
            console.error('Error creating lease:', error);
            throw error;
        }
    }

    async update(id: string, lease: Partial<Lease>): Promise<Lease> {
        try {
            const response = await axios.put<Lease>(`${this.ENDPOINT}/${id}`, lease,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error(`Error updating lease with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${this.ENDPOINT}/${id}`,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
        } catch (error) {
            console.error(`Error deleting lease with ID ${id}:`, error);
            throw error;
        }
    }
}

export default LeaseService.getInstance();