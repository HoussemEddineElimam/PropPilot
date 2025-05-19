import {useState } from 'react';
import Sidebar from '../OwnerComponents/Sidebar';
import Header from '../OwnerComponents/Header';
import { Outlet } from 'react-router-dom';

const OwnerLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;