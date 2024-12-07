import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
function UserOrderCard({ order }) {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const navigate = useNavigate();

    const getStatusColor = () => {
        switch (order.status) {
            case "Đã thanh toán":
                return "bg-gradient-to-br from-teal-500 to-green-600";
            case "Đã giao hàng":
                return "bg-gradient-to-br from-teal-500 to-green-600";    
            case "Chờ thanh toán":
                return "bg-gradient-to-br from-red-400 to-red-500 ";
            case "Đã hủy":
                return "bg-red-500";
            case "Chờ giao hàng":
                return "bg-red-500";    
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="flex items-center w-full max-w-full bg-gray-200 border border-gray-200 rounded-lg shadow-md p-4 mb-4">
            {/* Nội dung thông tin */}
            <div className="ml-4 flex flex-col justify-between w-full">
                {/* Tên sách và trạng thái */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Mã đơn hàng: #{order.id}</h3>
                    <span className={`flex items-center mr-20 justify-center ${getStatusColor()} text-white px-3 py-2 rounded-lg`}>
                        {order.status}
                    </span>
                </div>

                <p className="text-lg text-gray-500">
                    <span className="font-medium">Người mua:</span> {order.accountName}
                </p>

                {/* Giá và ngày mua */}
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xl font-bold text-green-600">Tổng tiền: {order.totalPrice.toLocaleString("vi-VN")}₫</p>
                    <p className="text-base w-1/3 text-gray-400">Ngày mua: {new Date(order.date).toLocaleString('vi-VN')}</p>
                </div>
            </div>
            <div className="justify-center gap-2 p-4">
                {/* buttonEdit */}
                <NavLink
                    to={`/account/orders/orderDetails/${order.id}`}
                    state={{ order: order }}
                >
                    <button
                        className="items-center mb-4 justify-center mt-1 text-white w-full px-5 py-2.5 rounded-lg text-lg font-bold bg-[#18B088] hover:bg-[#148F70]  transition-colors">
                        Xem
                    </button>
                </NavLink>


            </div>

        </div >
    );
}

export default UserOrderCard