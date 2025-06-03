import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../BookSlider/BookCard";
import { Search } from 'lucide-react'

const SearchPage = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const query = new URLSearchParams(location.search).get("keyword");
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchResults = async (page) => {
      try {
        if (inputRef.current) inputRef.current.value = page;
        const response = await fetch(`${baseURL}/books/search?keyword=${query}&page=${page - 1}&size=10`);
        const data = await response.json();
        console.log("data", data);
        if (response.ok) {
          setSearchResults(data.data.content);
          setTotalPages(data.data.totalPages);
        } else {
          setSearchResults([]);
        }
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    if (query) fetchResults(currentPage);
  }, [currentPage, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [location])


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto pt-24 bg-black px-8">
      <h1 className="text-xl font-medium text-white mb-8"> Kết quả tìm kiếm cho từ "{query}"</h1>

      <div className={`${searchResults.length <= 0 && 'hidden'} mb-10`}>
        <div className="grid grid-cols-2 pt-2 pb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {searchResults?.map((book) => (
            <BookCard key={book.id} book={book} on />
          ))}
        </div>
        <div className="flex items-center justify-center mt-10 mb-10">
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
            of {totalPages} </span>
          <button
            className="px-4 py-2 bg-[#34D399] text-black font-bold rounded-lg hover:bg-[#34D399]/90 transition-all duration-300 shadow-lg hover:shadow-[#34D399]/50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <div className={`${searchResults.length > 0 && 'hidden'} flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg bg-black p-8 text-white`}>
        <div className="rounded-lg border-2 border-white/20 p-6">
          <Search className="h-8 w-8 text-white/80" />
        </div>
        <div className="text-center">
          <h2 className="mb-2 text-xl font-medium">Không tìm thấy kết quả nào liên quan</h2>
          <p className="text-sm text-white/60">
            Bạn vui lòng thay đổi từ khóa, giá trị lọc phù hợp
          </p>
        </div>
      </div>

    </div>
  );
};

export default SearchPage;
