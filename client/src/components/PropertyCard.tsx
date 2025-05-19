import { BedDouble, Heart, MapPin, Star } from 'lucide-react'
import { Property } from '../models/Property'
import { useWishlist } from '../hooks/useWishlist'
import { Link } from 'react-router-dom'
import { STORAGE_URL } from '../utils/constants'

const PropertyCard = ({property }:{property:Property }) => {
        const {toggleWishlist , isInWishlist } = useWishlist()
        return (
              <div
                key={property._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px]">
                <div className="relative">
                  {property.images? <img
                    src={`${STORAGE_URL}${property.images?.[0] ?? ''}`}
                    alt={property.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                    loading="lazy"
                  />:<img src='default.png' alt={property.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                  loading="lazy"/> }
                  {property.status === "available" && property.rentPrice && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                      Rent
                    </div>
                  )}
                  {property.status === "available" && !property.rentPrice && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                      Sale
                    </div>
                  )}
                  {property.status === "rented" && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                      Rented
                    </div>
                  )}
                  <button 
                    onClick={() => toggleWishlist(property)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <Heart 
                      size={18} 
                      className={isInWishlist(property._id) ? "fill-red-500 text-red-500" : "text-gray-500"} 
                    />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-medium">
                    {property.status === "available" ? (
                      property.rentPrice ? `$${property.rentPrice}/month` : `$${property.sellPrice}`
                    ) : (
                      <span className="text-gray-500">{property.status}</span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={14} className="mr-1" />
                      {`${property.city}, ${property.state}, ${property.country}`}
                    </div>
                    <div className="ml-auto flex items-center">
                      <Star size={14} className="text-[#F5C34B] fill-[#F5C34B]" />
                      <span className="ml-1 text-sm font-medium">{property.category}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-3 line-clamp-1">{property.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {property.roomCount && (
                      <div className="flex items-center">
                        <BedDouble size={16} className="mr-1" />
                        {property.roomCount} {property.roomCount === 1 ? 'Room' : 'Rooms'}
                      </div>
                    )}
                    <div>
                      {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : 'Unknown'}
                    </div>
                  </div>
                  <Link to={`/property/${property._id}`}>
                  <button className="w-full py-2 border border-[#1F4B43] text-[#1F4B43] rounded-md hover:bg-[#1F4B43] hover:text-white transition-colors font-medium">
                    View Details
                  </button>
                  </Link>
                </div>
              </div>
  )
}

export default PropertyCard