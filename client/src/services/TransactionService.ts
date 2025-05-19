import axios from 'axios';
import { API_URL } from "../utils/constants";
import Transaction from '../models/Transaction';

class TransactionService {
    private static instance: TransactionService;
    private ENDPOINT = API_URL + 'transactions';

    private constructor() {}

    static getInstance(): TransactionService {
        if (!TransactionService.instance) {
            TransactionService.instance = new TransactionService();
        }
        return TransactionService.instance;
    }

    async getAll(): Promise<Transaction[]> {
        try {
            const response = await axios.get<Transaction[]>(this.ENDPOINT+"/",
                { headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data.map((e)=> { return{
                _id: e._id,
                payerId: e.payerId,
                payerName: e.payerName,
                receiverId: e.receiverId,
                receiverName: e.receiverName,
                propertyId: e.propertyId,
                propertyName: e.propertyName,
                amount: e.amount,
                currency: e.currency,
                type: e.type as "rent" | "deposit" | "sale" | "penalty",
                date: new Date(e.date),
                status: e.status as "pending" | "completed" | "failed",
                paymentMethod: e.paymentMethod as "credit_card" | "bank_transfer" | "paypal"
                } as Transaction})||[];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }
    async getAllByUserId(userId:string): Promise<Transaction[]> {
        try {
            const response = await axios.get<Transaction[]>(this.ENDPOINT+"/user/"+userId,
                { headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data || [];
        }
        catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }
    async get(id: string): Promise<Transaction> {
        try {
            const response = await axios.get<Transaction>(`${this.ENDPOINT}/${id}`,
                { headers: { Authorization: `${localStorage.getItem('token')}` }});
            return {
                _id: response.data._id,
                payerId: response.data.payerId,
                payerName: response.data.payerName,
                receiverId: response.data.receiverId,
                receiverName: response.data.receiverName,
                propertyId: response.data.propertyId,
                propertyName: response.data.propertyName,
                amount: response.data.amount,
                currency: response.data.currency,
                type: response.data.type as "rent" | "deposit" | "sale" | "penalty",
                date: new Date(response.data.date),
                status: response.data.status as "pending" | "completed" | "failed",
                paymentMethod: response.data.paymentMethod as "credit_card" | "bank_transfer" | "paypal"
                } as Transaction;
        } catch (error) {
            console.error(`Error fetching transaction with ID ${id}:`, error);
            throw error;
        }
    }

    async create(transaction: Omit<Transaction, '_id'>): Promise<Transaction> {
        try {
            const response = await axios.post<Transaction>(this.ENDPOINT+"/create", transaction,
                { headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }

    async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
        try {
            const response = await axios.put<Transaction>(`${this.ENDPOINT}/${id}`, transaction,
                { headers: { Authorization: `${localStorage.getItem('token')}` }});
            return response.data;
        } catch (error) {
            console.error(`Error updating transaction with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${this.ENDPOINT}/${id}`,
                { headers: { Authorization: `${localStorage.getItem('token')}` }});
        } catch (error) {
            console.error(`Error deleting transaction with ID ${id}:`, error);
            throw error;
        }
    }
}

export default TransactionService.getInstance();