import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { checkInAttendance } from "../../redux/attendanceSlice";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AttendanceModal({ open, onClose }) {
    const dispatch = useDispatch();
    const { checkedInToday, streak, loading } = useSelector((state) => state.attendance);

    const user = useSelector((state) => state.auth?.login?.currentUser);

    const handleCheckIn = async () => {
        if (user) {
            await dispatch(checkInAttendance({
                userId: user?.data?.account?.id,
                accessToken: user?.data?.accessToken
            }));
            if (!loading && !checkedInToday) {
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        }
    };

    let lottieSrc;
    if (streak == 0) {
        lottieSrc = "https://lottie.host/0d85714a-543f-4bef-89f7-8597043d72d8/771q3qbHEt.lottie";
    } else if (!checkedInToday) {
        lottieSrc = "https://lottie.host/fd3c8293-f1ed-4c1f-801f-e3f0214d3e63/AumkMnaJx0.lottie";
    } else {
        lottieSrc = "https://lottie.host/9bb9e096-c72d-4b24-884d-587ed4add25d/qcx2EyBlxo.lottie";
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="relative rounded-3xl shadow-2xl w-[340px] bg-gradient-to-br from-[#23244a] to-[#1a1b2e] flex flex-col items-center pb-8"
            >
                {/* Nút X đóng modal */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-white text-2xl font-bold hover:text-red-300 focus:outline-none z-10"
                    aria-label="Đóng"
                >
                    ×
                </button>

                <div className="flex flex-col items-center mt-8 mb-2">
                    <DotLottieReact
                        src={lottieSrc}
                        loop
                        autoplay
                    />
                    <div className="w-14 h-14 bg-white border-4 border-[#23244a] rounded-full flex items-center justify-center text-2xl font-bold text-[#23244a] shadow-lg -mt-7 mb-2">
                        {streak}
                    </div>
                </div>

                {/* Tiêu đề và mô tả */}
                <div className="text-center px-6 mb-4">
                    <h2 className="text-white text-2xl font-bold mb-2">You've started a streak!</h2>
                    <p className="text-gray-300 text-base">
                        Reach your goal every day to build your streak and get closer to your goals.
                    </p>
                </div>

                {/* Nút điểm danh hoặc tiếp tục */}
                {!checkedInToday ? (
                    <button
                        className={`mt-2 px-8 py-3 rounded-full bg-[#a259f7] text-white font-bold text-lg shadow-md transition 
              ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#7c3aed]"}`}
                        onClick={handleCheckIn}
                        disabled={loading}
                    >
                        {loading ? "Đang điểm danh..." : "Check in now"}
                    </button>
                ) : (
                    <button
                        className="mt-2 px-8 py-3 rounded-full bg-[#a259f7] text-white font-bold text-lg shadow-md hover:bg-[#7c3aed] transition"
                        onClick={onClose}
                    >
                        CONTINUE
                    </button>
                )}
            </motion.div>
        </div>
    );
}