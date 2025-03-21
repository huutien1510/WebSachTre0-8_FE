import React, { useEffect, useRef, useState } from 'react'
import BookCard from '../BookSlider/BookCard'

const FreeBook = () => {
    const [books, setBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const inputRef = useRef(null);
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchBooks = async (page) => {
            try {
                if (inputRef.current) inputRef.current.value = page;
                const response = await fetch(`${baseURL}/books/freebooks?page=${page - 1}&limit=10`)
                const json = await response.json()
                setBooks(json.data.content)
                setTotalPages(json.data.totalPages)
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }, 200);
            } catch (error) {
                console.error("Error fetching free books:", error)
            }
        }
        fetchBooks(currentPage)
    }, [currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page);

    };

    return (
        <div className='container mx-auto pt-24 bg-black px-8 w-full'>
            <h1 className='text-2xl md:text-3xl font-bold text-white mb-8'>Sách miễn phí</h1>

            <div className='grid grid-cols-2 pt-2 pb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6'>
                {books?.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>

            <div className="flex items-center justify-center mt-10 mb-10 ">
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
    )
}

export default FreeBook