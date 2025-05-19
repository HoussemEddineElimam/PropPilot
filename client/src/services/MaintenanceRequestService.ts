import axios from 'axios';
import { API_URL } from "../utils/constants";
import { MaintenanceRequest } from '../models/MaintenanceRequest';

class MaintenanceRequestService {
    private static instance: MaintenanceRequestService;
    private ENDPOINT = API_URL + 'maintenance';

    constructor() {
        if (MaintenanceRequestService.instance) {
            return MaintenanceRequestService.instance;
        }
        MaintenanceRequestService.instance = this;
    }
    static getInstance() {
        if (!MaintenanceRequestService.instance) {
            MaintenanceRequestService.instance = new MaintenanceRequestService();
        }
        return MaintenanceRequestService.instance;
    }
    async getAll(): Promise<MaintenanceRequest[]> {
        try {
            const response = await axios.get<MaintenanceRequest[]>(this.ENDPOINT,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching maintenance requests:', error);
            throw error;
        }
    }
    async getAllByOwnerId(ownerId:string): Promise<MaintenanceRequest[]> {
        try {
            const response = await axios.get<MaintenanceRequest[]>(this.ENDPOINT+"/owner/"+ownerId,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching maintenance requests:', error);
            throw error;
        }
    }
    async get(id: string): Promise<MaintenanceRequest> {
        try {
            const response = await axios.get<MaintenanceRequest>(`${this.ENDPOINT}/${id}`,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error(`Error fetching maintenance request with ID ${id}:`, error);
            throw error;
        }
    }

    async create(maintenanceRequest: Omit<MaintenanceRequest, '_id'>): Promise<MaintenanceRequest> {
        try {
            const response = await axios.post<MaintenanceRequest>(this.ENDPOINT+"/create", maintenanceRequest,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error('Error creating maintenance request:', error);
            throw error;
        }
    }

    async update(id: string, maintenanceRequest: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
        try {
            const response = await axios.put<MaintenanceRequest>(`${this.ENDPOINT}/${id}`, maintenanceRequest,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error(`Error updating maintenance request with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${this.ENDPOINT}/${id}`,{ headers: { Authorization: `${localStorage.getItem('token')}` }});
        } catch (error) {
            console.error(`Error deleting maintenance request with ID ${id}:`, error);
            throw error;
        }
    }
}

export default MaintenanceRequestService.getInstance();