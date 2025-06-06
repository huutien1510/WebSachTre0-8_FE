import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import { CalendarTodayOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';


function UpdateDiscount() {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const discountID = useParams().discountID
    const navigate = useNavigate();
    const location = useLocation();
    const [discount, setDiscount] = useState(location.state?.discount);
    const baseURL = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiscount((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const UpdateDiscount = async () => {
        try {
            const date = new Date();
            const response = await fetch(`${baseURL}/discounts/update/${discountID}`, {
                method: "PATCH",
                body: JSON.stringify({
                    "code": discount.code,
                    "type": discount.type,
                    "value": discount.value,
                    "startDate": dayjs(discount.startDate).format("YYYY-MM-DD"),
                    "endDate": dayjs(discount.endDate).format("YYYY-MM-DD"),
                    "quantity": discount.quantity,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.accessToken}`
                }
            });
            const json = await response.json();
            if (json.code === 1000) {
                toast.success("Cập nhật voucher thành công");
                navigate("/admin/discounts")
            }else{
                toast.error(json.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const disabledEndDate = (current) => {
        return current && current < dayjs(discount.startDate);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        UpdateDiscount();

    };

    if (!(discount)) {
        return <p className="absolute top-16" >Không có đơn hàng này</p>
    }

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
                                    <option value="" disabled>Select type</option>
                                    <option value="PERCENT">Giảm giá theo phần trăm</option>
                                    <option value="FIXED_AMOUNT">Giảm giá cố định</option>
                                </select>
                            </div>
                            <div className="mb-4 w-1/2">
                                <label className="block mb-1">Giá trị:</label>
                                <input
                                    type="number"
                                    name="value"
                                    value={discount.value}
                                    min="0"
                                    max={discount.type === "PERCENT" ? 100 : 50000000}
                                    placeholder="Nhập giá trị"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (discount.type === "PERCENT") {
                                            if (val > 100) {
                                                setDiscount({ ...discount, value: 100 });
                                                return;
                                            }
                                        }
                                        setDiscount({ ...discount, value: val });
                                    }}
                                    onKeyDown={(e) => {
                                        // Chỉ cho phép nhập số và các phím điều khiển
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== 'Backspace' &&
                                            e.key !== 'ArrowLeft' &&
                                            e.key !== 'ArrowRight' &&
                                            e.key !== 'Tab'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border h-[45px]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mb-4">
                            <div>
                                <label className="block mb-1">
                                    Ngày bắt đầu</label>
                                <DatePicker
                                    onChange={(date) => setDiscount({ ...discount, startDate: date ? date.format("YYYY-MM-DD") : "" })}
                                    value={discount.startDate ? dayjs(discount.startDate) : null}
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
                                    onChange={(date) => setDiscount({ ...discount, endDate: date ? date.format("YYYY-MM-DD") : "" })}
                                    value={discount.endDate ? dayjs(discount.endDate) : null}
                                    disabledDate={disabledEndDate}
                                    suffixIcon={<CalendarTodayOutlined style={{ color: "#ffffff" }} />}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border text-white"
                                    placeholder="Chọn ngày"
                                    format="DD/MM/YYYY"
                                    name="endDate"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Số lượng</label>
                            <input
                                type="number"
                                name="quantity"
                                value={discount.quantity}
                                min="0"
                                max="50000000"
                                placeholder="Nhập số lượng"
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                    // Chỉ cho phép nhập số và các phím điều khiển
                                    if (
                                        !/[0-9]/.test(e.key) &&
                                        e.key !== 'Backspace' &&
                                        e.key !== 'ArrowLeft' &&
                                        e.key !== 'ArrowRight' &&
                                        e.key !== 'Tab'
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border h-[45px]"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg"
                            >
                                Update Discount
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
    );
}

export default UpdateDiscount;