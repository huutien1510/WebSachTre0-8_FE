import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react'
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdOutlineDateRange } from 'react-icons/md';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import DeleteArticleConfirmModal from './DeleteArticleConfirmModal.jsx';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const BlogAdmin = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef(null);
  const [listArticles, setListArticles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleIDToDelete, setArticleIDToDelete] = useState(null);

  const deleteArticle = async () => {
    try {
      const response = await fetch(`${baseURL}/articles/deleteArticle/${articleIDToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.data.accessToken}`
        }
      });
      const json = await response.json();
      return json;
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  const openModal = (id) => {
    setArticleIDToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setArticleIDToDelete(null);
  };

  const confirmDelete = async () => {
    if (articleIDToDelete) {
      const response = await deleteArticle();
      if (response.code === 200) {
        toast.success("Xóa thành công")
        navigate("/admin/blogs")
      }
      else toast.error("Xóa thất bại")
    }
    closeModal();
  };


  useEffect(() => {
    const fecthBlog = async (page) => {
      try {
        if (inputRef.current) inputRef.current.value = page;
        const response = await fetch(`${baseURL}/articles/getAll?page=${page - 1}&size=9`);
        const json = await response.json();
        setListArticles(json.data.content);
        setTotalPages(json.data.totalPages);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fecthBlog(currentPage)
  }, [currentPage, location]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-main py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[#18B088] text-lg font-semibold">Tất cả bài viết</span>
          <NavLink to={'/admin/blogs/addBlog'} >
            <button className="bg-[#18B088] text-white text-xl px-4 py-2 rounded-lg font-semibold hover:bg-[#128067] transition duration-200">
              Thêm bài viết
            </button>
          </NavLink>
        </div>
        {/* hàng 2 */}
        <div className="container mx-auto mt-10">
          <div className="flex flex-wrap item-center justify-between gap-8">
            {listArticles?.map((articles) => (
              <div key={articles.id} className="w-[30%] pb-4 mb-4 ">
                <div className="cursor-pointer">
                  <div className="flex flex-col gap-4">
                    <div className="w-[320px] h-[200px] overflow-hidden">
                      <img
                        src={articles.image}
                        alt={articles.title}
                        className="w-full h-full object-cover rounded-2xl"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      <h3 className="text-3xl text-white font-bold line-clamp-1">{articles.title}</h3>
                      <p
                        className="line-clamp-3 overflow-hidden text-gray-400 text-ellipsis h-16"
                        dangerouslySetInnerHTML={{ __html: articles.content }}
                      ></p>
                      <p className="flex items-center gap-2 text-gray-400 ">
                        <MdOutlineDateRange />
                        <span className='line-clamp-1'>{format(articles.date, "dd/MM/yyyy")}</span>
                        <span> - </span>
                        <span className='line-clamp-1'>{articles.author}</span>
                      </p>
                    </div>
                    {/* <button className="flex items-center font-semibold text-blue-500">
                      Xem tiếp
                      <FaArrowRightLong className="ml-2" />
                    </button> */}

                    <div className="flex justify-center gap-2 w-full">
                      {/* buttonEdit */}
                      <NavLink to={`/admin/blogs/editBlog/${articles.id}`} className={'w-1/2'}>
                        <button className="flex items-center justify-center text-white px-3 py-2 rounded-lg bg-[#18B088] hover:bg-[#18B088]/90 transition-colors w-full">
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
                          Edit
                        </button>
                      </NavLink>

                      {/* buttonDelete */}
                      <button onClick={() => openModal(articles.id)} className="flex items-center justify-center text-white px-3 py-2 rounded-lg bg-red-500  hover:bg-red-500/90 transition-colors w-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-6"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 3h8c0.55 0 1 .45 1 1v1H7V4c0-.55.45-1 1-1z" />
                          <path d="M4 6h16v2H4V6z" />
                          <path d="M6 8v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6zm2.75  2.5h1.5v6h-1.5v-6zm2.75 0h1.5v6h-1.5v-6zm2.75 0h1.5v6h-1.5v-6z" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      {/* Confirm Delete Modal */}
      <DeleteArticleConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default BlogAdmin