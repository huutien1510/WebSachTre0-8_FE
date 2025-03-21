import React, { useEffect, useState } from 'react'
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Rating.css'
import ReviewModal from './RatingModal';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const RatingComponent = ({ bookId, avgRating, setAvgRating, ratings, setRatings }) => {
    const user = useSelector((state) => state.auth.login?.currentUser);

    const [reloadRatings, setReloadRatings] = useState(false);
    // const [avgRating, setAvgRating] = useState(0);
    const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseURL}/ratings/book/${bookId}`);
                const json = await response.json();
                setRatings(json.data);
                if (json.data.length > 0) {
                    const sum = json.data.reduce((acc, rating) => acc + rating.star, 0);
                    setAvgRating(sum / json.data.length);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [reloadRatings]);

    const foundRating = ratings.find(rating => rating.accountID === user?.data?.account.id);
    const foundStar = ratings.find(rating => rating.accountID === user?.data?.account.id && rating.bookID === bookId);


    const handleRating = () => {
        if (!user) {
            navigate('/login');
        } else
            setIsModalOpen(true);
    }

    const handleReviewSuccess = () => {
        setReloadRatings((prev) => !prev); // Reload ratings
    };


    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <div className='bg-[#1C1C1E] rounded-2xl p-5'>
                <div className="flex items-center justify-around space-x-2 my-4">
                    <div>
                        <span className="text-6xl font-bold">{avgRating.toFixed(1)}</span>
                        <p className='text-center'>{ratings.length} đánh giá</p>
                    </div>
                    <Rating
                        name="size-large"
                        size="large"
                        value={avgRating}
                        readOnly
                        precision={0.1}
                        icon={<StarIcon fontSize="inherit" sx={{ color: 'gold' }} />}
                        emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: 'gold' }} />}
                    />
                    <button className='px-4 py-3 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl ' onClick={handleRating}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 inline-block">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        {foundRating ? <span className='pl-2'>Chỉnh sửa đánh giá</span> : <span className='pl-2'>Viết đánh giá</span>}
                    </button>
                </div>
            </div>
            <div className="space-y-4">
                {ratings.map((rating) => (
                    <div key={rating.id} className="flex items-start space-x-4 bg-[#1C1C1E] p-4 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl font-semibold">
                            <img src={rating.accountAvt} alt="avarta" className='w-full h-full rounded-full object-cover' />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="font-semibold ">{rating.accountName}</div>
                                <div className="text-sm text-gray-400">
                                    {new Date(rating.postDate).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </div>

                            </div>
                            <div className="flex justify-between items-center">
                                <p>{rating.content}</p>
                                <Rating
                                    name="size-small"
                                    value={rating.star}
                                    size="small"
                                    readOnly
                                    icon={<StarIcon fontSize="inherit" sx={{ color: 'gold' }} />}
                                    emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: 'gold' }} />}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ReviewModal
                bookId={bookId}
                foundRating={foundRating}
                star={foundStar?.star}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleReviewSuccess}

            />
        </>
    );
};

export default RatingComponent;
