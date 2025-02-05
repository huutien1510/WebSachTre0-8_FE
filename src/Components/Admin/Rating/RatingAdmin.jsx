import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, } from 'react-redux'
import { deleteRating, getAllRating } from '../../../api/apiRequest';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const RatingAdmin = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate()
    const [ratings, setRatings] = useState([]);
    const dispatch = useDispatch();
    const handleGetAllRatings = async () => {
        try {
            const res = await getAllRating(user?.data.accessToken, dispatch, user);
            if (res.success) {
                console.log("Ratings: ", res.data.data);
                setRatings(res.data.data);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        handleGetAllRatings();
    }, []);

    const handleDeleteRating = async (id) => {
        try {
            const res = await deleteRating(id, user?.data.accessToken, user, dispatch);
            if (res.success) {
                toast.success('Xóa đánh giá thành công!');
                handleGetAllRatings();
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="p-6 min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-white">Quản lý đánh giá</h1>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[#18B088] text-lg font-semibold">Tất cả các đánh giá</span>
                </div>

                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                    <table className="min-w-full bg-white border border-emerald-500 rounded-lg">
                        <thead>
                            <tr className="bg-emerald-500 text-black">
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold text-black">ID</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">UserName</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Tên truyện</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Số sao</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Content</th>
                                <th className="py-3 px-4 border-b border-gray-300 text-left font-semibold ">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings?.map((rating, index) => (
                                <tr key={rating.id} className={"bg-gray-200 hover:bg-gray-100 transition duration-200"}>
                                    <td className="py-3 px-4 border-b text-gray-800">{index + 1}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{rating.accountName}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{rating.bookName}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">
                                        <Rating
                                            name="size-large"
                                            size="medium"
                                            value={rating.star}
                                            readOnly
                                            precision={0.1}
                                            icon={<StarIcon fontSize="inherit" sx={{ color: 'gold' }} />}
                                            emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: 'gold' }} />}
                                        />
                                    </td>
                                    <td className="py-3 px-4 border-b text-gray-800">{rating.content}</td>
                                    <td className="py-3 px-4 border-b flex space-x-2">
                                        <button onClick={() => handleDeleteRating(rating.id)} className="text-red-500 hover:text-red-700 font-bold transition duration-150">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default RatingAdmin