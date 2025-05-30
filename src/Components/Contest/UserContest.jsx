import React, { useEffect, useRef, useState } from 'react';
import UserContestCard from './UserContestCard';
import { NavLink, useLocation } from 'react-router-dom';

const UserContest = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const inputRef = useRef(null);
    const [contests, setContests] = useState(null);
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fecthContest = async (page) => {
            try {
                if (inputRef.current) inputRef.current.value = page;
                const response = await fetch(`${baseURL}/contests/getAll?page=${page - 1}&size=9`);
                const json = await response.json();
                setContests(json.data.content);
                setTotalPages(json.data.totalPages);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fecthContest(currentPage)
    }, [currentPage, location]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-black py-8 px-4 md:px-8 mt-16 mx-auto">
            <div className="container mx-auto">

                <h1 className='text-2xl md:text-3xl font-bold text-white mb-10'>Tất cả cuộc thi</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {contests?.map((contest) => (
                        <UserContestCard key={contest.id} contest={contest} />
                    ))}
                </div>
            </div>

            {/* Phân trang */}
            <div>
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
                            name="page"
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
        </div>
    );
};

export default UserContest;
