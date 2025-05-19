import { Bath, BedDouble, Heart, MapPin, Trash2 } from 'lucide-react'
import { Property } from '../models/Property'
import { useWishlist } from '../hooks/useWishlist'

const WishListPropertyCard = ({property}:{property:Property}) => {
  const {removeFromWishlist} = useWishlist()
  const formatPrice = (property: Property) => {
    if (property.type === 'hotel' || property.type === 'rented_real_estate') {
      return `$${property.rentPrice}/night`;
    } else if (property.rentPrice) {
      return `$${property.rentPrice}/month`;
    } else if (property.sellPrice) {
      return `$${property.sellPrice}`;
    }
    return 'Price on request';
  };
  return (
    <div key={property._id}
         className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] relative"
         >
                    <div className="relative">
                      <img 
                        src={property.images[0]} 
                        alt={property.name}
                        className="w-full h-48 object-cover"
                      />
                      <button 
                        onClick={() => removeFromWishlist(property._id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors group"
                      >
                        <Heart 
                          size={18} 
                          className="fill-red-500 text-red-500 group-hover:fill-gray-400 group-hover:text-gray-400" 
                        />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-medium">
                        {formatPrice(property)}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          {property.location}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{property.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        {property.roomCount && (
                          <div className="flex items-center">
                            <BedDouble size={16} className="mr-1" />
                            {property.roomCount} {property.roomCount === 1 ? 'Room' : 'Rooms'}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Bath size={16} className="mr-1" />
                          {Math.max(1, Math.floor(property.roomCount || 1 / 2))} Bath
                        </div>
                        <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                          {property.type === 'hotel' ? 'Hotel' : 
                           property.type === 'rented_real_estate' ? 'For Rent' : 'For Sale'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 py-2 border border-[#1F4B43] text-[#1F4B43] rounded-md hover:bg-[#1F4B43] hover:text-white transition-colors font-medium"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => removeFromWishlist(property._id)}
                          className="p-2 border border-gray-200 text-gray-500 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
  )
}

export default WishListPropertyCard