import { Calendar, Star } from "lucide-react";
import { useState } from "react";
import { Property } from "../models/Property";

interface PricingCardProps {
  property: Property | null;
}

const PricingCard: React.FC<PricingCardProps> = ({ property }) => {
  const [checkIn, setCheckIn] = useState('2/6/2023');
  const [checkOut, setCheckOut] = useState('2/11/2023');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const handleDateClick = (type: 'checkin' | 'checkout') => {
    if (type === 'checkin') {
      setIsCheckInOpen(!isCheckInOpen);
      setIsCheckOutOpen(false);
    } else {
      setIsCheckOutOpen(!isCheckOutOpen);
      setIsCheckInOpen(false);
    }
  };

  const calculateMonths = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return 5;
  };

  if (!property) {
    return <div>Loading property...</div>;
  }

  // For real estate properties, show simple purchase price
  if (property.type === "real_estate") {
    return (
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-semibold">${property.sellPrice?.toLocaleString()}</span>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
            <span className="text-sm text-gray-600">4.99</span>
            <span className="text-sm text-gray-400">(937 reviews)</span>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white rounded-lg py-3 mb-2 hover:bg-blue-700 transition-colors">
          Make Offer
        </button>
        <p className="text-center text-sm text-gray-500 mb-6">Contact agent for details</p>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Property Price</span>
            <span>${property.sellPrice?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Taxes</span>
            <span>${Math.round((property.sellPrice || 0) * 0.05).toLocaleString()}</span>
          </div>
          <div className="pt-4 border-t flex justify-between font-semibold">
            <span>Estimated Total</span>
            <span>${Math.round((property.sellPrice || 0) * 1.05).toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }

  const months = calculateMonths();
  const originalPrice = property.rentPrice || 500;  
  const discountedPrice = property.rentPrice || 440;
  const discount = originalPrice - discountedPrice;
  const totalBeforeTaxes = discountedPrice * months;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
      {/* Price and Rating Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="line-through text-gray-400">${originalPrice}</span>
        <span className="text-2xl font-semibold">${discountedPrice}</span>
        <span className="text-gray-600">/month</span>
        <div className="flex items-center gap-1 ml-2">
          <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
          <span className="text-sm text-gray-600">4.99</span>
          <span className="text-sm text-gray-400">(937 reviews)</span>
        </div>
      </div>

      {/* Date Selection - Only show for rental properties */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button 
          onClick={() => handleDateClick('checkin')}
          className="border rounded-lg p-2 text-left hover:border-black transition-colors relative"
        >
          <div className="text-xs text-gray-500">CHECK-IN</div>
          <div className="font-medium flex items-center justify-between">
            {checkIn}
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          {isCheckInOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg p-2 z-10">
              <input 
                type="date" 
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  setCheckIn(new Date(e.target.value).toLocaleDateString());
                  setIsCheckInOpen(false);
                }}
              />
            </div>
          )}
        </button>
        <button 
          onClick={() => handleDateClick('checkout')}
          className="border rounded-lg p-2 text-left hover:border-black transition-colors relative"
        >
          <div className="text-xs text-gray-500">CHECKOUT</div>
          <div className="font-medium flex items-center justify-between">
            {checkOut}
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          {isCheckOutOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg p-2 z-10">
              <input 
                type="date" 
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  setCheckOut(new Date(e.target.value).toLocaleDateString());
                  setIsCheckOutOpen(false);
                }}
              />
            </div>
          )}
        </button>
      </div>

      {/* Reserve Button */}
      <button className="w-full bg-gray-500 text-white rounded-lg py-3 mb-2 hover:bg-gray-600 transition-colors">
        Reserve
      </button>
      <p className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</p>

      {/* Price Breakdown */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="underline">${originalPrice} x {months} month</span>
          <span>${originalPrice * months}</span>
        </div>
        <div className="flex justify-between">
          <span>Long stay discount</span>
          <span className="text-green-600">-${discount * months}</span>
        </div>
        <div className="flex justify-between">
          <span>Service fee</span>
          <span>$0</span>
        </div>
        <div className="pt-4 border-t flex justify-between font-semibold">
          <span>Total before taxes</span>
          <span>${totalBeforeTaxes}</span>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;