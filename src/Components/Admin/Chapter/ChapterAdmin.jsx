import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import BookCard from "../Book/BookCard.jsx";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function ChapterAdmin() {
  const navigate = useNavigate();
  const handleEditBook = (book) => {
    navigate(`book/${book.id}`, { state: { book: book } });
  };
  const [books, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef(null);
  useEffect(() => {
    const fecthBook = async (page) => {
      try {
        if (inputRef.current) inputRef.current.value = page;
        const response = await fetch(
          `http://localhost:8080/books/getAll?page=${page - 1}&limit=15`
        );
        const json = await response.json();
        setBook(json.data.content);
        setTotalPages(json.data.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fecthBook(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className=" py-5 px-3 md:px-5">
      <div className="container mx-auto">
        {/* Tiêu đề */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#18B088] text-lg font-semibold">
            Tất cả sách
          </span>
        </div>
        <div className="space-y-4">
          {books?.map((book) => (
            <div
              key={book.id}
              className="flex items-center bg-gray-800 p-3 rounded-md shadow-md hover:shadow-lg transition duration-200"
            >
              <img
                src={book.thumbnail}
                alt={book.name}
                className="w-16 h-24 object-cover rounded-md mr-3"
              />

              {/* Thông tin sách */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#34D399] line-clamp-1">
                  {book.name}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-1">
                  Tác giả: {book.author}
                </p>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                  {book.description}
                </p>
              </div>

              <button
                className="flex items-center mb-4 justify-center mt-1 text-white px-5 py-2.5 rounded-lg text-lg font-bold transition-colors bg-[#18B088] hover:bg-[#148F70]"
                onClick={() => handleEditBook(book)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="3" y="4" width="12" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M14 3l5 5-10 10H6v-3l10-10z" />
                  <path d="M5 9h8M5 12h8M5 15h8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Edit Chapter
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center mt-10 ">
          <button
            className="px-4 py-2 bg-[#34D399] text-black font-bold rounded-lg hover:bg-[#34D399]/90 transition-all duration-300 shadow-lg hover:shadow-[#34D399]/50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-bold bg-gray-900 mx-4 px-4 py-2 border-2 border-[#34D399] text-[#34D399] font-bold rounded-lg hover:bg-[#34D399]/10 transition-all duration-300">
            Page
            <input
              className="mx-4 w-16 text-center p-1 w-10 border border-[#34D399] rounded"
              ref={inputRef}
              type="number"
              name="price"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target.value > totalPages) ? totalPages : ((e.target.value < 1) ? 1 : e.target.value)
                  handlePageChange(value);
                }
              }}
            />
            of {totalPages}{" "}
          </span>
          <button
            className="px-4 py-2 bg-[#34D399] text-black font-bold rounded-lg hover:bg-[#34D399]/90 transition-all duration-300 shadow-lg hover:shadow-[#34D399]/50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChapterAdmin;
