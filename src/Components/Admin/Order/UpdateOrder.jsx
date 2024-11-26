import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateOrder() {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const orderID = useParams().orderID
    const navigate = useNavigate();
    const [order, setOrder] = useState(null)

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value
        }))
    }

    const updateOrder = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/order/updateOrder/${orderID}`, {
                method: "PATCH",
                body: JSON.stringify({
                    "bookID": order.bookID,
                    "accountID": order.accountID,
                    "price": order.price,
                    "method": order.method,
                    "status": order.status,
                    "date": order.date
                }),
                headers: {
                    "Content-Type": "application/json",
                    token: `Bearer ${user?.accessToken}`
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

            <div className="flex">
                <div className="w-2/3">
                    <form onSubmit={handleSubmit}>
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
                                <label className="block mb-1">Mã sản phẩm:</label>
                                <input
                                    type="text"
                                    name="bookID"
                                    value={order.bookID}
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
                                    name="method"
                                    value={order.method}
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
                            <textarea
                                type="date"
                                name="date"
                                value={order.date}
                                placeholder="Nhập mô tả truyện"
                                onChange={handleChange}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
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
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateOrder;