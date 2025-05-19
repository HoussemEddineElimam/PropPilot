import { useRef, useState, useEffect } from "react";
import { Filter, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import DropDownField from "../components/dropdown field/DropDownField";
import SearchBar from "../components/search_bar/Searchbar";
import PropertyCard from "../components/PropertyCard";
import CategoryCard from "../components/CategoryCard";
import { propertyCategories } from "../utils/data";
import PropertyService from "../services/PropertyService";
import { Property } from "../models/Property";
import useAuthStore from "../hooks/useAuthStore";
import UserService from "../services/UserService";
import { redirect } from "react-router-dom";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [whereFilter, setWhereFilter] = useState("");
  const [whenFilter, setWhenFilter] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading] = useState(true);
  const {user , setTOwner} = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch properties from API on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await PropertyService.getAll();
        if(!user)
        setProperties(data);
        else
        setProperties(data.filter((property) => property.ownerId !== user._id));
        setDisplayedProperties(data.slice(0, visibleCount));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError("Failed to load properties. Please try again later.");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on activeTab
  useEffect(() => {
    let filteredProperties = properties;
    
    // Apply tab filter
    if (activeTab === "Rent") {
      filteredProperties = properties.filter(property => property.type === "rented_real_estate");
    } else if (activeTab === "Buy") {
      filteredProperties = properties.filter(property => property.type === "real_estate");
    } else if (activeTab === "Hotel Booking") {
      filteredProperties = properties.filter(property => property.type === "hotel");
    }else{
      filteredProperties = properties;
    }
    
    setDisplayedProperties(filteredProperties.slice(0, visibleCount));
  }, [activeTab, properties, visibleCount]);

  const loadMoreProperties = () => {
    const nextCount = visibleCount + 9;
    setVisibleCount(nextCount);
    
    // Apply current filters when loading more
    let filteredProperties = properties;
    if (activeTab === "Rent") {
      filteredProperties = properties.filter(property => property.type === "rented_real_estate");
    } else if (activeTab === "Buy") {
      filteredProperties = properties.filter(property => property.type === "real_estate");
    } else if (activeTab === "Hotel Booking") {
      filteredProperties = properties.filter(property => property.type === "hotel");
    }
    
    
    setDisplayedProperties(filteredProperties.slice(0, nextCount));
  };
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    let filteredProperties = properties;
    
    if (activeTab === "Rent") {
      filteredProperties = properties.filter(property => property.type === "rented_real_estate");
    } else if (activeTab === "Buy") {
      filteredProperties = properties.filter(property => property.type === "real_estate");
    } else if (activeTab === "Hotel Booking") {
      filteredProperties = properties.filter(property => property.type === "hotel");
    }
    
    // Apply search query filter (search in title and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredProperties = filteredProperties.filter(
        property => 
          property.name?.toLowerCase().includes(query) || 
          property.description?.toLowerCase().includes(query)
      );
    }
    
    if (whereFilter) {
      filteredProperties = filteredProperties.filter(
        property => property.state?.toLowerCase().includes(whereFilter.toLowerCase())
      );
    }
    
    setDisplayedProperties(filteredProperties.slice(0, visibleCount));
    
    console.log({ searchQuery, whereFilter, whenFilter });
  };

  return (
    <div className="w-full">
      <section className="relative w-full bg-white px-4 md:px-8 lg:px-16 pt-24 pb-16">
        <img
          src="./hero.png"
          alt="Hero"
          className="absolute left-[25vw] w-auto h-[90%]"
          loading="lazy" 
          onError={(e) => (e.currentTarget.src = "./")}
        />
        <div className="relative w-full min-h-screen flex items-center justify-center">
          <div className="w-full bg-opacity-90 p-8 rounded-lg">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Find Your <span className="text-[#F5C34B]">Perfect</span> Place <br />
              With <span className="text-[#F5C34B]">Best</span> Price
            </h1>
            <p className="text-gray-600 mb-8 max-w-lg">
              Discover your dream home from thousands of properties. We make finding the perfect place simple and stress-free.
            </p>
            <div className="flex border-b border-gray-200 mb-6">
              {["All","Rent", "Hotel Booking", "Buy"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-medium transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-[#F5C34B] text-black"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-6 bg-white p-2 rounded-lg shadow-md">
              <SearchBar placeholder="Search..." onSearch={setSearchQuery} />
              <DropDownField
                label="Where ?"
                options={[
                  { value: "alger", label: "Alger" },
                  { value: "bilda", label: "Bilda" },
                  { value: "oran", label: "Oran" },
                ]}
                selected={whereFilter}
                onChange={setWhereFilter}
              />
              <DropDownField
                label="When ?"
                options={[
                  { value: "today", label: "Today" },
                  { value: "tomorrow", label: "Tomorrow" },
                  { value: "next-week", label: "Next Week" },
                ]}
                selected={whenFilter}
                onChange={setWhenFilter}
              />
              <button
                type="submit"
                className="bg-[#1F4B43] text-white py-2 px-4 rounded-md hover:bg-[#183832] transition-colors flex items-center justify-center"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>
      <div className="bg-white py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Featured Categories</h2>
          <p className="text-gray-500 mb-8">Explore our most popular property types</p>
          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute left-[30%] md:left-[40%] lg:left-[45%] bg-[#1F4B43] -bottom-[39%] -translate-y-1/2 z-10 backdrop-blur-md rounded-full shadow-lg p-3 transition-all duration-200 border border-gray-200 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-2"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-[35%] md:right-[40%] lg:right-[45%] bg-[#1F4B43] -bottom-[39%] -translate-y-1/2 z-10 backdrop-blur-md rounded-full shadow-lg p-3 transition-all duration-200 border border-gray-200 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-2"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide snap-x scroll-smooth gap-4 py-4 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {propertyCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Discover The Best Deals</h2>
              <p className="text-gray-500">Find your perfect place from our curated listings</p>
            </div>
            <button 
              className="flex items-center gap-2 px-4 py-2 mt-4 md:mt-0 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => {
                // Reset filters and reload properties
                setSearchQuery("");
                setWhereFilter("");
                setWhenFilter("");
                setDisplayedProperties(properties.slice(0, visibleCount));
              }}
            >
              <Filter size={18} />
              Reset Filters
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F4B43]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#1F4B43] text-white rounded-md hover:bg-[#183832]"
              >
                Retry
              </button>
            </div>
          ) : displayedProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-medium">No properties found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {!loading && !error && visibleCount < properties.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMoreProperties}
                className="px-6 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
              >
                View All Properties
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
     {user?.role === "client" && (
  <div className="bg-white py-16 px-4 md:px-8 lg:px-16">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {[
          {
            title: "Want to rent your home?",
            description: "10 new offers every day. 300 offers on site, trusted by a community of thousands of users.",
            image: "./rent.png",
          },
          {
            title: "Want to sell your home?",
            description: "10 new offers every day. List your home for sale and find the best offers.",
            image: "./sell.png",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-[#f8fbff] to-[#f0f7ff] p-8 rounded-2xl flex items-center gap-6 shadow-sm"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-6">{item.description}</p>
              <button
                onClick={async () => {
                  try {
                    await UserService.update(user._id, { role: "owner" });
                    setTOwner?.(); // Optional chaining in case not defined
                    await redirect("/");
                  } catch (error) {
                    console.error("Error updating role:", error);
                  }
                }}
                className="bg-[#1F4B43] text-white py-3 px-6 rounded-md hover:bg-[#183832] transition-colors flex items-center gap-2 font-medium"
              >
                Get Started
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="hidden md:block">
              <img
                src={item.image}
                alt="House illustration"
                className="w-32 h-32 object-cover rounded-xl shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        ))}

      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default HomePage;