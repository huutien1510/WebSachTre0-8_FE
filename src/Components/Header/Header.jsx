import { useEffect, useState } from "react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [genre, setGenre] = useState([])

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/genre`);
        const json = await response.json();
        setGenre(json.genres
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchGenre();
  }, []);

  const menuItems = [
    { name: "Thể loại ", subMenu: genre.map((item) => ({ name: item.name, id: item._id })), },
    { name: "Sách miễn phí", href: "/free-book" },
    { name: "Sách tính phí", href: "/fee-book" },
  ];

  console.log(menuItems);

  return (
    <nav className="bg-black/50 backdrop-blur-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to={"/"} className="flex-shrink-0">
            <span className="text-emerald-400 text-2xl font-bold">MANGACOMIC</span>
          </NavLink>

          {/* Desktop Menu */}
          <DesktopMenu menuItems={menuItems} />

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && <MobileMenu menuItems={menuItems} />}
    </nav>
  );
};

export default Header;
