// BookOverlay.js
/* eslint-disable react/prop-types */
import { NavLink, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DeleteBookConfirmModal from './DeleteBookComfirmModal'
import { toast } from 'react-toastify';

const BookOverlay = ({ book }) => {

  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookIDToDelete, setBookIDToDelete] = useState(null);

  const deleteBook = async () => {
    try {
      const response = await fetch(`http://localhost:8080/books/deleteBook/${bookIDToDelete}`, {
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
    console.log(id);
    setBookIDToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBookIDToDelete(null);
  };

  const confirmDelete = async () => {
    if (bookIDToDelete) {
      const response = await deleteBook();
      if (response.code === 200) {
        toast.success("Xóa thành công")
        navigate("/admin/books")
      }
      else toast.error("Xóa thất bại")
    }
    closeModal();
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
      <div className="flex justify-center gap-2">
        {/* buttonEdit */}
        <NavLink to={`/admin/books/updateBook/${book.id}`}>
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
        <button onClick={() => openModal(book.id)} className="flex items-center justify-center text-white px-3 py-2 rounded-lg bg-red-500  hover:bg-red-500/90 transition-colors w-full">
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

      {/* Confirm Delete Modal */}
      <DeleteBookConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
export default BookOverlay;
