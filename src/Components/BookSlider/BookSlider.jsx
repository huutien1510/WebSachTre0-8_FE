import BookCard from "./BookCard.jsx";
import { useState, useEffect, useRef } from "react";
function BookSlider() {

  const [books, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef(null);

  useEffect(() => {
    const fecthBook = async (page) => {
      try {
        if (inputRef.current) inputRef.current.value = page;
        const response = await fetch(`http://localhost:8080/books/getAll?page=${page - 1}&size=15`);
        const json = await response.json();
        console.log(json)
        setBook(json.data.content);
        setTotalPages(json.data.totalPages);
        setTimeout(() => {
          window.scrollTo({ top: 450, behavior: "smooth" });
        }, 200);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fecthBook(currentPage)
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);

  };

  return (
    <div className="bg-black py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Sách hot
          </h2>
          <button className="text-[#18B088] hover:opacity-80 font-medium transition-opacity">
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {books?.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
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
          of {totalPages} </span>
        <button
          className="px-4 py-2 bg-[#34D399] text-black font-bold rounded-lg hover:bg-[#34D399]/90 transition-all duration-300 shadow-lg hover:shadow-[#34D399]/50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div >
  );
}

export default BookSlider;
