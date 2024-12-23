import React, { useEffect, useState } from 'react';
import { deleteUser, getAllUsers } from '../../api/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal/ComfirmModal';
import EditModal from './EditModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LiaTimesCircle } from "react-icons/lia";
import { CiCircleCheck } from "react-icons/ci";
import { TbLock } from "react-icons/tb";

export default function Users() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const users = useSelector((state) => state.users.users?.allUsers);
    const msg = useSelector((state) => state.users?.msg);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        if (user?.data.accessToken) {
            getAllUsers(user?.data.accessToken, dispatch, user);
        }
    }, []);

    const openModal = (id) => {
        setUserIdToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserIdToDelete(null);
    };

    const confirmDelete = async () => {
        if (userIdToDelete) {
            await deleteUser(userIdToDelete, user?.data.accessToken, dispatch, user);
            await getAllUsers(user?.data.accessToken, dispatch, user);
            toast.success(msg?.data);
        }
        closeModal();
    };

    const openEditModal = (user) => {
        setEditUser(user);
        setIsModalEditOpen(true);
    };

    const closeEditModal = () => {
        setIsModalEditOpen(false);
        setEditUser(null);
    };

    const onEditSuccess = () => {
        getAllUsers(user?.data.accessToken, dispatch, user);
    };


    return (
        <>
            <ToastContainer />
            <div className="p-6 min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-white">Quản lý tài khoản</h1>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[#18B088] text-lg font-semibold">Tất cả tài khoản</span>
                </div>

                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                    <table className="min-w-full bg-white border border-emerald-500 rounded-lg">
                        <thead>
                            <tr className="bg-emerald-500 text-black">
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold text-black">ID</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">UserName</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Email</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">State</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Role</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.data.map((user) => (
                                <tr key={user.id} className={"bg-gray-200 hover:bg-gray-100 transition duration-200"}>
                                    <td className="py-3 px-4 border-b text-gray-800">{user.id}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{user.username}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{user.email}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">
                                        {user.is_active ?
                                            <div className='text-emerald-400 text-3xl text-center'><CiCircleCheck /></div>
                                            : <div className='text-red-700 text-3xl'><LiaTimesCircle /></div>}
                                    </td>
                                    <td className="py-3 px-4 border-b text-gray-800">{user.is_admin ? "Admin" : "User"}</td>
                                    <td className="py-3 px-4 border-b flex space-x-4">
                                        <button onClick={() => openEditModal(user)} className="text-blue-500 hover:text-blue-700 font-bold transition duration-150">Update</button>
                                        <button onClick={() => openModal(user.id)} disabled={user.is_admin} className={`text-red-500 hover:text-red-700 font-bold transition duration-150 ${user.is_admin ? "opacity-50 cursor-not-allowed " : ""}`} >{user.is_deleted ? "Unlock" : "Lock"}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Confirm Delete Modal */}
                <ConfirmModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={confirmDelete}
                />

                {/* Edit Modal */}
                {
                    isModalEditOpen && editUser && <EditModal
                        isOpen={isModalEditOpen}
                        onClose={closeEditModal}
                        user={editUser}
                        onEditSuccess={() => getAllUsers(user?.data.accessToken, dispatch, user)}
                    />
                }
            </div>
        </>
    );
}