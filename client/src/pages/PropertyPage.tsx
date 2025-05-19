import { useParams } from "react-router-dom";

import { useProperty } from "../hooks/useProperty";
import PropertyGallery from "../components/PropertyGallery";
import PropertyInfo from "../components/PropertyInfo";
import PropertyReviews from "../components/PropertyReviews";
import PropertyContactCard from "../components/PropertyContactCard";

const PropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    property, 
    reviews, 
    clients,
    loading, 
    error,
    addReview,
    updateReview,
    deleteReview,
  } = useProperty(id);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-6">
        <div className="text-center py-16 px-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Property</h2>
          <p className="text-gray-700 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-6">
        <div className="text-center py-24">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-6 text-lg text-gray-600">Loading your dream property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-6">
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">We couldn't find the property you're looking for. It may have been removed or the link might be incorrect.</p>
        </div>
      </div>
    );
  }

  const handleAddReview = async (reviewData: { rating: number; comment: string; clientId: string }) => {
    try {
      await addReview(reviewData);
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  const handleUpdateReview = async (reviewId: string, updates: { rating?: number; comment?: string }) => {
    try {
      await updateReview(reviewId, updates);
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyGallery property={property} />
            <PropertyInfo property={property} />
            {/* <PropertyAmenities property={property} /> */}
            <PropertyReviews 
              reviews={reviews} 
              clientInfo={clients}
              onAddReview={handleAddReview}
              onUpdateReview={handleUpdateReview}
              onDeleteReview={handleDeleteReview}
              currentUserCanReview={true}
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-26">
              <PropertyContactCard property={property} />
            </div>
          </div>
        </div>
      </div>
  );
};

export default PropertyPage;