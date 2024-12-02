import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { deleteChapter } from "../../../api/apiRequest.js"; // Import hàm deleteChapter
import { useDispatch } from "react-redux";

function ChapterBookAdmin() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = useSelector(
    (state) => state.auth.login.currentUser?.data.accessToken
  );
  const location = useLocation();
  const bookID = useParams().bookId;
  const [book, setBook] = useState(location.state?.book);
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response2 = await fetch(
        `http://localhost:8080/chapters/${bookID}`
      );
      const chapterData = await response2.json();
      setChapters(chapterData.data);
    } catch (error) {
      console.error("Error fetching chapters data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bookID]);

  const handleAddChapter = () => {
    const maxChapterNumber = chapters.reduce(
      (max, item) => {
        return Math.max(max, item.chapterNumber)
      },
      0
    );
    navigate(`/admin/chapter/addChapter/${bookID}/${maxChapterNumber + 1}`, { state: { book: book } });
  };

  const handleEditChapter = (chapterID) => {
    navigate(`/admin/chapter/editChapter/${chapterID}`, { state: { book: book } });
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chapter này?")) {
      try {
        await deleteChapter(chapterId, dispatch, user, accessToken);
        alert("Xóa chapter thành công!");
        // Refresh lại danh sách chapter
        fetchData();
      } catch (error) {
        console.error("Error deleting chapter:", error);
        alert("Có lỗi xảy ra khi xóa chapter!");
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Thông tin sách */}
      {book && (
        <div className=" p-3 mb-2">
          <div className="flex items-start justify-between">
            {/* Thumbnail sách */}
            <div className="flex items-start">
              <img
                src={book.thumbnail}
                alt={book.name}
                className="w-32 h-48 object-cover rounded-md mr-6"
              />
              {/* Thông tin chi tiết */}
              <div>
                <h2 className="text-2xl font-bold text-[#34D399] mb-2">
                  {book.name}
                </h2>
                <p className="text-gray-400 mb-2">Tác giả: {book.author}</p>
                <p className="text-gray-300 mb-4">{book.description}</p>
              </div>
            </div>

            {/* Nút thêm Chapter */}
            <button
              onClick={handleAddChapter}
              className="flex items-center mt-10 ml-4 mb-4 justify-center mt-1 text-white w-1/3 px-5 py-2.5 rounded-lg text-lg font-bold transition-colors bg-[#18B088] hover:bg-[#148F70]"
            >
              Add Chapter
            </button>
          </div>
        </div>
      )}
      {/* Danh sách chapter */}
      <div className=" p-3 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-[#34D399] mb-4">
          Danh sách Chapter
        </h3>
        {chapters?.length > 0 ? (
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-md shadow-md"
              >
                {/* Thông tin chapter */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-200">
                    Chapter {chapter.chapterNumber}
                  </h4>
                  {/* <p className="text-gray-400 text-sm">
                    Số Chapter: {chapter.chapter_number}
                  </p> */}
                  <p className="text-gray-500 text-xs">
                    Ngày xuất bản:{" "}
                    {format(new Date(chapter.pushlishDate), "dd/MM/yyyy")}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Lượt xem: {chapter.viewCount}
                  </p>
                </div>

                {/* Nút chỉnh sửa và xóa */}
                <div className="flex items-center space-x-3">
                  <button
                    className="flex items-center justify-center mt-1 text-white w-full px-5 py-2.5 rounded-lg text-lg font-bold transition-colors bg-[#18B088] hover:bg-[#148F70]"
                    onClick={() => handleEditChapter(chapter.id)}
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
                    Edit
                  </button>
                  <button
                    className="flex items-center justify-center mt-1 text-white px-5 py-2.5 rounded-lg text-lg font-bold transition-colors bg-red-500  hover:bg-red-600"
                    onClick={() => handleDeleteChapter(chapter.id)}
                  >
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
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Không có chapter nào.</p>
        )}
      </div>
    </div>
  );
}

export default ChapterBookAdmin;
