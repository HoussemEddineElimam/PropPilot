import { useState, useEffect } from 'react';
import { Property } from '../models/Property';
import { Review } from '../models/Review';
import PropertyService from '../services/PropertyService';
import ReviewService from '../services/ReviewService';
import UserService from '../services/UserService';

import User from '../models/User';
import useAuthStore from './useAuthStore';

export interface PropertyUIData {
  amenities: string[];
  squareFeet: number;
  bathCount: number;
  policies: {
    houseRules: string[];
    cancellation: string;
    health: string;
  };
}

export const useProperty = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [clients, setClients] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uiData, setUiData] = useState<PropertyUIData | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const {user} = useAuthStore();
  useEffect(() => {
    if (!id) {
      setError("Property ID is missing");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setReviewsError(null);
        
        // Fetch property data
        const propertyData = await PropertyService.get(id);
        const formattedProperty = {
          ...propertyData,
          createdAt: new Date(propertyData.createdAt),
          updatedAt: propertyData.updatedAt ? new Date(propertyData.updatedAt) : undefined
        };
        setProperty(formattedProperty);

        // Try to fetch reviews for property
        let reviewsData: Review[] = [];
        try {
          reviewsData = await ReviewService.getByPropertyId(id);
          setReviews(reviewsData.map(review => ({
            ...review,
            createdAt: new Date(review.createdAt)
          })));
        } catch (err) {
          console.warn('Could not fetch reviews, using empty array', err);
          setReviewsError('Could not load reviews');
          setReviews([]);
        }

        // Get unique client IDs from reviews
        const clientIds = [...new Set(reviewsData.map(review => review.clientId))];

        // Try to fetch client info for each unique client
        const clientsData: Record<string, User> = {};
        await Promise.all(
          clientIds.map(async clientId => {
            try {
              const user = await UserService.get(clientId);
              clientsData[clientId] = {
                ...user,
              };
            } catch (error) {
              console.warn(`Failed to fetch client ${clientId}:`, error);
              // Create a minimal user object if fetch fails
              clientsData[clientId] = {
                _id: clientId,
                fullName: 'Unknown User',
                email: '',
                isVerified: false,
                role: 'client',
                avatar: ''
              };
            }
          })
        );
        setClients(clientsData);

        // Set UI data based on property information
        setUiData({
          amenities: [
            "Flatscreen TV", "Fireplace", "Phone", "Work desk", 
            "Kitchen", "Coffee machine", "Dishes", "Washing machine", 
            "Iron", "Wardrobe"
          ],
          squareFeet: propertyData.livingAreaSqft || 500,
          bathCount: propertyData.bathrooms || 2,
          policies: {
            houseRules: [
              "Check-in time", "Check-out time", "No smoking", 
              "No pets", "No parties or events"
            ],
            cancellation: "Free Cancellation up to 24hrs before checkin",
            health: "Cleaner in accordance with our COVID safe cleaning policy"
          }
        });

      } catch (err) {
        console.error('Error fetching property data:', err);
        setError("Failed to fetch property data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const refreshReviews = async () => {
    if (!id) return;
    try {
      const reviewsData = await ReviewService.getByPropertyId(id);
      setReviews(reviewsData.map(review => ({
        ...review,
        createdAt: new Date(review.createdAt)
      })));
      setReviewsError(null);
    } catch (error) {
      console.error('Error refreshing reviews:', error);
      setReviewsError('Failed to refresh reviews');
      throw error;
    }
  };

  return { 
    property, 
    reviews, 
    clients,
    uiData,
    loading, 
    error,
    reviewsError,
    refreshReviews,
    addReview: async (reviewData: Omit<Review, '_id' | 'propertyId' | 'createdAt'>) => {
      if (!id) throw new Error("Property ID is missing");
      try {
        const newReview = await ReviewService.create({
          ...reviewData,
          clientId: user?._id || '',
          rating: reviewData.rating,
          propertyId: id,
          createdAt: new Date(),
        });
        await refreshReviews();
        return newReview;
      } catch (error) {
        console.error('Error adding review:', error);
        throw error;
      }
    },
    updateReview: async (reviewId: string, updates: Partial<Review>) => {
      try {
        const updatedReview = await ReviewService.update(reviewId, updates);
        await refreshReviews();
        return updatedReview;
      } catch (error) {
        console.error('Error updating review:', error);
        throw error;
      }
    },
    deleteReview: async (reviewId: string) => {
      try {
        await ReviewService.delete(reviewId);
        await refreshReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
      }
    }
  };
};