import React, {  useState } from 'react';
import { Property } from '../models/Property';
import { Lease } from '../models/Lease';
import { Booking } from '../models/Booking';
import { Calendar, Star, ChevronDown, Phone, Mail, Home, Clock, Hotel } from 'lucide-react';
import BookingService from '../services/BookingService';
import LeaseService from '../services/LeaseService';
import TransactionService from '../services/TransactionService';
import Transaction from '../models/Transaction';
import useAuthStore from '../hooks/useAuthStore';

interface PropertyContactCardProps {
  property: Property;
}

const PropertyContactCard: React.FC<PropertyContactCardProps> = ({ property}) => {
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [leaseType, setLeaseType] = useState<'short-term' | 'long-term'>('long-term');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user  } = useAuthStore();
  const userId = user?._id || '';
  // Determine property type
  const isRealEstate = property.type === "real_estate";
  const isRental = property.type === "rented_real_estate";
  const isHotel = property.type === "hotel";
  
  // For sale properties
  const salePrice = property.sellPrice || 0;
  const estimatedTaxes = Math.round(salePrice * 0.05);
  const totalSalePrice = Number(salePrice) + Number(estimatedTaxes);
  
  // For rental properties
  const rentPrice = property.rentPrice || 0;
  const securityDeposit = rentPrice;
  const applicationFee = 50;
  const dueAtSigning = rentPrice * 2 + applicationFee;
  
  const handleDateClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation would go here
    alert("Your message has been sent!");
    setMessage('');
  };

  const calculateBookingTotal = (): number => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const daysCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return daysCount * (property.rentPrice || 0);
    }
    return 0;
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !userId) {
      alert("Please select check-in and check-out dates");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create a booking for hotel
      if (isHotel) {
        const totalAmount = calculateBookingTotal();
        const booking: Omit<Booking, '_id'> = {
          propertyId: property._id,
          clientId: userId,
          checkInDate: new Date(checkIn),
          checkOutDate: new Date(checkOut),
          status: "pending",
          totalAmount: totalAmount,
          bookedAt: new Date()
        };
        
        await BookingService.create(booking);
        alert("Your booking request has been submitted!");
      }
      
      // Create a lease for rental property
      else if (isRental) {
        // For short-term, use the selected dates
        // For long-term, set end date to 12 months from start date
        let startDate = new Date(checkIn);
        let endDate: Date;
        
        if (leaseType === 'short-term') {
          endDate = new Date(checkOut);
        } else {
          endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + 1);
        }
        
        const lease: Omit<Lease, '_id'> = {
          propertyId: property._id,
          clientId: userId,
          startDate: startDate,
          endDate: endDate,
          status: "pending",
          rentAmount: property.rentPrice || 0
        };
        
        await LeaseService.create(lease);
        alert("Your lease request has been submitted!");
      }
      
    } catch (error) {
      console.error("Error processing request:", error);
      alert("There was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = async () => {
  if (!userId) {
    alert("Please log in to make a purchase");
    return;
  }

  if (!property || !property._id || !property.ownerId) {
    alert("Property details are incomplete. Please try again.");
    return;
  }

  try {
    setIsProcessing(true);

    const transaction: Transaction = {
      _id: '',
      propertyId: property._id,
      propertyName: property.name || 'Unnamed Property',
      payerId: userId,
      payerName: user?.fullName || 'Anonymous Buyer',
      receiverId: property.ownerId,
      receiverName: property.ownerName || 'Unknown Owner',
      amount: totalSalePrice,
      currency: 'USD',
      type: 'deposit',
      status: 'pending',
      date: new Date(),
      paymentMethod: 'credit_card'
    };

    await TransactionService.create(transaction);

    alert("Your purchase request has been submitted! Our agent will contact you shortly.");
  } catch (error: any) {
    console.error("Error processing purchase:", error.message || error);
    alert("There was an error processing your purchase. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};

  // Get appropriate title and icon based on property type
  const getHeaderContent = () => {
    if (isRealEstate) {
      return {
        title: "Interested in Buying?",
        subtitle: "Make this property yours",
        icon: <Home className="w-5 h-5 text-white" />
      };
    } else if (isRental) {
      return {
        title: "Lease This Property",
        subtitle: "Short or long-term rental options",
        icon: <Clock className="w-5 h-5 text-white" />
      };
    } else {
      return {
        title: "Book Your Stay",
        subtitle: "Reserve this property now",
        icon: <Hotel className="w-5 h-5 text-white" />
      };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 text-white">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {headerContent.icon}
            <div>
              <h3 className="text-xl font-bold">{headerContent.title}</h3>
              <p className="text-blue-100 mt-1">{headerContent.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.9</span>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6">
        {/* Pricing display */}
        <div className="mb-6">
          {isRealEstate ? (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">${salePrice.toLocaleString()}</span>
            </div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">${rentPrice.toLocaleString()}</span>
              <span className="text-gray-600 ml-1">{isHotel ? '/night' : '/month'}</span>
            </div>
          )}
          
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span>{property.category || 'Premium'} {property.type?.replace(/_/g, ' ')} property</span>
          </div>
        </div>
        
        {/* Date selection for rentals and hotels */}
        {(isRental || isHotel) && (
          <div className="mb-6 relative">
            <div 
              className="border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={handleDateClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-blue-600" size={18} />
                  <span className="text-gray-800">
                    {checkIn && checkOut 
                      ? `${checkIn} - ${checkOut}` 
                      : `Select ${isHotel ? 'stay' : 'lease'} dates`}
                  </span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            
            {isCalendarOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isHotel ? 'Check-in' : 'Start date'}
                    </label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setCheckIn(e.target.value)}
                      value={checkIn}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isHotel ? 'Check-out' : 'End date'}
                    </label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setCheckOut(e.target.value)}
                      value={checkOut}
                      min={checkIn}
                    />
                  </div>
                  
                  {/* Lease type selection for rental properties */}
                  {isRental && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lease Term</label>
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={leaseType}
                        onChange={(e) => setLeaseType(e.target.value as 'short-term' | 'long-term')}
                      >
                        <option value="short-term">Short-term</option>
                        <option value="long-term">Long-term (12 months)</option>
                      </select>
                    </div>
                  )}
                  
                  <button 
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setIsCalendarOpen(false)}
                  >
                    Apply Dates
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Price breakdown */}
        <div className="mb-6 space-y-3">
          {isRealEstate ? (
            <>
              <div className="flex justify-between text-gray-700">
                <span>Listing price</span>
                <span>${salePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Estimated taxes</span>
                <span>${estimatedTaxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-200 pt-3">
                <span>Estimated total</span>
                <span>${totalSalePrice.toLocaleString()}</span>
              </div>
            </>
          ) : isRental ? (
            <>
              <div className="flex justify-between text-gray-700">
                <span>Monthly rent</span>
                <span>${rentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Security deposit</span>
                <span>${securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Application fee</span>
                <span>${applicationFee}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-200 pt-3">
                <span>Due at signing</span>
                <span>${dueAtSigning.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <>
              {checkIn && checkOut ? (
                <>
                  <div className="flex justify-between text-gray-700">
                    <span>Nightly rate</span>
                    <span>${rentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Total nights</span>
                    <span>{calculateBookingTotal() / rentPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Cleaning fee</span>
                    <span>$50</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>${(calculateBookingTotal() + 50).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="text-gray-700">
                  Select dates to see total price
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="space-y-3">
          <button 
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={isRealEstate ? handlePurchase : handleBooking}
            disabled={isProcessing || ((isRental || isHotel) && (!checkIn || !checkOut))}
          >
            {isProcessing ? 'Processing...' : (
              isRealEstate ? 'Purchase property' : 
              isRental ? 'Request lease' : 
              'Book now'
            )}
          </button>
          
          <button 
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            onClick={() => setIsContactFormOpen(!isContactFormOpen)}
          >
            Contact {isRealEstate ? 'agent' : isRental ? 'property manager' : 'hotel'}
          </button>
        </div>
        
        {/* Contact form */}
        {isContactFormOpen && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold mb-4">Send a message</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your message
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder={`I'm interested in this ${
                    isRealEstate ? 'property' : 
                    isRental ? 'rental' : 
                    'booking'
                  } and would like more information.`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send message
              </button>
            </form>
            
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={16} className="text-blue-600" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={16} className="text-blue-600" />
                <span>contact@propertyfinder.com</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyContactCard;