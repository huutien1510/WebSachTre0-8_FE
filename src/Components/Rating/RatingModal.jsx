import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { createRating, updateRating } from '../../api/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const ReviewModal = ({ bookId, foundRating, star, isOpen, onClose, onSuccess }) => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const [rating, setRating] = useState(foundRating ? star : 5);  // Khởi tạo với giá trị defaultValue
    const [comment, setComment] = useState('');
    // Reset rating về defaultValue khi modal mở
    useEffect(() => {
        if (isOpen) {
            setRating(foundRating ? star : 5);
            setComment(foundRating ? foundRating.content : '');
        }
    }, [isOpen, foundRating, star]);

    if (!isOpen) return null;

    const handleRatingChange = (event, newValue) => {
        if (newValue) {
            setRating(newValue);
        } else {
            setRating(rating);
        }
    };

    const handleRating = async (e) => {
        e.preventDefault();
        const newRating = {
            star: rating,
            content: comment,
            postDate: new Date(),
            bookID: bookId,
            accountID: user?.data?.account.id,
        };
        try {
            if (!foundRating) {
                const res = await createRating(newRating, user?.data.accessToken, user, dispatch);
                if (res.data.code === 200) {
                    toast.success('Đánh giá thành công!');
                    onSuccess();
                    onClose();
                }
            } else {
                const res = await updateRating(foundRating.id, newRating, user?.data.accessToken, user, dispatch);
                if (res.success) {
                    toast.success('Cập nhật thành công!');
                    onSuccess();
                    onClose();
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#606266] bg-opacity-90 rounded-lg p-6 w-[400px] relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-white text-xl font-bold mb-4 text-center">
                    Đánh giá
                </h2>

                {/* Rating stars */}
                <div className="mb-4 flex justify-start items-center space-x-2">
                    <p className="text-white text-base">Đánh giá</p>
                    <Rating
                        name="size-large"
                        size="medium"
                        value={rating}
                        precision={1}
                        icon={<StarIcon fontSize="inherit" sx={{ color: 'gold' }} />}
                        emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: 'gold' }} />}
                        onChange={handleRatingChange}
                    />
                </div>

                {/* Comment */}
                <div className="mb-4 ">
                    <p className="text-white mb-2">Nhận xét</p>
                    <textarea
                        className="w-full h-24 p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none"
                        placeholder="Hãy cho chúng mình một vài nhận xét và đóng góp ý kiến nhé"
                        row={5}
                        maxLength={250}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    {/* <p className="text-gray-400 text-sm text-right">{comment.length}/{maxChars}</p> */}
                </div>


                {/* Submit button */}
                <button
                    onClick={handleRating}
                    className={`w-full py-3 rounded-lg text-white ${(comment === "")
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 duration-300"
                        }`}
                    disabled={comment === ""}
                >
                    Gửi đánh giá
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;
