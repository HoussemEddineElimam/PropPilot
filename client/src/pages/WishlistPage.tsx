import { useState, useEffect } from 'react';
import { Heart, Trash2, Filter, Search, X } from 'lucide-react';
import WishListPropertyCard from '../components/WishListPropertyCard';
import { useWishlist } from '../hooks/useWishlist';
import DropDownField from '../components/dropdown field/DropDownField';
import SearchBar from '../components/search_bar/Searchbar';

const WishlistPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: '',
    location: '',
  });

  const { clearWishlist, wishlistItems } = useWishlist();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleFilterChange = (event: { target: { name: string; value: string } }) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      propertyType: '',
      priceRange: '',
      location: '',
    });
    setSearchQuery('');
  };

  const filteredItems = wishlistItems.filter((item) => {
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (filters.propertyType && item.category !== filters.propertyType) {
      return false;
    }
    if (filters.location && !item.location.includes(filters.location)) {
      return false;
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      const price = item.rentPrice || item.sellPrice || 0;

      if (price < min || (max && price > max)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/*Search and Filters */}
        <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 ${filterOpen ? 'block' : 'hidden'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filter Properties</h2>
            <button
              onClick={() => setFilterOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/*Search Bar */}
            <div className="relative">
              <SearchBar
                placeholder="Search by name or location"
                onSearch={(query) => setSearchQuery(query)}
              />
            </div>

            {/*Property Type Dropdown */}
            <DropDownField
              options={[
                { value: '', label: 'Property Type' },
                { value: 'apartment', label: 'Apartment' },
                { value: 'house', label: 'House' },
                { value: 'villa', label: 'Villa' },
                { value: 'studio', label: 'Studio' },
                { value: 'suite', label: 'Hotel Suite' },
              ]}
              selected={filters.propertyType}
              onChange={(value) => handleFilterChange({ target: { name: 'propertyType', value } })}
            />

            {/*Price Range Dropdown */}
            <DropDownField
              options={[
                { value: '', label: 'Price Range' },
                { value: '0-1000', label: '$0 - $1,000' },
                { value: '1000-2000', label: '$1,000 - $2,000' },
                { value: '2000-5000', label: '$2,000 - $5,000' },
                { value: '5000-10000', label: '$5,000 - $10,000' },
                { value: '10000-', label: '$10,000+' },
              ]}
              selected={filters.priceRange}
              onChange={(value) => handleFilterChange({ target: { name: 'priceRange', value } })}
            />

            {/*Location Dropdown */}
            <DropDownField
              options={[
                { value: '', label: 'Location' },
                { value: 'Alger', label: 'Alger' },
                { value: 'Oran', label: 'Oran' },
                { value: 'Bilda', label: 'Bilda' },
              ]}
              selected={filters.location}
              onChange={(value) => handleFilterChange({ target: { name: 'location', value } })}
            />
          </div>

          {/*Filter Actions */}
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
            >
              Reset
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="px-4 py-2 bg-[#1F4B43] text-white rounded-md hover:bg-[#183832] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F4B43]"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Heart size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save properties you like to your wishlist for easy access later.</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-[#1F4B43] text-white rounded-md hover:bg-[#183832] transition-colors"
            >
              Browse Properties
            </a>
          </div>
        ) : (
          <>
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">No matching properties</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={resetFilters}
                  className="inline-block px-6 py-3 bg-[#1F4B43] text-white rounded-md hover:bg-[#183832] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((property) => (
                  <WishListPropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;