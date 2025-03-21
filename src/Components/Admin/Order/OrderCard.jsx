import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';
import DeleteOrderConfirmModal from "./DeleteOrderConfirmModal"
function OrderCard({ order }) {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const [orderIDToDelete, setOrderIDToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const typeBook = order?.orderDetails[0]?.bookType;
    const baseURL = import.meta.env.VITE_API_URL;

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

    const deleteOrder = async () => {
        try {
            const response = await fetch(`${baseURL}/orders/deleteOrder/${orderIDToDelete}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user?.accessToken}`
                }
            });
            return response;
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const openModal = (id) => {
        setOrderIDToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setOrderIDToDelete(null);
    };

    const confirmDelete = async () => {
        if (orderIDToDelete) {
            const response = await deleteOrder();
            if (response.status === 200) {
                toast.success("Xóa thành công")
                navigate("/admin/orders")
            }
            else toast.error("Xóa thất bại")
        }
        closeModal();
    };

    return (
        <div className="flex items-center w-full max-w-full bg-gray-200 border border-gray-200 rounded-lg shadow-md p-4 mb-4">
            {/* Nội dung thông tin */}
            <div className="ml-4 flex flex-col justify-between w-full">
                <h3 className="text-lg font-semibold text-gray-800">Đơn hàng: {typeBook == "Sach mem" ? "Sách điện tử" : "Sách giấy"}</h3>
                {/* Tên sách và trạng thái */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Mã đơn hàng: #{order?.id}</h3>
                    <span className={`flex items-center mr-20 justify-center ${getStatusColor()} text-white px-3 py-2 rounded-lg`}>
                        {order?.status}
                    </span>
                </div>

                {/* Người mua */}
                <p className="text-lg text-gray-500">
                    <span className="font-medium">Người mua:</span> {order?.accountName}
                </p>

                {/* Giá và ngày mua */}
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xl font-bold text-green-600">Tổng tiền: {order?.totalPrice.toLocaleString("vi-VN")}₫</p>
                    <p className="text-base w-1/3 text-gray-400">Ngày mua: {order?.date}</p>
                </div>
            </div>
            <div className="justify-center gap-2 p-4">
                {/* buttonEdit */}
                <NavLink to={`/admin/orders/updateOrder/${order?.id}`}
                    state={{ order: order }}
                >
                    <button
                        className="flex items-center mb-4 justify-center mt-1 text-white w-full px-5 py-2.5 rounded-lg text-lg font-bold bg-[#18B088] hover:bg-[#148F70]  transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <rect x="3" y="4" width="12" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M14 3l5 5-10 10H6v-3l10-10z" />
                            <path d="M5 9h8M5 12h8M5 15h8" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Edit
                    </button>
                </NavLink>

                {/* buttonDelete */}
                {/* <button onClick={() => openModal(order?.id)}
                    className="flex items-center justify-center mt-1 text-white px-5 py-2.5 rounded-lg text-lg font-bold bg-red-500  hover:bg-red-700 transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M8 3h8c0.55 0 1 .45 1 1v1H7V4c0-.55.45-1 1-1z" />
                        <path d="M4 6h16v2H4V6z" />
                        <path d="M6 8v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6zm2.75  2.5h1.5v6h-1.5v-6zm2.75 0h1.5v6h-1.5v-6zm2.75 0h1.5v6h-1.5v-6z" />
                    </svg>
                    Delete
                </button> */}
            </div>

            {/* Confirm Delete Modal */}
            <DeleteOrderConfirmModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
}

export default OrderCard