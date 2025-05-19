import axios from 'axios';
import { API_URL } from "../utils/constants";
import { Notification } from '../models/Notification';

class NotificationService {
    private static instance: NotificationService;
    private ENDPOINT = API_URL + 'notifications';

    constructor() {
        if (NotificationService.instance) {
            return NotificationService.instance;
        }
        NotificationService.instance = this;
    }

    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async getAll(): Promise<Notification[]> {
        try {
            const response = await axios.get<{notifications:Notification[]}>(this.ENDPOINT);
            return response.data.notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    async get(id: string): Promise<Notification> {
        try {
            const response = await axios.get<{notification:Notification}>(`${this.ENDPOINT}/${id}`);
            return response.data.notification;
        } catch (error) {
            console.error(`Error fetching notification with ID ${id}:`, error);
            throw error;
        }
    }

    async create(notification: Omit<Notification, 'id'>): Promise<Notification> {
        try {
            const response = await axios.post<Notification>(this.ENDPOINT, notification);
            return response.data;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    //Update an existing notification
    async update(id: string, notification: Partial<Notification>): Promise<Notification> {
        try {
            const response = await axios.put<Notification>(`${this.ENDPOINT}/${id}`, notification);
            return response.data;
        } catch (error) {
            console.error(`Error updating notification with ID ${id}:`, error);
            throw error;
        }
    }

    //Delete a notification
    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${this.ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error deleting notification with ID ${id}:`, error);
            throw error;
        }
    }
    async markAllAsRead(ids: string[]): Promise<void> {
        try {
          await axios.patch(`${this.ENDPOINT}/mark-all-as-read`, { ids });
        } catch (error) {
          console.error('Error marking all notifications as read:', error);
          throw error;
        }
      }
}

export default NotificationService.getInstance();