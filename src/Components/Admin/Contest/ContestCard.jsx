import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DeleteContestConfirmModal from "./DeleteContestConfirmModal.jsx"
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

const ContestCard = ({ contest }) => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const { name, banner, description, start_date, end_date, maxParticipants, currentParticipants } = contest;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contestIDToDelete, setContestIDToDelete] = useState(null);
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_URL;
    const openModal = (id) => {
        setContestIDToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setContestIDToDelete(null);
    };

    const confirmDelete = async () => {
        if (contestIDToDelete) {
            try {
                const response = await fetch(`${baseURL}/contests/deleteContest/${contestIDToDelete}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${user?.data.accessToken}`
                    }
                });
                const json = await response.json();
                if (json.code === 200) {
                    toast.success("Xóa thành công")
                    navigate("/admin/contests")
                }
                else toast.error("Xóa thất bại")
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
        closeModal();
    };


    return (
        <div className="max-w-sm rounded-lg border border-black shadow-md overflow-hidden bg-gray-100 flex flex-col h-full">
            {/* Hình ảnh */}
            <img
                src={banner}
                alt="Contest"
                className="w-full h-52 object-cover"
            />

            {/* Nội dung */}
            <div className="p-4 flex flex-col flex-1">
                {/* Các tag */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-500 text-sm font-medium rounded-full">
                        👫 Cộng đồng
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-500 text-sm font-medium rounded-full">
                        🎁 Vật phẩm
                    </span>
                </div>

                {/* Tiêu đề */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 h-[48px]">
                    {name}
                </h3>

                {/* Thông tin đăng ký */}
                <div className="text-sm text-gray-600 mb-3">
                    <p>📅 Đăng ký: <span className="font-medium">
                        {new Date(start_date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })} - {new Date(end_date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}</span></p>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                    <p>👥 {currentParticipants} đăng ký</p>
                </div>

                {/* Mô tả */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-[60px]">
                    {description}
                </p>

                {/* Nút hành động */}
                <div className="flex justify-between mt-auto gap-2">
                    {/* buttonEdit */}
                    <NavLink to={`/admin/contests/contestDetail/${contest.id}`} className="flex-1">
                        <button className="flex items-center justify-center text-white px-3 py-2 rounded-lg bg-[#3A5FCD] hover:bg-[#436EEE] transition-colors w-full gap-2.5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Details
                        </button>
                    </NavLink>

                    {/* buttonDelete */}
                    <button
                        onClick={() => openModal(contest.id)}
                        className="flex items-center justify-center text-white px-3 py-2 
                        rounded-lg bg-red-500 hover:bg-red-500/90 transition-colors flex-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M8 3h8c0.55 0 1 .45 1 1v1H7V4c0-.55.45-1 1-1z" />
                            <path d="M4 6h16v2H4V6z" />
                            <path d="M6 8v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6zm2.75 2.5h1.5v6h-1.5v-6zm2.75 0h1.5v6h-1.5v-6zm2.75 0h1.5v6h-1.5v-6z" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
            {/* Confirm Delete Modal */}
            <DeleteContestConfirmModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default ContestCard;
