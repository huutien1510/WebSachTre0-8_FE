import "./BookDetail.css";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RatingComponent from "../../Rating/Rating";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
    getFavoriteStatus,
    addToFavorites,
    removeFromFavorites,
    addBookToCart,
} from "../../../api/apiRequest";
import Loading from "../../Loading/Loading";


function BookDetail() {
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const user1 = useSelector((state) => state.auth?.login?.currentUser?.data)
    const accessToken = useSelector(
        (state) => state.auth?.login?.currentUser?.data.accessToken
    );
    const id = useSelector(
        (state) => state.auth.login.currentUser?.data.account.id
    );
    const baseURL = import.meta.env.VITE_API_URL;
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const bookID = useParams().bookID;
    const [avgRating, setAvgRating] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [booksoftbought, setBookSoftBought] = useState(false);
    const dispatch = useDispatch();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (id && bookID) {
                try {
                    const status = await getFavoriteStatus(
                        id,
                        bookID,
                        dispatch,
                        user,
                        accessToken
                    );
                    setIsFavorite(status);
                } catch (error) {
                    console.error("Error checking favorite status:", error);
                }
            }
        };

        checkFavoriteStatus();
    }, [id, bookID]);

    const handleFavoriteClick = async () => {
        if (!user) {
            // Xử lý khi chưa đăng nhập
            alert("Vui lòng đăng nhập để thực hiện chức năng này");
            return;
        }
        try {
            if (isFavorite) {
                await removeFromFavorites(id, bookID, dispatch, user, accessToken);
            } else {
                await addToFavorites(id, bookID, dispatch, user, accessToken);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error updating favorite status:", error);
            alert("Có lỗi xảy ra khi cập nhật trạng thái yêu thích" + error);
        }
    };
    useEffect(() => {
        setLoading(true);
        const fetchBook = async () => {
            try {
                const response = await fetch(
                    `${baseURL}/books/${bookID}`
                );
                const json = await response.json();
                if (json.code != 500)
                    setBook(json.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);
    }, []);

    useEffect(() => {
        const fetchingBookSoftBought = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${baseURL}/orders/checkSoftBookBought/${id}/${bookID}`,
                );
                const json = await response.json();
                if (json.code != 500)
                    setBookSoftBought(json.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchingBookSoftBought();
    }, [booksoftbought]);

    const handleAddtoCart = async () => {
        try {
            await addBookToCart(id, bookID, dispatch, user, accessToken);
            toast.success("Thêm vào giỏ hàng thành công");
        }
        catch (error) {
            console.error("Error updating favorite status:", error);
            toast.error(error.response?.data?.message);
        }
    }
    const handleBuyHardBook = async () => {
        setLoading(true);   
        try {
            const selectedProducts = [{
                ...book,
                quantity: quantity,
            }]
            navigate("/checkout", { state: { selectedProducts } });
        }
        catch (error) {
            console.error("Error updating favorite status:", error);
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }
    const handleBuySoftBook = async () => {
        setLoading(true);
        try {
            const selectedProducts = [{
                ...book,
                quantity: 1,
            }]
            navigate("/checkout", { state: { selectedProducts } });
        }
        catch (error) {
            console.error("Error updating favorite status:", error);
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }
    const handleFreeBook = async () => {
        navigate(`/book/${bookID}/chaptercontent/1`);
    }
    if (loading) {
        return <Loading size="medium" />
    }



    if (!book) {
        return <p className="absolute top-16">Không có sách này</p>;
    }
    
    return (
        <div className="book_detail_page">
            <ToastContainer
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
                position="top-right"
            />
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 mt-16">
                {/* Book Image */}
                <div className="book_thumbnail">
                    <img src={book?.thumbnail} alt="Book Cover" className="rounded-lg shadow-lg" />
                    <span className={`absolute top-3 left-3 ${book?.price === 0 ? 'bg-emerald-500' : 'bg-red-500'} text-white px-4 py-2 rounded-md text-sm font-bold`}>{book?.price === 0 ? "Miễn phí" : book?.price?.toLocaleString("vi-VN") + "₫"}</span>
                </div>

                {/* Book Details */}
                <div className="book_info">
                    <h1 className="book_title">{book?.name}</h1>
                    <div className="book_rating">
                        <span className="book_rating_text text-white text-base">
                            {avgRating.toFixed(1)}
                        </span>
                        <Rating
                            name="size-large"
                            size="small"
                            value={avgRating}
                            readOnly
                            precision={0.1}
                            icon={<StarIcon fontSize="inherit" sx={{ color: "gold" }} />}
                            emptyIcon={
                                <StarBorderIcon fontSize="inherit" sx={{ color: "gold" }} />
                            }
                        />
                        <span className="text-sm text-gray-400">
                            • {ratings.length} đánh giá
                        </span>
                    </div>

                    <div className="text-sm space-y-1">
                        <p>
                            <span className="font-bold text-white">Tác giả:</span> {book?.author}
                        </p>
                        <div className="flex flex-wrap item-centers gap-1">
                            <strong>Thể loại:</strong>
                            {book?.genres?.map((genre) => {
                                return <p key={genre?.id}> {genre?.name}</p>
                            })}
                        </div>
                        <p className="flex items-center gap-x-2">
                            <strong className="font-bold text-white">Giá truyện:</strong>{"   "}
                            <span className="text-2xl text-[#FF375F] font-bold ">
                                {book?.price === 0
                                    ? "Miễn phí"
                                    : book?.price?.toLocaleString("vi-VN") + "₫"}
                            </span>
                        </p>
                    </div>

                    <div className="flex space-x-4 text-sm">
                        <button className="bg-gray-700 text-white px-3 py-1 rounded">
                            {book?.type === "Sach mem" || book?.type == null ? "Sách điện tử" : "Sách giấy"}
                        </button>

                    </div>

                    <div className="flex space-x-4 text-sm">
                        <button className="bg-gray-700 text-white px-3 py-1 rounded">
                            Đầy đủ
                        </button>
                        <button className="bg-gray-500 text-white px-3 py-1 rounded">
                            Tóm tắt
                        </button>
                    </div>
                    {book?.type === "Sach cung" &&
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-bold">Số lượng:</span>
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 "
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max={book?.quantity}
                                    value={quantity > book?.quantity ? book?.quantity : quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-12 h-8 text-center text-black border-0 outline-none appearance-none"
                                />

                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 "
                                >
                                    +
                                </button>
                            </div>
                        </div>}

                    <div className="flex items-center space-x-4 mt-4">
                        {(book?.type === "Sach mem" || book?.type == null) ? (
                            <>
                                {user === null ? (
                                    <NavLink to={'/login'}>
                                        <button
                                            className={`${book?.price == 0
                                                ? "bg-gradient-to-br from-teal-600 to-green-500"
                                                : "bg-gradient-to-br from-red-400 to-red-500"
                                                } text-white px-5 py-2.5 rounded-lg text-lg font-bold hover:bg-emerald-700 transition-colors`}
                                        >
                                            {book?.price == 0 ? "Đọc sách" : "Mua sách"}
                                        </button>
                                    </NavLink>
                                ) : (
                                    <button
                                        className={`${booksoftbought || book?.price == 0
                                            ? "bg-gradient-to-br from-teal-600 to-green-500"
                                            : "bg-gradient-to-br from-red-400 to-red-500"
                                            } text-white px-5 py-2.5 rounded-lg text-lg font-bold hover:bg-emerald-700 transition-colors`}
                                        onClick={(booksoftbought || book?.price == 0) ? handleFreeBook : handleBuySoftBook}
                                    >
                                        {(booksoftbought || book?.price == 0) ? "Đọc sách" : "Mua sách"}
                                    </button>
                                )}
                            </>
                        )
                            :
                            (<>
                                {user === null ? (
                                    <NavLink to={'/login'} className={`flex gap-x-4`}>
                                        <button
                                            className={`bg-white text-[#C92127] border-2 border-[#C92127] px-5 py-2.5 rounded-lg text-lg font-bold `}
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                        <button
                                            className={`bg-gradient-to-br from-red-400 to-red-500 text-white px-5 py-2.5 rounded-lg text-lg font-bold hover:bg-emerald-700 transition-colors`}
                                            
                                        >
                                            Mua sách
                                        </button>

                                    </NavLink>
                                ) : (
                                    <>
                                        <button
                                            className={`bg-white text-[#C92127] border-2 border-[#C92127] px-5 py-2.5 rounded-lg text-lg font-bold `}
                                            onClick={handleAddtoCart}
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                        <button
                                            onClick={handleBuyHardBook}
                                            className={`bg-gradient-to-br from-red-400 to-red-500 text-white px-5 py-2.5 rounded-lg text-lg font-bold hover:bg-emerald-700 transition-colors`}
                                            disabled={book?.quantity == 0}
                                        >
                                            Mua sách
                                        </button>
                                    </>
                                )}
                            </>)}

                        <button
                            onClick={handleFavoriteClick}
                            className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${isFavorite
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            disabled={!user}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill={isFavorite ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    <p className="text-gray-300 mt-4 leading-relaxed">
                        {book?.description}
                    </p>

                    {/* Rating */}
                    <h2 className="text-lg font-semibold mt-8">
                        Độc giả nói gì về “{book?.name}”
                    </h2>
                    <RatingComponent
                        bookId={book?.id}
                        avgRating={avgRating}
                        setAvgRating={setAvgRating}
                        ratings={ratings}
                        setRatings={setRatings}
                    />
                </div >
            </div >
        </div >
    );
}

export default BookDetail;
