import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Home } from 'lucide-react';
import { Property } from '../models/Property';
import { Booking } from '../models/Booking';
import PropertyService from '../services/PropertyService';
import BookingService from '../services/BookingService';


const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const getMonthName = (month: number) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  return d >= start && d <= end;
};

export default function OccupancyCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [show, setShow] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesData, bookingsData] = await Promise.all([
          PropertyService.getAll(),
          BookingService.getAll()
        ]);
        setProperties(propertiesData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  const getBookingsForDay = (day: number, propertyId: string) => {
    const date = new Date(currentYear, currentMonth, day);
    return bookings.filter(booking => 
      (propertyId === 'all' || booking.propertyId === propertyId) && 
      isDateInRange(date, booking.checkInDate, booking.checkOutDate)
    );
  };

  //Calculate occupancy rate for the current month
  const calculateOccupancyRate = (propertyId: string) => {
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    let occupiedDays = 0;
    let totalDays = 0;
    
    //Filter bookings for the selected property or all properties
    const relevantProperties = propertyId === 'all' 
      ? properties 
      : properties.filter(p => p._id === propertyId);
      
    //Calculate total possible days (days in month * number of properties)
    totalDays = daysInCurrentMonth * relevantProperties.length;
    
    if (totalDays === 0) return 0;
    
    //For each day in the month, check if there are bookings
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      relevantProperties.forEach(property => {
        const dayBookings = getBookingsForDay(day, property._id);
        if (dayBookings.some(booking => booking.status === 'confirmed' || booking.status === 'pending')) {
          occupiedDays++;
        }
      });
    }
    
    return Math.round((occupiedDays / totalDays) * 100);
  };

  //Get filtered bookings based on the selected property
  const filteredBookings = bookings.filter(booking => 
    selectedProperty === 'all' || booking.propertyId === selectedProperty
  );
  
  //Generate calendar days array (including empty days for proper grid alignment)
  const calendarDays = [...Array(firstDayOfMonth).fill(null), ...Array(daysInMonth).keys()].map((day, index) => {
    if (day === null) return null;
    return index - firstDayOfMonth + 1;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className={`space-y-6 opacity-0 transform translate-y-5 transition-all duration-500 ease-out ${
      show ? 'opacity-100 translate-y-0' : ''
    }`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Occupancy Calendar
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View and manage your property bookings
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
            >
              <option value="all">All Properties</option>
              {properties.map(property => (
                <option key={property._id} value={property._id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {getMonthName(currentMonth)} {currentYear}
            </h4>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-t-lg">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-b-lg">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="bg-gray-100 dark:bg-gray-800 h-24 p-1"></div>
                  );
                }
                
                const date = new Date(currentYear, currentMonth, day);
                const isToday = date.toDateString() === today.toDateString();
                const dayBookings = selectedProperty === 'all'
                  ? properties.flatMap(property => getBookingsForDay(day, property._id))
                  : getBookingsForDay(day, selectedProperty);
                
                const hasConfirmed = dayBookings.some(booking => booking.status === 'confirmed');
                const hasPending = dayBookings.some(booking => booking.status === 'pending');
                
                return (
                  <div 
                    key={`day-${day}`} 
                    className={`bg-white dark:bg-gray-800 h-24 p-1 relative ${
                      isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400 z-10' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${
                        isToday 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {day}
                      </span>
                      
                      {dayBookings.length > 0 && (
                        <div className={`w-3 h-3 rounded-full ${
                          hasConfirmed 
                            ? 'bg-green-500' 
                            : hasPending 
                              ? 'bg-yellow-500' 
                              : 'bg-gray-300 dark:bg-gray-600'
                        }`}></div>
                      )}
                    </div>
                    
                    <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                      {selectedProperty === 'all' ? (
                        //Group bookings by property for "All Properties" view
                        properties.map(property => {
                          const propertyBookings = getBookingsForDay(day, property._id);
                          if (propertyBookings.length === 0) return null;
                          
                          return (
                            <div 
                              key={`${day}-${property._id}`}
                              className="text-xs px-1 py-0.5 rounded truncate"
                              style={{
                                backgroundColor: propertyBookings[0].status === 'confirmed' 
                                  ? 'rgba(16, 185, 129, 0.2)' 
                                  : 'rgba(245, 158, 11, 0.2)',
                                color: propertyBookings[0].status === 'confirmed'
                                  ? 'rgb(6, 95, 70)'
                                  : 'rgb(146, 64, 14)'
                              }}
                            >
                              {property.name.length > 10 
                                ? `${property.name.substring(0, 10)}...` 
                                : property.name}
                            </div>
                          );
                        })
                      ) : (
                        //Show guest details for single property view
                        dayBookings.map(booking => (
                          <div 
                            key={`${day}-${booking._id}`}
                            className="text-xs px-1 py-0.5 rounded truncate flex items-center"
                            style={{
                              backgroundColor: booking.status === 'confirmed' 
                                ? 'rgba(16, 185, 129, 0.2)' 
                                : 'rgba(245, 158, 11, 0.2)',
                              color: booking.status === 'confirmed'
                                ? 'rgb(6, 95, 70)'
                                : 'rgb(146, 64, 14)'
                            }}
                          >
                            <Users size={10} className="mr-1" />
                            {booking.clientId.length > 10 
                              ? `${booking.clientId.substring(0, 10)}...` 
                              : booking.clientId}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/*Occupancy Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Monthly Occupancy Statistics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CalendarIcon size={18} className="text-blue-500 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Occupancy Rate
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {calculateOccupancyRate(selectedProperty)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${calculateOccupancyRate(selectedProperty)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Home size={18} className="text-green-500 dark:text-green-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Properties
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {selectedProperty === 'all' ? properties.length : 1}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Users size={18} className="text-purple-500 dark:text-purple-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Bookings
                </span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {filteredBookings.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}