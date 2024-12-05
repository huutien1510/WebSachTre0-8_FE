import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultAvatar from "../../../image/default-avatar.png";
import axios from 'axios';
import { DatePicker } from 'antd';
import { CalendarTodayOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';


function UpdateContest() {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [contest, setContest] = useState(location.state.contest);

    const disabledEndDate = (current) => {
        const startDate = dayjs(contest?.start_date).startOf('day'); // Ngày bắt đầu
        return current && (current < startDate);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContest({ ...contest, [name]: value });

    };

    const handlebannerChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "demo-upload");

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dqlb6zx2q/image/upload",
                formData
            );


            setContest((prev) => ({
                ...prev,
                banner: response.data.secure_url,
            }));
            toast.success("Tải ảnh lên thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tải ảnh lên" + error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemovebanner = (e) => {
        e.preventDefault();
        fileInputRef.current.value = "";
        setContest((prev) => ({
            ...prev,
            banner: defaultAvatar,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!contest?.name || !contest?.description || !contest?.start_date || !contest?.end_date || !contest?.banner || !contest?.maxParticipants) {
            console.log(contest)
            toast.error("Sai yêu cầu dữ liệu !");
            return;
        }

        const addcontest = async () => {
            try {
                const response = await fetch(`http://localhost:8080/contests/updateContest/${contest.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        "name": contest?.name,
                        "banner": contest?.banner,
                        "description": contest?.description,
                        "start_date": contest?.start_date,
                        "end_date": contest?.end_date,
                        "maxParticipants": contest?.maxParticipants
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.accessToken}`
                    }
                });
                const json = await response.json();
                if (json.code === 200) {
                    toast.success("Cập nhật cuộc thi thành công");
                    navigate(-1)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        addcontest();

    };

    return (
        <div className="bg-[#121212] text-white min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">THÔNG TIN CUỘC THI</h1>

            <div className="flex justify-center">
                <div className="w-2/3 mr-10">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Tên cuộc thi</label>
                            <input
                                type="text"
                                name="name"
                                value={contest?.name}
                                placeholder="Nhập tên cuộc thi"
                                onChange={handleChange}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mb-4">
                            <div>
                                <label className="block mb-1">
                                    Ngày bắt đầu</label>
                                <DatePicker
                                    onChange={(dateString) => setContest({ ...contest, start_date: dateString })}
                                    value={dayjs(contest?.start_date)}
                                    suffixIcon={<CalendarTodayOutlined style={{ color: "#ffffff" }} />}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border text-white placeholder-white"
                                    placeholder="Chọn ngày"
                                    format="DD/MM/YYYY"
                                    name="start_date"
                                />
                            </div>

                            <div>
                                <label className="block mb-1">
                                    Ngày kết thúc</label>
                                <DatePicker
                                    onChange={(dateString) => setContest({ ...contest, end_date: dateString })}
                                    value={dayjs(contest?.end_date)}
                                    disabledDate={disabledEndDate}
                                    suffixIcon={<CalendarTodayOutlined style={{ color: "#ffffff" }} />}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border text-white"
                                    placeholder="Chọn ngày"
                                    format="DD/MM/YYYY"
                                    name="end_date"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div className="mb-4 w-full">
                                <label className="block mb-1">Số người tối đa:</label>
                                <input
                                    type="number"
                                    name="maxParticipants"
                                    value={contest?.maxParticipants}
                                    min="0"
                                    placeholder="Nhập số lượng"
                                    onChange={handleChange}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 w-full">Thể lệ cuộc thi</label>
                            <textarea
                                type="text"
                                name="description"
                                value={contest?.description}
                                placeholder="Nhập thể lệ cuộc thi"
                                onChange={handleChange}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border h-40"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg"
                            >
                                Cập nhật
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                type='button'
                                className="bg-[#383838] text-white py-2 px-4 rounded-lg border-gray-400 border">
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-3/5 flex flex-col items-center">
                    <div
                        className="w-full mt-20 h-72 bg-gradient-to-br from-teal-300 to-green-400 rounded-lg mb-4"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            backgroundImage: `url(${contest?.banner})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlebannerChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className='flex '>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg mr-4">
                            {isUploading ? "Đang tải lên..." : "Thay ảnh"}
                        </button>
                        <button
                            onClick={handleRemovebanner}
                            className="bg-gradient-to-br from-red-400 to-red-500 text-white py-2 px-4 rounded-lg">
                            Gỡ ảnh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateContest;