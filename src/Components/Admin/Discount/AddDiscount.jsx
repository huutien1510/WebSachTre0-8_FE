import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { DatePicker } from 'antd';
import { CalendarTodayOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';

const AddDiscount = () => {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const navigate = useNavigate();

    const [discount, setDiscount] = useState({
        code: "",
        type: "",
        value: "",
        startDate: "",
        endDate: "",
        quantity:"",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiscount({ ...discount, [name]: value });

    };





    const handleSubmit = (e) => {
        e.preventDefault();

        if (!discount.title || !discount.content || !discount.author || !discount.image) {
            toast.error("Thiếu dữ liệu !");
            return;
        }

        const adddiscount = async () => {
            try {
                const date = new Date();
                const response = await fetch(`http://localhost:8080/articles`, {
                    method: "POST",
                    body: JSON.stringify({
                        "title": discount.title,
                        "author": discount.author,
                        "content": discount.content,
                        "image": discount.image,
                        "date": format(new Date(date), "dd/MM/yyyy")
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.accessToken}`
                    }
                });
                const json = await response.json();
                if (json.code === 200) {
                    toast.success("Thêm bài viết thành công");
                    navigate("/admin/discounts")
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        adddiscount();

    };
    const disabledEndDate = (current) => {
        const startDate = dayjs(discount.startDate).startOf('day'); // Ngày bắt đầu
        return current && (current < startDate);
    };

    return (
        <div className="bg-[#121212] text-white min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">THÔNG TIN DISCOUNT</h1>

            <div className="flex">
                <div className="w-2/3">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Mã Discount</label>
                            <input
                                type="text"
                                name="code"
                                value={discount.code}
                                placeholder="Nhập mã Discount"
                                onChange={handleChange}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                            />
                        </div>
                        <div className="flex space-x-4">
                                <div className="mb-4 w-1/2">
                                    <label className="block mb-1">Loại: </label>
                                    <select
                                        name="type"
                                        value={discount.type}
                                        onChange={handleChange}
                                        className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                    >
                                        <option value="" disabled>
                                            Chọn loại discount
                                        </option>
                                        <option value="PERCENT">Giảm giá theo phần trăm</option>
                                        <option value="FIXED_AMOUNT">Giảm giá cố định </option>
                                    </select>
                                </div>
                                <div className="mb-4 w-1/2">
                                    <label className="block mb-1">Giá trị:</label>
                                    <input type="text" />
                                </div>
                            </div>
                        <div className="grid grid-cols-2 gap-4 w-full mb-4">
                            <div>
                                <label className="block mb-1">
                                    Ngày bắt đầu</label>
                                <DatePicker
                                    onChange={(dateString) => setDiscount({ ...discount, startDate: dateString })}
                                    value={discount.startDate}
                                    suffixIcon={<CalendarTodayOutlined style={{ color: "#ffffff" }} />}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border text-white placeholder-white"
                                    placeholder="Chọn ngày"
                                    format="DD/MM/YYYY"
                                    name="startDate"
                                />
                            </div>

                            <div>
                                <label className="block mb-1">
                                    Ngày kết thúc</label>
                                <DatePicker
                                    onChange={(dateString) => setDiscount({ ...discount, endDate: dateString })}
                                    value={discount.endDate}
                                    disabledDate={disabledEndDate}
                                    suffixIcon={<CalendarTodayOutlined style={{ color: "#ffffff" }} />}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border text-white"
                                    placeholder="Chọn ngày"
                                    format="DD/MM/YYYY"
                                    name="endDate"
                                />
                            </div>
                        </div>
                        
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg"
                            >
                                Thêm Discount
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

            </div>
        </div>
    )
}

export default AddDiscount