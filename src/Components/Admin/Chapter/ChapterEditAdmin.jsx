import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChapter,
  createChapterContent,
  createAxiosInstance,
} from "../../../api/apiRequest.js";

function ChapterEditAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookID, chapterNumber } = useParams();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.data.accessToken;

  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [contentItems, setContentItems] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookResponse = await fetch(
          `http://localhost:3000/api/books/${bookID}`
        );
        const bookData = await bookResponse.json();
        setBook(bookData?.data);

        const chapterResponse = await fetch(
          `http://localhost:3000/api/chapter/${bookID}/${chapterNumber}`
        );
        const chapterData = await chapterResponse.json();
        setChapter(chapterData?.data);
        setChapterTitle(chapterData?.data?.chapter_title);

        const contentsResponse = await fetch(
          `http://localhost:3000/api/chaptercontent/${chapterData?.data?._id}`
        );
        const contentsData = await contentsResponse.json();
        setContentItems(contentsData?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [bookID, chapterNumber]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chapterUpload");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhs93uix6/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteClick = (content) => {
    setContentToDelete(content);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const axiosInstance = createAxiosInstance(user, dispatch);

      const response = await axiosInstance.post(
        `/chaptercontent/delete`,
        {
          chapterID: contentToDelete.chapterID,
          content_number: contentToDelete.content_number,
          content: contentToDelete.content,
        },
        {
          headers: {
            token: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setContentItems(
          contentItems.filter((item) => item._id !== contentToDelete._id)
        );
        alert("Xóa ảnh thành công!");
      } else {
        alert("Không thể xóa ảnh");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Lỗi khi xóa ảnh");
    }
    setShowDeleteModal(false);
    setContentToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      // Update chapter title
      await updateChapter(
        bookID,
        chapter.chapter_number,
        chapterTitle,
        dispatch,
        user,
        accessToken
      );

      // Upload new images to Cloudinary
      const totalOperations = newImages.length;
      const uploadedUrls = [];
      let completedOperations = 0;

      for (const image of newImages) {
        const imageUrl = await uploadToCloudinary(image);
        uploadedUrls.push(imageUrl);
        completedOperations++;
        setUploadProgress((completedOperations / (totalOperations * 2)) * 100);
      }

      // Find the highest content_number
      const maxContentNumber = contentItems.reduce(
        (max, item) => Math.max(max, item.content_number),
        0
      );

      // Create chapter contents with Cloudinary URLs
      for (let i = 0; i < uploadedUrls.length; i++) {
        const newContentNumber = maxContentNumber + i + 1;
        await createChapterContent(
          chapter._id,
          newContentNumber,
          uploadedUrls[i],
          dispatch,
          user,
          accessToken
        );

        completedOperations++;
        setUploadProgress(
          ((completedOperations + uploadedUrls.length) /
            (totalOperations * 2)) *
          100
        );

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      alert("Cập nhật chapter thành công!");
      navigate(`/admin/chapter/book/${bookID}`);
    } catch (error) {
      console.error("Error in update process:", error);
      alert("Lỗi khi cập nhật chapter. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {chapterTitle} - {book?.name}
          </h1>
        </div>

        <div className="rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2 mb-4">
              <label className="text-lg font-medium text-gray-200">
                Tiêu đề Chapter
              </label>
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 outline-none"
                placeholder="Nhập tiêu đề chapter..."
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-200">
                Ảnh hiện tại
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {contentItems && contentItems.length > 0 ? (
                  contentItems.map((item) => (
                    <div
                      key={item._id}
                      className="group relative rounded-xl overflow-hidden"
                    >
                      <img
                        src={item.content}
                        alt={`Content ${item.content_number}`}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="absolute bottom-2 left-2 text-sm text-white">
                          Ảnh {item.content_number}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(item)}
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-4 text-gray-400">
                    Không tìm thấy
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <label className="text-lg font-medium text-gray-200">
                Thêm ảnh mới
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-400">
                    Click để chọn ảnh
                  </span>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>
            </div>

            {newImages.length > 0 && (
              <div className="space-y-4">
                <label className="text-lg font-medium text-gray-200">
                  Ảnh đã chọn ({newImages.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImages.map((file, index) => (
                    <div
                      key={index}
                      className="relative group rounded-xl overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Đang tải lên...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-[200px] mt-4 py-4 rounded-xl text-2sm font-bold text-gray-900 transition-all duration-300 ${loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500"
                }`}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật Chapter"}
            </button>
          </form>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-300 mb-6">
              Bạn có chắc chắn muốn xóa ảnh này?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChapterEditAdmin;
