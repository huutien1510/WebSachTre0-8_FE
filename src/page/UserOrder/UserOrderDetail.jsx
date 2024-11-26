import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation, NavLink } from 'react-router-dom';
function UserOrderDetail() {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const orderID = useParams().orderID
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [paymentUrl, setPaymentUrl] = useState(null)
    const location = useLocation();
    const book = location.state.book;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/order/getOrderByID/${orderID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token: `Bearer ${user?.accessToken}`
                    }
                });
                const json = await response.json();
                setOrder(json.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchOrder();
    }, [])

    useEffect(() => {
        const buyBook = async () => {
            try {
                const response3 = await fetch(
                    "http://localhost:3000/api/order/buybook",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            bookID: book.bookId, // ID của sách, kiểu Number
                            accountID: user.account.accountId, // ID của tài khoản, kiểu Number
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
    console.log(paymentUrl)

    return (
        <div className="bg-[#121212] text-white min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">THÔNG TIN ĐƠN HÀNG</h1>

            <div className="flex">
                <div className="w-2/3">
                    <form>
                        <div className="mb-4">
                            <label className="block mb-1">Mã đơn hàng</label>
                            <input
                                type="text"
                                value={order._id}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <div className="flex space-x-4">
                            <div className="mb-4 w-1/2">
                                <label className="block mb-1">Mã khách hàng:</label>
                                <input
                                    type="text"
                                    name="accountID"
                                    value={order.accountID}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                    disabled
                                />
                            </div>

                            <div className="mb-4 w-1/2">
                                <label className="block mb-1">Sản phẩm:</label>
                                <input
                                    type="text"
                                    name="bookID"
                                    value={book?.name}
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
                                value={order.price}
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
                                    value={order.method}
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
                            <textarea
                                type="date"
                                name="date"
                                value={order.date}
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
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserOrderDetail;