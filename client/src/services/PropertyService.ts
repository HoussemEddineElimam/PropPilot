import axios from "axios";
import { API_URL } from "../utils/constants";
import { Property } from "../models/Property";
import useAuthStore from "../hooks/useAuthStore";

class PropertyService {
    private static instance: PropertyService;
    private ENDPOINT = `${API_URL}properties`;

    private constructor() {}

    static getInstance(): PropertyService {
        if (!PropertyService.instance) {
            PropertyService.instance = new PropertyService();
        }
        return PropertyService.instance;
    }

    private getAuthHeaders(): Record<string, string> {
        const { token } = useAuthStore.getState();
        return token ? { Authorization: `${token}` } : {};
    }

    async getAll(): Promise<Property[]> {
        try {
            const response = await axios.get<{ properties: Property[] }>(this.ENDPOINT, {
                headers: this.getAuthHeaders(),
            });
            const properties =  response.data.properties.map((property) => ({
                ...property,
                createdAt: new Date(property.createdAt),
                updatedAt: property.updatedAt ? new Date(property.updatedAt) : undefined,
            }));
            console.log("Fetched properties:", properties);
            return properties;
        } catch (error) {
            console.error("Error fetching properties:", error);
            throw error;
        }
    }
    async getAllPropertiesByOwner(ownerId:string): Promise<Property[]> {
        try {
            const response = await axios.get<{ properties: Property[] }>(this.ENDPOINT+"/owner/"+ownerId, {
                headers: this.getAuthHeaders(),
            });
            const properties =  response.data.properties.map((property) => ({
                ...property,
                createdAt: new Date(property.createdAt),
                updatedAt: property.updatedAt ? new Date(property.updatedAt) : undefined,
            }));
            console.log("Fetched properties:", properties);
            return properties;
        } catch (error) {
            console.error("Error fetching properties:", error);
            throw error;
        }
    }
    async getPredictedPrice(payload: {
    homeStatus: number;
    homeType: number;
    city: number;
    state: number;
    yearBuilt: number;
    livingAreaSqft: number;
    bathrooms: number;
    bedrooms: number;
    propertyTaxRate: number;
}): Promise<number> {
    try {
        const response = await axios.post<{ predictedPrice: number }>(
            `${this.ENDPOINT}/predict`,
            {
                homeStatus: payload.homeStatus,
                homeType: payload.homeType,
                city: payload.city,
                state: payload.state,
                yearBuilt: payload.yearBuilt,
                livingAreaSqft: payload.livingAreaSqft,
                bathrooms: payload.bathrooms,
                bedrooms: payload.bedrooms,
                propertyTaxRate: payload.propertyTaxRate
            },
            {
                headers: this.getAuthHeaders()
            }
        );

        return response.data.predictedPrice;
    } catch (error) {
        console.error("Error fetching predicted price:", error);
        throw error;
    }
}

    async get(id: string): Promise<Property> {
        try {
            const response = await axios.get<{ property: Property }>(`${this.ENDPOINT}/${id}`, {
                headers: this.getAuthHeaders(),
            });
            return response.data.property;
        } catch (error) {
            console.error(`Error fetching property with ID ${id}:`, error);
            throw error;
        }
    }

    async create(formData: FormData): Promise<Property> {
        try {
            console.log("Sending FormData:");
            formData.forEach((value, key) => console.log(`${key}: ${value}`));

            const response = await axios.post<Property>(`${this.ENDPOINT}/create`, formData, {
                headers: { ...this.getAuthHeaders(), "Content-Type": "multipart/form-data" },
            });

            return response.data;
        } catch (error: any) {
            console.error("Error creating property:", error.response?.data || error.message);
            throw error;
        }
    }

    async update(id: string, property: Partial<Property & { images?: File[] }>): Promise<Property> {
        try {
            const formData = new FormData();

            Object.entries(property).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === "images" && Array.isArray(value)) {
                        value.forEach((file) => formData.append("images", file));
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            });

            const response = await axios.put<Property>(`${this.ENDPOINT}/${id}`, formData, {
                headers: { ...this.getAuthHeaders(), "Content-Type": "multipart/form-data" },
            });

            return response.data;
        } catch (error) {
            console.error(`Error updating property with ID ${id}:`, error);
            throw error;
        }
    }

    async updateFormData(id: string, formData: FormData): Promise<Property> {
        try {
            const response = await axios.put<Property>(`${this.ENDPOINT}/${id}`, formData, {
                headers: { ...this.getAuthHeaders(), "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating property with ID ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${this.ENDPOINT}/${id}`, {
                headers: this.getAuthHeaders(),
            });
        } catch (error) {
            console.error(`Error deleting property with ID ${id}:`, error);
            throw error;
        }
    }
}

export default PropertyService.getInstance();
