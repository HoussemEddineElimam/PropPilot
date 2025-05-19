import { Outlet } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
import Footer from "../ClientComponents/Footer";
import Navbar from "../ClientComponents/Navbar";

interface ClientLayoutProps {
  home?: boolean;
}

const ClientLayout = ({ home = false }: ClientLayoutProps) => {
  const [isNavbarTransparent, setIsNavbarTransparent] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {

    const handleScroll = () => {
      if (ref.current) {
        const scrollY = ref.current.scrollTop;
        if (scrollY > 60) {
          setIsNavbarTransparent(false);
        } else {
          setIsNavbarTransparent(true);
        }
      }
    };

    if (ref.current) {
      ref.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="font-sans h-screen w-screen overflow-hidden">
      <Navbar home={home} isTransparent={isNavbarTransparent} />
      <div ref={ref} className="h-full overflow-x-hidden overflow-y-auto">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default ClientLayout;