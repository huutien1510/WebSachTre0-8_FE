// BookOverlay.js
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  getFavoriteStatus,
  addToFavorites,
  removeFromFavorites,
} from "../../api/apiRequest.js";
import { useDispatch, useSelector } from 'react-redux';

const BookOverlay = ({ book }) => {
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.data.accessToken
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const id = useSelector(
    (state) => state.auth.login.currentUser?.data.account.id
  );
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (id && book.id) {
        try {
          const status = await getFavoriteStatus(
            id,
            book.id,
            dispatch,
            user,
            accessToken
          );
          setIsFavorite(status);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    }
    checkFavoriteStatus();
  }, [id, book.id]);

  const handleFavoriteClick = async () => {
    if (!user) {
      // Xử lý khi chưa đăng nhập
      navigate("/login");
    }
    try {
      if (isFavorite) {
        await removeFromFavorites(id, book.id, dispatch, user, accessToken);
      } else {
        await addToFavorites(id, book.id, dispatch, user, accessToken);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái yêu thích" + error);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-white font-bold text-lg mb-2">{book.name}</h3>
        {book.author && (
          <p className="text-[#18B088] text-sm mb-2">{book.author}</p>
        )}
        {book.description && (
          <p className="text-white/80 text-sm line-clamp-4">{book.description}</p>
        )}
      </div>
      <div className="flex gap-2 justify-center">
        <NavLink to={`/book/${book.id}`}>
          <button className="flex items-center justify-center gap-2 bg-[#18B088] text-white px-4 py-2 rounded-lg hover:bg-[#18B088]/90 transition-colors w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Đọc sách
          </button>
        </NavLink>
        <button className={`flex items-center justify-center p-2 rounded-lg transition-colors ${isFavorite
          ? "bg-emerald-500 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`} onClick={handleFavoriteClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>
    </div >
  );
}
export default BookOverlay;
