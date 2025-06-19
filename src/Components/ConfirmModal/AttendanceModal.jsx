import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { checkInAttendance } from "../../redux/attendanceSlice";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AttendanceModal({ open, onClose }) {
    const dispatch = useDispatch();
    const { checkedInToday, streak, canRecover, recoveryCount, firstCheckIn, isRecovery, loading } = useSelector((state) => state.attendance);

    const user = useSelector((state) => state.auth?.login?.currentUser);
    const role = user?.data?.account?.is_admin;

    const handleCheckIn = async () => {
        if (user && !role) {
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
    let title;
    let description;
    let buttonText;
    if (firstCheckIn) {
        lottieSrc = "https://lottie.host/0d85714a-543f-4bef-89f7-8597043d72d8/771q3qbHEt.lottie";
        title = "🥚 Một quả trứng bí ẩn đang chờ bạn đánh thức!";
        description = "Chỉ cần một lần chạm để ấp nở ngọn lửa đầu tiên và bắt đầu hành trình của bạn!";
        buttonText = "👉 Điểm danh ngay bây giờ!";
    } else if (checkedInToday) {
        lottieSrc = "https://lottie.host/fd3c8293-f1ed-4c1f-801f-e3f0214d3e63/AumkMnaJx0.lottie";
        title = "🎉 Tuyệt vời! Bạn đã điểm danh hôm nay rồi!";
        description = "Hãy tiếp tục giữ vững streak của bạn để đạt được nhiều thành tích hơn nữa!";
        buttonText = "Đóng";
    } else if (streak > 0 && !isRecovery) {
        lottieSrc = "https://lottie.host/9bb9e096-c72d-4b24-884d-587ed4add25d/qcx2EyBlxo.lottie";
        title = `🔥 Chuỗi ngày tuyệt vời! Bạn đang ở ngày thứ ${streak}!`;
        description = "Bạn đang duy trì một streak ấn tượng – cứ thế này bạn sẽ sớm mở kho báu siêu hiếm!💪 Đừng bỏ lỡ hôm nay – chỉ một cú click để tiếp tục hành trình!";
        buttonText = "👉 Điểm danh ngay bây giờ!";
    } else if (canRecover) {
        lottieSrc = "https://lottie.host/9bb9e096-c72d-4b24-884d-587ed4add25d/qcx2EyBlxo.lottie"; // Lottie cho khôi phục
        title = "Bạn có thể khôi phục streak!";
        description = `Bạn đã khôi phục streak của mình! Còn ${recoveryCount} lần khôi phục trong tháng này.`;
        buttonText = "👉 Điểm danh ngay bây giờ!";
    } else if (!canRecover) {
        lottieSrc = "https://lottie.host/ec70dcb5-e1f1-4950-9eaf-cea4d40d5255/l8jMER0m9q.lottie";
        title = "💔 Streak đã bị mất!";
        description = "Đừng buồn! Hãy bắt đầu lại streak mới ngay hôm nay!";
        buttonText = "👉 Bắt đầu lại hôm nay!";
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
                    <h2 className="text-white text-2xl font-bold mb-2">{title}</h2>
                    <p className="text-gray-300 text-base">
                        {description}
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
                        {loading ? "Đang điểm danh..." : buttonText}
                    </button>
                ) : (
                    <button
                        className="mt-2 px-8 py-3 rounded-full bg-[#a259f7] text-white font-bold text-lg shadow-md hover:bg-[#7c3aed] transition"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                )}
            </motion.div>
        </div>
    );
}