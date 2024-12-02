import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import OrderDetailCard from './OrderDetailCard';

function UpdateOrder() {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const orderID = useParams().orderID
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(location.state?.order)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value
        }))
    }

    const updateOrder = async () => {
        try {
            const response = await fetch(`http://localhost:8080/orders/updateOrder/${orderID}`, {
                method: "PATCH",
                body: JSON.stringify({
                    "totalPrice": order.totalPrice,
                    "paymentMethod": order.paymentMethod,
                    "status": order.status,
                    "address": order.address
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.accessToken}`
                }
            });
            if (response.status === 200) {
                toast.success("Cập nhật thành công!")
                navigate("/admin/orders")
            } else {
                toast.error("Cập nhật thất bại!")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateOrder();

    };

    if (!(order)) {
        return <p className="absolute top-16" >Không có đơn hàng này</p>
    }

    return (
        <div className="bg-[#121212] text-white min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">THÔNG TIN ĐƠN HÀNG</h1>

            <div>
                <div>
                    <form className='flex w-full gap-10' onSubmit={handleSubmit}>
                        <div className='w-2/3'>
                            <div className="mb-4">
                                <label className="block mb-1">Mã đơn hàng</label>
                                <input
                                    type="text"
                                    value={order.id}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="mb-4 w-1/2">
                                    <label className="block mb-1">Mã khách hàng:</label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={order.id}
                                        className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                        disabled
                                    />
                                </div>

                                <div className="mb-4 w-1/2">
                                    <label className="block mb-1">Tên khách hàng:</label>
                                    <input
                                        type="text"
                                        name="accountName"
                                        value={order.accountName}
                                        className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Tổng tiền:</label>
                                <input
                                    type="number"
                                    name="totalPrice"
                                    value={order.totalPrice}
                                    min="1000"
                                    max="50000000"
                                    placeholder="Nhập giá"
                                    onChange={handleChange}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="mb-4 w-1/2">
                                    <label className="block mb-1">Phương thức thanh toán:</label>
                                    <select
                                        name="paymentMethod"
                                        value={order.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                    >
                                        <option value="" disabled>
                                            Chọn phương thức thanh toán
                                        </option>
                                        <option value="MOMO">MOMO</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Visa">Visa</option>
                                    </select>
                                </div>
                                <div className="mb-4 w-1/2">
                                    <label className="block mb-1">Trạng thái:</label>
                                    <select
                                        name="status"
                                        value={order.status}
                                        onChange={handleChange}
                                        className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                    >
                                        <option value="" disabled>
                                            Chọn trạng thái đơn hàng
                                        </option>
                                        <option value="Đã thanh toán">Đã thanh toán</option>
                                        <option value="Chờ thanh toán">Chờ thanh toán</option>
                                        <option value="Đã hủy">Đã hủy</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 w-full">Ngày: </label>
                                <input
                                    type="datetime"
                                    name="date"
                                    value={new Date(order.date).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    disabled
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
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
                                    className="bg-[#383838] text-white py-2 px-4 rounded-lg border-gray-400 border"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                        <div className="w-1/3">
                            <label className="block mb-1">Sản phẩm:</label>
                            {order?.orderDetails?.map(
                                (orderDetail) => <OrderDetailCard key={orderDetail.bookID} orderDetail={orderDetail}></OrderDetailCard>
                            )}
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}

export default UpdateOrder;