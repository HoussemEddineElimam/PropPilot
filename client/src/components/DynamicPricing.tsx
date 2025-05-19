import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import PropertyService from "../services/PropertyService";
import { Property } from "../models/Property";
import useAuthStore from "../hooks/useAuthStore";

interface PricingRecommendation {
  propertyId: string;
  propertyName: string;
  currentPrice: number;
  recommendedPrice: number;
  reason: string;
  confidence: number;
  priceType: 'sell' | 'rent';
}

export function DynamicPricing() {
  const [show, setShow] = useState(false);
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuthStore()
   useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const properties = await PropertyService.getAllPropertiesByOwner(user?._id!);
        
        const priceRecommendations: PricingRecommendation[] = [];
        
        for (const property of properties) {
          if (property.type === "real_estate" && property.sellPrice) {
            try {
              const predictedSellPrice = await PropertyService.getPredictedPrice({
                homeStatus: getHomeStatusValue(property.status),
                homeType: getHomeTypeValue(property.type || ''),
                city: property.city ? convertLocationToNumber(property.city) : 0,
                state: property.state ? convertLocationToNumber(property.state) : 0,
                yearBuilt: property.yearBuilt || 0,
                livingAreaSqft: property.livingAreaSqft || 0,
                bathrooms: property.bathrooms || 0,
                bedrooms: property.bedrooms || 0,
                propertyTaxRate: property.propertyTaxRate || 0
              });
              
              const confidence = calculateConfidence(property);
              const reason = generateReason(property, predictedSellPrice, property.sellPrice);
              
              priceRecommendations.push({
                propertyId: property._id,
                propertyName: property.name || `Property ${property._id.slice(-5)}`,
                priceType: 'sell',
                currentPrice: property.sellPrice,
                recommendedPrice: Math.round(predictedSellPrice),
                reason,
                confidence
              });
            } catch (error) {
              console.error(`Error predicting sell price for property ${property._id}:`, error);
            }
          }
          
          // Handle properties with rent price
          if ((property.type === "rented_real_estate" || property.type === "hotel") && property.rentPrice) {
            try {
              const predictedRentPrice = await calculateRentPriceSuggestion(property);
              const confidence = calculateConfidence(property);
              const reason = generateReason(property, predictedRentPrice, property.rentPrice);
              priceRecommendations.push({
                propertyId: property._id,
                propertyName: property.name || `Property ${property._id.slice(-5)}`,
                priceType: 'rent',
                currentPrice: property.rentPrice,
                recommendedPrice: Math.round(predictedRentPrice),
                reason,
                confidence
              });
            } catch (error) {
              console.error(`Error predicting rent price for property ${property._id}:`, error);
            }
          }
        }
        const meaningfulRecommendations = priceRecommendations.filter(rec => {
          const percentDiff = Math.abs(rec.recommendedPrice - rec.currentPrice) / rec.currentPrice;
          return percentDiff > 0.05;
        });
        
        setRecommendations(meaningfulRecommendations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching price recommendations:", error);
        setError("Failed to load pricing recommendations. Please try again later.");
        setLoading(false);
      }
    };
    
    
    fetchRecommendations();
    
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);
  const calculateConfidence = (property: Property): number => {
    const factorsPresent = [
      property.yearBuilt,
      property.livingAreaSqft,
      property.bathrooms,
      property.bedrooms,
      property.propertyTaxRate
    ].filter(Boolean).length;
    return Math.min(65 + (factorsPresent * 7), 95);
  };
  const generateReason = (property: Property, recommended: number, current: number): string => {
    const difference = recommended - current;
    const percentChange = (difference / current) * 100;
    
    if (percentChange > 10) {
      return "High demand in this area suggests potential for increased pricing";
    } else if (percentChange > 5) {
      return "Slight increase recommended based on market trends";
    } else if (percentChange < -10) {
      return "Occupancy rates may improve with a more competitive price";
    } else if (percentChange < -5) {
      return "Minor price adjustment recommended to stay competitive";
    } else {
      return "Current pricing is aligned with market value";
    }
  };
  
  const handleApplyNewPrice = async (propertyId: string, newPrice: number) => {
    try {
      const property = await PropertyService.get(propertyId);
      
      const { images, ...propertyWithoutImages } = property;
      await PropertyService.update(propertyId, {
        ...propertyWithoutImages,
        sellPrice: property.type === 'real_estate' ? newPrice : property.sellPrice,
        rentPrice: property.type === 'rented_real_estate' || property.type === 'hotel' ? newPrice : property.rentPrice
      });
      
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec.propertyId === propertyId 
            ? { ...rec, currentPrice: newPrice, recommendedPrice: newPrice, reason: "Price recently updated" } 
            : rec
        )
      );
    } catch (error) {
      console.error("Error updating property price:", error);
      setError("Failed to update property price. Please try again.");
    }
  };
  
  const handleIgnoreRecommendation = (propertyId: string) => {
    setRecommendations(prevRecs => 
      prevRecs.filter(rec => rec.propertyId !== propertyId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-blue-700 dark:text-blue-300">
        <h3 className="text-lg font-medium mb-2">No pricing recommendations</h3>
        <p>Your property prices are currently aligned with market values.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div
          key={rec.propertyId}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 opacity-0 transform translate-y-5 transition-all duration-500 ease-out ${
            show ? "opacity-100 translate-y-0" : ""
          }`}
          style={{ transitionDelay: `${index * 200}ms` }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {rec.propertyName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                AI Pricing Recommendation
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {rec.confidence}% Confidence
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                ${rec.currentPrice}
              </p>
            </div>
            {rec.recommendedPrice > rec.currentPrice ? (
              <TrendingUp className="text-green-500 dark:text-green-400" size={24} />
            ) : (
              <TrendingDown className="text-red-500 dark:text-red-400" size={24} />
            )}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recommended Price</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                ${rec.recommendedPrice}
              </p>
            </div>
            <div className="ml-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400">Difference</p>
              <p className={`text-lg font-medium ${
                rec.recommendedPrice > rec.currentPrice 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                {rec.recommendedPrice > rec.currentPrice ? "+" : ""}
                ${Math.abs(rec.recommendedPrice - rec.currentPrice)} 
                ({Math.round((rec.recommendedPrice - rec.currentPrice) / rec.currentPrice * 100)}%)
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">{rec.reason}</p>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button 
              onClick={() => handleIgnoreRecommendation(rec.propertyId)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 delay-150"
            >
              Ignore
            </button>
            <button 
              onClick={() => handleApplyNewPrice(rec.propertyId, rec.recommendedPrice)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-md transition duration-300 hover:bg-blue-700 dark:hover:bg-blue-800 delay-150"
            >
              Apply New Price
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
function getHomeStatusValue(status: string | undefined): number {
  if (!status) return 0;
  
  // Map different property statuses to numeric values
  switch (status.toLowerCase()) {
    case 'for_sale':
      return 1;
    case 'pending':
      return 2;
    case 'sold':
      return 3;
    case 'off_market':
      return 4;
    default:
      return 0;
  }
}
function convertLocationToNumber(location: string): number {
  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    const char = location.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  
  return Math.abs(hash % 1000);
}
function getHomeTypeValue(type: string): number {
  if (!type) return 0;
  
  // Map different property types to numeric values
  switch (type.toLowerCase()) {
    case 'real_estate':
      return 1;
    case 'rented_real_estate':
      return 2;
    case 'hotel':
      return 3;
    case 'apartment':
      return 4;
    case 'house':
      return 5;
    case 'condo':
      return 6;
    case 'townhouse':
      return 7;
    default:
      return 0;
  }
}
async function calculateRentPriceSuggestion(property: Property): Promise<number> {
  // Use the price prediction service with rental-specific adjustments
  const basePrice = await PropertyService.getPredictedPrice({
    homeStatus: getHomeStatusValue(property.status),
    homeType: getHomeTypeValue(property.type || ''),
    city: property.city ? convertLocationToNumber(property.city) : 0,
    state: property.state ? convertLocationToNumber(property.state) : 0,
    yearBuilt: property.yearBuilt || 0,
    livingAreaSqft: property.livingAreaSqft || 0,
    bathrooms: property.bathrooms || 0,
    bedrooms: property.bedrooms || 0,
    propertyTaxRate: property.propertyTaxRate || 0
  });

  
  const monthlyRentFactor = 0.01; 
  const suggestedMonthlyRent = basePrice * monthlyRentFactor;

  // Apply seasonal adjustment if needed (example: peak season markup)
  const currentMonth = new Date().getMonth();
  const seasonalFactor = (currentMonth >= 5 && currentMonth <= 8) ? 1.1 : 1.0; // 10% markup during summer

  return suggestedMonthlyRent * seasonalFactor;
}

