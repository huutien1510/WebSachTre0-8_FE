import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createChapter,
  createChapterContent,
} from "../../../api/apiRequest.js";

function ChapterAddAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = useSelector(
    (state) => state.auth.login.currentUser?.data.accessToken
  );
  const { bookID, newChapterNumber } = useParams();
  const location = useLocation();
  const [book, setBook] = useState(location.state.book);
  const [chapterTitle, setChapterTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const uploadToCloudinary = async (file) => {
    if (!file) {
      alert("Vui lòng chọn file để tải lên!");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "demo-upload");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dqlb6zx2q/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tải file lên server!");
      }

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error("Không nhận được đường dẫn ảnh từ server!");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert(error.message || "Có lỗi xảy ra khi tải ảnh lên!");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra title và ảnh
    if (!chapterTitle.trim()) {
      alert("Vui lòng nhập tiêu đề chapter!");
      return;
    }

    // if (selectedImages.length === 0) {
    //   alert("Vui lòng tải lên ít nhất một ảnh!");
    //   return;
    // }

    setLoading(true);
    setUploadProgress(0);

    try {
      // 1. Tạo chapter mới và lấy chapterID từ response
      const chapterResponse = await createChapter(
        bookID,
        chapterTitle,
        newChapterNumber,
        dispatch,
        user,
        accessToken
      );

      const chapterID = chapterResponse.data.id;

      // 2. Upload tất cả ảnh lên Cloudinary
      const totalImages = selectedImages?.length;
      const uploadedUrls = [];

      for (let i = 0; i < totalImages; i++) {
        const imageUrl = await uploadToCloudinary(selectedImages[i]);
        uploadedUrls.push(imageUrl);
        const uploadProgress = ((i + 1) / totalImages) * 50;
        setUploadProgress(uploadProgress);
      }

      // 3. Lưu các ChapterContent
      const savePromises = uploadedUrls.map((url, index) => {
        return createChapterContent(
          chapterID,
          index + 1,
          url,
          dispatch,
          user,
          accessToken
        );
      });

      for (let i = 0; i < savePromises.length; i++) {
        await savePromises[i];
        const saveProgress = 50 + ((i + 1) / savePromises.length) * 50;
        setUploadProgress(saveProgress);
      }

      setUploadProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 500));

      alert("Chapter created successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error in create process:", error);
      alert("Error creating chapter. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-[#121214]">
      <p
        style={{ fontSize: "20px", fontWeight: "bold", color: "#32D097" }}
        className="p-4"
      >
        Thêm Chapter - {book?.name || "Đang tải thông tin truyện..."}
      </p>
      <div className=" w-[100vw] max-w-lg bg-[#121214] rounded-xl shadow-lg overflow-hidden ">
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Chapter Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Tiêu đề Chapter
            </label>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#27272a] border border-gray-700 text-gray-100 focus:ring-2 focus:ring-[#30B685] focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Nhập tiêu đề chapter..."
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Tải lên ảnh chapter
            </label>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#30B685] transition-all duration-200 bg-[#27272a]"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-300">
                    Click để chọn ảnh
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-200">
                Preview ({selectedImages.length} ảnh)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-sm"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="w-full bg-[#27272a] rounded-full h-2">
                <div
                  className="bg-[#30B685] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 text-center">
                {uploadProgress < 50
                  ? `Đang tải ảnh lên... ${Math.round(uploadProgress * 2)}%`
                  : `Đang lưu dữ liệu... ${Math.round(
                    (uploadProgress - 50) * 2
                  )}%`}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#18B088] hover:bg-[#148F70] transform hover:-translate-y-0.5"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center ">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Lưu Chapter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChapterAddAdmin;
