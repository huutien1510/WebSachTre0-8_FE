import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation, NavLink } from 'react-router-dom';
import OrderDetailCard from './OrderDetailCard';
import { checkOut } from '../../api/apiRequest';
import { format } from 'date-fns';
function UserOrderDetail() {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const user1 = useSelector((state) => state.auth?.login?.currentUser);
    const accessToken = useSelector(
        (state) => state.auth?.login?.currentUser?.data?.accessToken
    );
    const id = useSelector(
        (state) => state.auth?.login?.currentUser?.data?.account.id
    );
    const orderID = useParams().orderID
    const location = useLocation();
    const navigate = useNavigate()
    const [order, setOrder] = useState(location.state?.order)
    const [paymentUrl, setPaymentUrl] = useState(null)
    const book = order?.orderDetails[0]
    const dispatch = useDispatch();

    useEffect(() => {
        const buyBook = async () => {
            try {
                const response = await fetch(`http://localhost:8080/orders/retryOrder/${order.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json(); 
                setPaymentUrl(data?.data?.momoPayUrl)                   
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
                                        value={order.accountID}
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
                                    value={order.date}
                                    disabled
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed"
                                />
                            </div>
                            {book?.bookType === "Sach cung" && (
                                <div className='mb-4'>
                                    <label className='block mb-1 w-full'>Địa chỉ</label>
                                    <input type="text" name="address" disabled value={order.address} className='w-full  bg-[#262626] p-3 rounded-lg border-gray-600 border opacity-50 cursor-not-allowed' />
                                </div>
                            )}
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