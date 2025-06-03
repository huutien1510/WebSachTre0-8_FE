import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../../api/apiRequest";


const DesktopMenu = ({ menuItems }) => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [openedMenus, setOpenedMenus] = useState({});
  const inputRef = useRef(null);
  const cartItemsCount = useSelector(state => state?.cart?.carts?.cartItems?.length);

  const accessToken = useSelector(
    (state) => state.auth.login.currentUser?.data?.accessToken
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(dispatch, navigate, accessToken, user);
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = (keyword) => {
    if (keyword.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  // Use debounced search function
  const debouncedSearch = useCallback(debounce(performSearch, 1000), []);

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchText(keyword);
    debouncedSearch(keyword);
  };

  const handleSearchClick = () => {
    setShowSearch((prev) => !prev);
    if (!showSearch) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setShowSearch(false);
      setSearchText("");
    }
  }, [location.pathname]);


  const toggleMenu = (menuName) => {
    setOpenedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleCart = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  }

  return (
    <div className="hidden md:flex items-center space-x-4 relative">
      {/* Wrapper for menu and search */}
      <div className={`flex items-center transition-all duration-300 ${showSearch ? "mr-56" : "mr-0"}`}>
        {/* Menu Items */}
        {
          menuItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.subMenu ? (
                <div>
                  <button
                    className="text-gray-300 hover:text-emerald-400 px-1 py-2 text-sm font-bold tracking-wide flex items-center"
                    onClick={() => toggleMenu(item.name)}
                  >
                    {item.name}
                    <span className="ml-1">
                      {openedMenus[item.name] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 15.75 7.5-7.5 7.5 7.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                  {/* SubMenu */}
                  {openedMenus[item.name] && (
                    <div className="absolute left-[-80px] bg-gradient-to-r from-black to-gray-800 backdrop-blur-md bg-opacity-60 border border-gray-700 rounded-md shadow-lg mt-1">
                      <ul className="py-2 grid grid-cols-4 gap-4 px-4 min-w-max">
                        {item.subMenu.map((subItem) => (
                          <li key={subItem.id}>
                            <NavLink
                              to={`/genre/${subItem.id}`}
                              state={{ genre: subItem }}
                              className="block px-4 py-2 text-gray-300 hover:text-emerald-400 hover:bg-gray-700 hover:rounded-xl"
                              onClick={() => setOpenedMenus({})}
                            >
                              {subItem.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                  )}
                </div>
              ) : (
                <NavLink
                  to={item.href}
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 text-sm font-bold tracking-wide"
                >
                  {item.name}
                </NavLink>
              )}
            </div>
          ))}
      </div>

      {/* Search Section */}
      <div className="relative flex items-center">
        {/* Search Input */}
        <div
          className={`absolute top-[-10px] right-0 transition-all duration-300 ease-in-out ${showSearch ? "w-64 opacity-100" : "w-0 opacity-0"
            }`}
          style={{ overflow: "hidden" }}
        >
          <div className="relative">
            <input
              type="search"
              placeholder="Nhập tên sách, tác giả..."
              value={searchText}
              onChange={handleSearchChange} // Debounced search
              className="py-2 pl-4 pr-10 bg-gray-800 text-white rounded-2xl w-full"
              ref={inputRef}
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className="text-white hover:text-emerald-500 focus:outline-none relative z-10 mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      {/* Auth Buttons */}
      {user ? (
        <>
          <Link to="/account/profile" className="text-emerald-500 text-sm">
            Hi, <span>{user?.data?.account?.username}</span>
          </Link>
          <NavLink
            className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-emerald-600 transition-colors"
            onClick={handleLogout}
          >
            Đăng xuất
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to={"/register"}>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-emerald-600 transition-colors">
              Đăng ký
            </button>
          </NavLink>

          <NavLink to={"/login"}>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-emerald-600 transition-colors">
              Đăng nhập
            </button>
          </NavLink>
        </>
      )}
      <div className="relative cursor-pointer" onClick={handleCart}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <div className="absolute text-[10px] font-bold text-black top-5 right-[-2px] rounded-full bg-yellow-400 w-4 h-4 flex justify-center items-center">
          {user ? cartItemsCount : 0}
        </div>

      </div>
    </div>
  );
};

export default DesktopMenu;
