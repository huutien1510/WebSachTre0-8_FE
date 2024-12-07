import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation, NavLink } from 'react-router-dom';
import OrderDetailCard from './OrderDetailCard';
function UserOrderDetail() {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const orderID = useParams().orderID
    const location = useLocation();
    const navigate = useNavigate()
    const [order, setOrder] = useState(location.state?.order)
    const [paymentUrl, setPaymentUrl] = useState(null)

    useEffect(() => {
        const buyBook = async () => {
            try {
                const response3 = await fetch(
                    "http://localhost:3000/api/order/buybook",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            bookID: book.bookId, // ID của sách, kiểu Number
                            id: user.account.id, // ID của tài khoản, kiểu Number
                            price: book.price, // Giá trị của đơn hàng, kiểu Number (tùy chọn, có giá trị mặc định là 0)
                            method: "MOMO", // Phương thức thanh toán, kiểu String
                            status: "Chờ thanh toán", // Trạng thái của đơn hàng, kiểu String
                            date: new Date(), // Ngày đặt hàng, kiểu Date
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            token: `Bearer ${user?.accessToken}`,
                        },
                    })
                const json3 = await response3.json();
                setPaymentUrl(json3.paymentUrl);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };


        if (order?.status === "Chờ thanh toán") buyBook();
    }, [order]);



    if (!(order)) {
        return <p className="absolute top-16" >Không có đơn hàng này</p>
    }

    return (
        <div className="bg-[#121212] text-white min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">THÔNG TIN ĐƠN HÀNG</h1>

            {/* content */}
            <div>
                <div>
                    <form className='flex w-full gap-10'>
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
                                        name="bookID"
                                        value={order?.accountName}
                                        className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Tổng tiền:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={order.totalPrice}
                                    disabled
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="mb-4 w-1/2">
                                    <label className="block mb-1">Phương thức thanh toán:</label>
                                    <input
                                        type="text"
                                        name="method"
                                        value={order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "MoMo"}
                                        className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                        disabled
                                    />
                                </div>

                                <div className="mb-4 w-1/2">
                                    <label className="block mb-1">Trạng thái:</label>
                                    <input
                                        type="text"
                                        name="bookID"
                                        value={order.status}
                                        className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                        disabled
                                    />
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
                            <NavLink
                                to={(paymentUrl || -1)}
                                className="flex space-x-4">
                                <button
                                    type="button"
                                    className={`${paymentUrl
                                        ? "bg-gradient-to-br from-red-400 to-red-500"
                                        : "bg-gradient-to-br from-teal-600 to-green-500"
                                        } text-white px-5 py-2.5 rounded-lg text-lg font-bold hover:bg-emerald-700 transition-colors`}
                                >
                                    {paymentUrl ? 'Thanh toán lại' : 'Hoàn thành'}
                                </button>
                            </NavLink>
                        </div>
                        <div className="w-1/3">
                            <label className="block mb-1">Sản phẩm:</label>
                            {order?.orderDetails?.map(
                                (orderDetail) =>
                                    <OrderDetailCard key={orderDetail.bookID} orderDetail={orderDetail}></OrderDetailCard>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserOrderDetail;