import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, Flag, ChevronRight } from 'lucide-react';
import { Review } from '../models/Review';
import User from '../models/User';

interface PropertyReviewsProps {
  reviews: Review[];
  clientInfo: Record<string, User>;
  onAddReview: (review: { rating: number; comment: string; clientId: string }) => void;
  onDeleteReview: (reviewId: string) => void;
  onUpdateReview: (reviewId: string, updates: Partial<Review>) => void;
  currentUserCanReview: boolean;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ 
  reviews, 
  clientInfo, 
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  currentUserCanReview 
}) => {
  const [showAll, setShowAll] = useState(false);
  const [newReviewOpen, setNewReviewOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
    
  // Display subset of reviews initially
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  
  const handleAddReview = () => {
    // In a real app, you'd get this from auth context
    const dummyClientId = "client123"; 
    
    onAddReview({
      rating: newReviewRating,
      comment: newReviewComment,
      clientId: dummyClientId
    });
    
    setNewReviewComment('');
    setNewReviewRating(5);
    setNewReviewOpen(false);
  };
  
  const getAvatarUrl = (path?: string) => {
    if (!path) return "https://i.pravatar.cc/150?img=68";
    if (path.startsWith('http')) return path;
    return `https://storage.cloud/${path}`;
  };
  
  // Rating breakdown calculation
  const ratingCounts = [0, 0, 0, 0, 0]; // 5-star to 1-star
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++;
    }
  });
  
  const maxRatingCount = Math.max(...ratingCounts);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
          <MessageCircle className="text-blue-600" size={24} />
          Guest Reviews
        </h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No reviews yet for this property.</p>
            {currentUserCanReview && (
              <button 
                onClick={() => setNewReviewOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Be the first to leave a review
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Summary and stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Average rating */}
              <div className="flex flex-col items-center justify-center md:items-start">
                <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(Number(averageRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-gray-600">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</div>
              </div>
              
              {/* Rating breakdown */}
              <div>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3 mb-2">
                    <div className="w-14 text-right text-gray-600">{rating} stars</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full"
                        style={{
                          width: `${maxRatingCount > 0 ? (ratingCounts[5-rating] / maxRatingCount) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <div className="w-10 text-gray-600">{ratingCounts[5-rating]}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Add review button */}
            {currentUserCanReview && (
              <div className="mb-8">
                <button 
                  onClick={() => setNewReviewOpen(!newReviewOpen)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {newReviewOpen ? 'Cancel' : 'Write a review'}
                </button>
              </div>
            )}
            
            {/* New review form */}
            {newReviewOpen && (
              <div className="mb-10 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Share your experience</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button 
                        key={rating}
                        onClick={() => setNewReviewRating(rating)}
                        className="p-2"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= newReviewRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your review
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Share your experience with this property..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleAddReview}
                  disabled={!newReviewComment.trim()}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    newReviewComment.trim() 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit review
                </button>
              </div>
            )}
            
            {/* Reviews list */}
            <div className="space-y-8">
              {displayedReviews.map((review) => {
                const client = clientInfo[review.clientId];
                return (
                  <div key={review._id} className="border-b border-gray-200 pb-8 last:border-0">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={getAvatarUrl(client?.avatar)}
                        alt={client?.fullName || "Anonymous"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{client?.fullName || "Anonymous User"}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-300 text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp size={16} />
                        <span>Helpful</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
                        <Flag size={16} />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Show more reviews */}
            {reviews.length > 3 && !showAll && (
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setShowAll(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors mx-auto"
                >
                  <span>See all {reviews.length} reviews</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyReviews;