import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:px-4">
            <div>
              <div className="flex items-center gap-2 mb-6">
                
                <span className="text-xl font-bold">PropPilot</span>
              </div>
              <p className="text-gray-600 mb-6">
                Finding your perfect home has never been easier. Browse thousands of listings and find your dream property.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-[#1F4B43] transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-[#1F4B43] transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-[#1F4B43] transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-500 hover:text-[#1F4B43] transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#1F4B43] transition-colors">Home</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin size={20} className="text-[#1F4B43] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">123 Real Estate Avenue, Blida, Algeria</span>
                </li>
                <li className="flex items-center">
                  <Phone size={20} className="text-[#1F4B43] mr-3 flex-shrink-0" />
                  <span className="text-gray-600">+213 660 67 79 37</span>
                </li>
                <li className="flex items-center">
                  <Mail size={20} className="text-[#1F4B43] mr-3 flex-shrink-0" />
                  <span className="text-gray-600">houssem@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/*Copyright */}
      <div className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} PropPilot. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-[#1F4B43] text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-[#1F4B43] text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-[#1F4B43] text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;