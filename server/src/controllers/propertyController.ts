import { Request, Response } from "express";
import { AppDataSource,  } from "../config/data-source";
import jwt from 'jsonwebtoken';
import { Property } from "../models/PropertyModel";
import { ObjectId } from "mongodb";
import { deleteUserProperty, updateUserProperties } from "../utils/userUtils";
import dotenv from "dotenv";
import axios from "axios";
const propertyRepository = AppDataSource.getMongoRepository(Property);
dotenv.config();




const createProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            description,
            country,
            state,
            city,
            status,
            type,
            category,
            sellPrice,
            rentPrice,
            leaseTerm,
            roomCount,
            bathrooms,
            bedrooms,
            yearBuilt,
            livingAreaSqft,
            propertyTaxRate,
            ownerId,
        } = req.body;
   
        const images = req.files as Express.Multer.File[];
        console.log('images:', images);
        const token = req.headers.authorization;
        if (!ownerId || !ObjectId.isValid(ownerId)) {
            res.status(401).json({ message: 'Unauthorized: Invalid ownerId' });
            return;
        }

        if (!name || !country || !state || !city || !status || !type || !category) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const imagePaths = images?.map((file) => file.path) || [];

        const property = propertyRepository.create({
            name,
            description: description || null,
            country,
            state,
            city,
            ownerId: new ObjectId(ownerId),
            images: imagePaths,
            status,
            type,
            category,
            sellPrice: sellPrice || null,
            rentPrice: rentPrice || null,
            leaseTerm: leaseTerm || null,
            roomCount: roomCount || null,
            bathrooms: bathrooms || null,
            bedrooms: bedrooms || null,
            yearBuilt: yearBuilt || null,
            livingAreaSqft: livingAreaSqft || null,
            propertyTaxRate: propertyTaxRate || null,
            transactionIds: [],
            maintenanceRequestIds: [],
            leaseIds: [],
            bookingIds: [],
        });

        const savedProperty = await propertyRepository.save(property);
        await updateUserProperties(savedProperty.ownerId!, savedProperty._id);

        res.status(201).json({ message: 'Property created successfully', property: savedProperty });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProperty = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const token = req.headers.authorization; 

    try {
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Missing token' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Internal server error: Missing JWT secret' });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        const ownerId = decoded.userId;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid property ID' });
            return;
        }

        const property = await propertyRepository.findOneBy({ _id: new ObjectId(id) });
        
        if (!property) {
            console.error('Property not found:', id);
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        console.log('property:', property);

        if (property.ownerId.toString() !== ownerId) {
            res.status(403).json({ message: 'Forbidden: You do not own this property' });
            return;
        }

        const newImages = req.files as Express.Multer.File[];
        const newImagePaths = newImages?.map((file) => file.path) || [];
        
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.leaseIds;
        delete updateData.bookingIds;
        delete updateData.maintenanceRequestIds;
        delete updateData.transactionIds;
        delete updateData.ownerId;
        delete updateData.images;

        if (newImagePaths.length > 0) {
            updateData.images = newImagePaths;
        }

        console.log('updateData:', updateData);
        
        // Perform the update
        await propertyRepository.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        const updatedProperty = await propertyRepository.findOneBy({ _id: new ObjectId(id) });

        res.status(200).json({ 
            message: 'Property updated successfully', 
            property: updatedProperty 
        });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// delete function 
const deleteProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || !ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid property ID' });
            return;
        }

        const objectId = new ObjectId(id);
        
        const property = await propertyRepository.findOne({ 
            where: { _id: objectId } 
        }) as Property | null;

        if (!property) {
            console.error('Property not found:', id);
            res.status(404).json({ message: 'Property not found' });
            return;
        }

        await propertyRepository.delete(objectId);

        if (property.ownerId) {
            try {
                await deleteUserProperty(property.ownerId, property._id);
            } catch (userPropError) {
                console.error('Error cleaning up user property reference:', userPropError);
            }
        }

        res.status(200).json({ 
            message: 'Property deleted successfully',
            deletedId: id
        });
    } catch (error) {
        console.error('Error deleting property:', error);
        
        const statusCode = error instanceof Error ? 400 : 500;
        const message = statusCode === 500 
            ? 'Internal server error' 
            : (error as Error).message;

        res.status(statusCode).json({ message });
    }
};

const getAllProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const properties = await propertyRepository.find();
        res.status(200).json({ message: 'Properties retrieved successfully', properties });
    } catch (error) {
        console.error('Error retrieving properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getAllPropertiesByOwnerId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ownerId } = req.params;
        if (!ownerId || !ObjectId.isValid(ownerId)) {
            res.status(400).json({ message: 'Invalid owner ID' });
            return;
        }
        const objectId = new ObjectId(ownerId);
        
        const properties = await propertyRepository.find({
            where: { ownerId: objectId }
        });
        if (properties.length === 0) {
            res.status(404).json({ message: 'No properties found for this owner' });
            return;
        }
        res.status(200).json({ message: 'Properties retrieved successfully', properties });
    } catch (error) {
        console.error('Error retrieving properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getPropertyById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid property ID' });
            return;
        }
/*
        // Check Redis Cache (String Data Structure)
        const cachedProperty = await redisClient.get(`property:${id}`);
        if (cachedProperty) {
            console.log('cache hit');
            res.status(200).json({ message: 'Property retrieved from cache', property: JSON.parse(cachedProperty) });
            return;
        }
        console.log('cache miss');
        // Fetch from MongoDB if not in cache
        */
        const property = await propertyRepository.findOneBy({ _id: new ObjectId(id) });

        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
/*
        // Cache the property as a Redis String (Expire in 1 hour)
        await redisClient.setEx(`property:${id}`, 3600, JSON.stringify(property));
*/
        res.status(200).json({ message: 'Property retrieved successfully', property });
    } catch (error) {
        console.error('Error retrieving property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const SearchController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { country, state, city, status, type, category } = req.query;
/*
        // Store search in Redis history
        await redisClient.lPush("search_history", JSON.stringify(req.query));
        await redisClient.lTrim("search_history", 0, 99); // Keep last 100 searches

        // Generate a unique cache key for search results
        const cacheKey = `search:${JSON.stringify(req.query)}`;

        // Check cache first
        const cachedResults = await redisClient.get(cacheKey);
        if (cachedResults) {
            console.log('cache hit');
            res.status(200).json({ message: 'Properties retrieved from cache', properties: JSON.parse(cachedResults) });
            return;
        }
console.log('cache miss');*/
        // Search conditions
        const searchConditions: any = {};
        if (country) searchConditions.country = { $regex: new RegExp(country as string, "i") };
        if (state) searchConditions.state = { $regex: new RegExp(state as string, "i") };
        if (city) searchConditions.city = { $regex: new RegExp(city as string, "i") };
        if (status) searchConditions.status = status;
        if (type) searchConditions.type = type;
        if (category) searchConditions.category = { $regex: new RegExp(category as string, "i") };

        // Fetch from DB
        const properties = await propertyRepository.find({ where: searchConditions });

        if (properties.length === 0) {
            res.status(404).json({ message: 'No properties found matching the search criteria' });
            return;
        }
/*
        // Cache the results
        await redisClient.setEx(cacheKey, 1800, JSON.stringify(properties));
*/
        res.status(200).json({ message: 'Properties retrieved successfully', properties });
    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const predictPrice = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extracting the data from the request body
        const {
            homeStatus,
            homeType,
            city,
            state,
            yearBuilt,
            livingAreaSqft,
            bathrooms,
            bedrooms,
            propertyTaxRate
        } = req.body;

        console.log(req.body)
        if (
            homeStatus== undefined || homeStatus == null || !homeType || !city || !state || !yearBuilt ||
            !livingAreaSqft || !bathrooms || !bedrooms || !propertyTaxRate
        ) {
            console.log("Missing required parameters");
            return;
        }

        // Prepare the payload for the Flask API request
        const payload = {
            homeStatus: Number(homeStatus),
            homeType: Number(homeType),
            city: Number(city),
            state: Number(state),
            yearBuilt: Number(yearBuilt),
            "livingArea in sqft": Number(livingAreaSqft),
            bathrooms: Number(bathrooms),
            bedrooms: Number(bedrooms),
            propertyTaxRate: Number(propertyTaxRate)
        };

        const response = await axios.post("http://127.0.0.1:5001/predict", payload);
        console.log(response.data)
        res.status(200).json({
            message: "Prediction successful",
            predictedPrice: response.data.predicted_price
        });
    } catch (error: any) {
        // Handling errors
        console.error("Prediction error:", error.message);
        res.status(500).json({
            message: "Error during prediction",
            error: error.message
        });
    }
};

export {createProperty,getAllProperties,getAllPropertiesByOwnerId,getPropertyById,updateProperty,deleteProperty,SearchController,predictPrice};
