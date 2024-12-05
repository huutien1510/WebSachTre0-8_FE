import React, { useEffect, useRef, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdOutlineDateRange } from 'react-icons/md';
import { NavLink, useLocation } from 'react-router-dom';

function UserBlog() {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const inputRef = useRef(null);
    const [listArticles, setListArticles] = useState([]);

    useEffect(() => {
        const fecthContest = async (page) => {
            try {
                if (inputRef.current) inputRef.current.value = page;
                const response = await fetch(`http://localhost:8080/articles/getAll?page=${page - 1}&size=9`);
                const json = await response.json();
                setListArticles(json.data.content);
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
        <div className="bg-black py-8 px-4 md:px-8 ">
            <div className="container mx-auto mt-12">
                {/* Header Navigation */}
                <h1 className='text-2xl md:text-3xl font-bold text-white mb-8'>Tin mới nhất</h1>
                {/* Main Content */}
                <main className="container mx-auto pt-8">
                    {/* hàng 1 */}
                    <div className="flex justify-center gap-8">
                        {/* khung lớn */}
                        {listArticles[0] && (
                            <div className="w-[90%]">
                                <NavLink
                                    // // to={`/tin-tuc/${formatTitleForUrl(posts[0].title)}`}
                                    // state={{ postId: posts[0].postId }}
                                    className="cursor-pointer"
                                >
                                    <div className="w-full h-[374px] max-h-[374px]">
                                        <img
                                            // src={`${IMAGE_URL}${posts[0].image}`}
                                            alt={listArticles[0].title}
                                            className="w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-2xl"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="mt-12 flex flex-col gap-4">
                                        <h2 className="text-5xl font-bold">{listArticles[0].title}</h2>
                                        <p
                                            className="line-clamp-3 overflow-hidden text-ellipsis"
                                            dangerouslySetInnerHTML={{ __html: listArticles[0].content }}
                                        ></p>

                                        <span className="flex items-center font-semibold gap-2">
                                            <MdOutlineDateRange />
                                            <span>{22 / 11 / 2020}</span>
                                            <span> - </span>
                                            <span>Bài</span>
                                        </span>
                                    </div>
                                    <button className="flex items-center text-3xl mt-4 font-semibold text-blue-500">
                                        Xem tiếp
                                        <FaArrowRightLong className="ml-2" />
                                    </button>
                                </NavLink>
                            </div>
                        )}

                        {/* 5 khung nhỏ */}
                        <div className="flex flex-col gap-4">
                            {listArticles?.slice(1, 6).map((articles) => (
                                <div key={articles.id} className="pb-4 mb-4">
                                    <NavLink
                                        // // to={`/tin-tuc/${formatTitleForUrl(post.title)}`}
                                        // state={{ postId: post.postId }}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex gap-4">
                                            <div className="min-w-[160px] min-h-[100px]">
                                                <img
                                                    // src={`${IMAGE_URL}${post.image}`}
                                                    alt={articles.title}
                                                    className="w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-2xl"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 font-semibold">
                                                <h3>{articles.title}</h3>
                                                <p className="flex items-center text-xl gap-2">
                                                    <MdOutlineDateRange />
                                                    <span>{22 / 22 / 2222}</span>
                                                    <span>-</span>
                                                    <span>MANGACOMIC</span>
                                                </p>
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* hàng 2 */}
                    <div className="flex flex-wrap px-6 gap-24 mt-20">
                        {listArticles?.slice(6).map((articles) => (
                            <div key={articles.id} className="max-w-lg pb-4 mb-4">
                                <NavLink
                                    // to={`/tin-tuc/${formatTitleForUrl(post.title)}`}
                                    // state={{ postId: post.postId }}
                                    className="cursor-pointer"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="w-[320px] h-[200px] overflow-hidden">
                                            <img
                                                // src={`${IMAGE_URL}${post.image}`}
                                                alt={articles.title}
                                                className="w-full h-full object-cover rounded-2xl"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <h3 className="text-3xl font-bold">{articles.title}</h3>
                                            <p
                                                className="line-clamp-2 overflow-hidden text-ellipsis"
                                                dangerouslySetInnerHTML={{ __html: articles.content }}
                                            ></p>
                                            <p className="flex items-center text-xl gap-2">
                                                <MdOutlineDateRange />
                                                <span>{articles.date}</span>
                                                <span> - </span>
                                                <span>MANGACOMIC</span>
                                            </p>
                                        </div>
                                        <button className="flex items-center font-semibold text-blue-500">
                                            Xem tiếp
                                            <FaArrowRightLong className="ml-2" />
                                        </button>
                                    </div>
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            {/* Phân trang */}
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
}

export default UserBlog;
