import axios from "axios";
import Transaction from "../models/Transaction";
import { API_URL } from "../utils/constants";

const API_ENDPOINT = `"${API_URL}"/transactions`; 

export default class TransactionRepository {
  private static instance: TransactionRepository;

  private constructor() {}

  public static getInstance(): TransactionRepository {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository();
    }
    return TransactionRepository.instance;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const response = await axios.get(API_ENDPOINT);
    return response.data;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  }

  async createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction | null> {
    try {
      const response = await axios.post(API_ENDPOINT, transaction);
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const response = await axios.put(`${API_ENDPOINT}/${id}`, transaction);
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      return null;
    }
  }

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return false;
    }
  }
}

