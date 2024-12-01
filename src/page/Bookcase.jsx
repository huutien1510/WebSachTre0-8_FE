import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavoriteBooks } from "../api/apiRequest.js";
import { Link } from "react-router-dom";

function Bookcase() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.data.accessToken;
  const accountId = user?.data.account.id;

  const [activeTab, setActiveTab] = useState("favorite");
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (accountId && accessToken) {
          if (activeTab === "favorite") {
            const response = await getFavoriteBooks(
              accountId,
              currentPage,
              limit,
              dispatch,
              user,
              accessToken
            );
            setFavoriteBooks(response.data);
            // setTotalPages(response.data.pagination.totalPages);
          } else {
            try {
              const response = await fetch(`http://localhost:8080/readinghistory/account/${accountId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`
                }
              });
              const json = await response.json();
              console.log(json)
              setReadBooks(json.data);
              setTotalPages(json.totalPages);
            } catch (error) {
              console.error("Lỗi khi thêm sách:", error.message);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [accountId, accessToken, dispatch, user, currentPage, activeTab]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const bookList = activeTab === "favorite" ? favoriteBooks : readBooks;

  return (
    <div className="min-h-screen bg-black ">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === "favorite"
              ? "bg-[#119F7B] text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            onClick={() => {
              setActiveTab("favorite");
              setCurrentPage(1);
            }}
          >
            Sách yêu thích
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === "read"
              ? "bg-[#119F7B] text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            onClick={() => {
              setActiveTab("read");
              setCurrentPage(1);
            }}
          >
            Sách đã đọc
          </button>
        </div>

        {/* Book Grid */}
        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-2 lg:gap-2">
          {activeTab === 'favorite' && bookList?.map((item) => (
            <Link
              to={`/book/${item.id}/chaptercontent/${1}`}
              state={{ bookName: item.name }}
              key={item.id}
              className="group cursor-pointer"
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200 relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <div className="p-2">
                  <h3
                    className="text-white group-hover:text-[#119F7B] transition-colors"
                    style={{ fontSize: "13px", fontWeight: "bold" }}
                  >
                    {truncateText(item.name, 13)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
          {activeTab === 'read' && bookList?.map((item) => (
            <Link
              to={`/book/${item.bookID}/chaptercontent/${item?.chapterNumber}`}
              state={{ bookName: item.bookName }}
              key={item.chapterID}
              className="group cursor-pointer"
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200 relative">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.bookName}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <div className="absolute flex items-center justify-center bg-black w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-base font-bold">Đọc tiếp chapter {item.chapterNumber}</span>
                </div>
                <div className="p-2">
                  <h3
                    className="text-white group-hover:text-[#119F7B] transition-colors"
                    style={{ fontSize: "13px", fontWeight: "bold" }}
                  >
                    {truncateText(item.bookName, 13)}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded ${currentPage === page
                  ? "bg-[#119F7B] text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookcase;
