import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updatebyAdmin } from '../../api/apiRequest';

const EditModal = ({ isOpen, onClose, user, onEditSuccess }) => {
    const dispatch = useDispatch();
    const user1 = useSelector((state) => state.auth.login?.currentUser);

    const [name, setName] = useState(user.name);
    const [date, setDate] = useState(user.birthday);
    const [role, setRole] = useState(user.is_admin ? 'Admin' : 'User');
    const [state, setState] = useState(user.is_active ? 'Active' : 'Inactive');
    const [sex, setSex] = useState(user.sex);
    const [phone, setPhone] = useState(user.phone);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            name,
            birthday: date,
            is_admin: role === 'Admin',
            is_active: state === 'Active',
            sex,
            phone,
        };
        try {
            const result = await updatebyAdmin(user1, user.id, user1?.data.accessToken, dispatch, newUser);
            console.log(result);
            if (result.success) {
                toast.success('Cập nhật thành công!');
                onEditSuccess();
                onClose();
            } else {
                toast.error(result.error || "Có lỗi xảy ra khi cập nhật!");
            }
        } catch (err) {
            toast.error(err.message || "Lỗi khi cập nhật!");
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return ''; // Handle null or undefined isoDate
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-lg w-full max-w-2xl"> {/* Dark background */}
                    <form onSubmit={handleSubmit} className="flex"> {/* Flex container for form and avatar */}
                        <div className="w-full">
                            {/* Input fields */}
                            <div className="mb-4">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="mt-1 p-2 w-full bg-gray-800 rounded text-gray-300"
                                    value={user.username}
                                    disabled
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="userId"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    ID người dùng
                                </label>
                                <input
                                    type="text"
                                    id="userId"
                                    className="mt-1 p-2 w-full bg-gray-800 rounded text-gray-300"
                                    value={user.id}
                                    disabled
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className="mt-1 p-2 w-full bg-gray-800 rounded text-gray-300"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="sdt"
                                    className="block text-sm font-medium text-gray-300"
                                >
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    id="sdt"
                                    className="mt-1 p-2 w-full bg-gray-800 rounded text-gray-300"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div className="w-1/2">
                                    <label
                                        htmlFor="birthday"
                                        className="block text-sm font-medium text-gray-300"
                                    >
                                        Ngày sinh
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="birthday"
                                            className="mt-1 p-2 w-full bg-gray-800 rounded text-gray-300"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="w-1/2">
                                    <label
                                        htmlFor="gender"
                                        className="block text-sm font-medium text-gray-300"
                                    >
                                        Giới tính
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="gender"
                                            className="mt-1 p-2 w-full bg-gray-800 rounded text-gray-300 appearance-none"
                                            value={sex}
                                            onChange={(e) => setSex(e.target.value)}
                                        >
                                            <option>Nam</option>
                                            <option>Nữ</option>
                                            <option>Khác</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div className="w-1/2">
                                    <label
                                        htmlFor="role"
                                        className="block text-sm font-medium text-gray-300"
                                    >
                                        Role
                                    </label>
                                    <div className={`relative ${user.is_admin ? "opacity-50 cursor-not-allowed" : ""}`}>
                                        <select
                                            disabled={user.is_admin}
                                            className="mt-1 p-2 w-full bg-gray-800 rounded text-gray-300 appearance-none"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option>Admin</option>
                                            <option>User</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="w-1/2">
                                    <label
                                        htmlFor="state"
                                        className="block text-sm font-medium text-gray-300"
                                    >
                                        State
                                    </label>
                                    <div className={`relative ${user.is_admin ? "opacity-50 cursor-not-allowed" : ""}`}>
                                        <select
                                            disabled={user.is_admin}
                                            className="mt-1 p-2 w-full bg-gray-800 rounded text-gray-300 appearance-none"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        >
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6"> {/* Buttons */}
                                <button
                                    type="button" // For cancel button
                                    onClick={onClose}
                                    className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded mr-2"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-emerald-500 text-white py-2 px-4 rounded"
                                >
                                    Cập nhập
                                </button>
                            </div>
                        </div>

                        <div className="ml-8 flex-shrink-0"> {/* Avatar section */}
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-4">
                                <img
                                    src={user.avatar}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* <button className="text-blue-400 hover:text-blue-600">Thay ảnh</button> */}
                        </div>
                    </form>
                </div>
            </div>
            
        </>
    );
};

export default EditModal;