import "./BookDetail.css";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RatingComponent from "./Components/Rating/Rating";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
    getFavoriteStatus,
    addToFavorites,
    removeFromFavorites,
} from "./api/apiRequest";
function BookDetail() {
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const user1 = useSelector((state) => state.auth?.login?.currentUser?.data)
    const accessToken = useSelector(
        (state) => state.auth?.login?.currentUser?.data.accessToken
    );
    const id = useSelector(
        (state) => state.auth.login.currentUser?.data.account.accountId
    );
    const [isFavorite, setIsFavorite] = useState(false);
    const bookID = useParams().bookID;
    const [avgRating, setAvgRating] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const [book, setBook] = useState(location.state.book || null);


    // useEffect(() => {
    //     const checkFavoriteStatus = async () => {
    //         if (id && bookID) {
    //             try {
    //                 const status = await getFavoriteStatus(
    //                     id,
    //                     bookID,
    //                     dispatch,
    //                     user,
    //                     accessToken
    //                 );
    //                 setIsFavorite(status);
    //             } catch (error) {
    //                 console.error("Error checking favorite status:", error);
    //             }
    //         }
    //     };

    //     checkFavoriteStatus();
    // }, [id, bookID]);
    // const handleFavoriteClick = async () => {
    //     if (!user) {
    //         // Xử lý khi chưa đăng nhập
    //         alert("Vui lòng đăng nhập để thực hiện chức năng này");
    //         return;
    //     }
    //     try {
    //         if (isFavorite) {
    //             await removeFromFavorites(id, bookID, dispatch, user, accessToken);
    //         } else {
    //             await addToFavorites(id, bookID, dispatch, user, accessToken);
    //         }
    //         setIsFavorite(!isFavorite);
    //     } catch (error) {
    //         console.error("Error updating favorite status:", error);
    //         alert("Có lỗi xảy ra khi cập nhật trạng thái yêu thích" + error);
    //     }
    // };
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);
    }, []);

    // useEffect(() => {
    //     const checkIsBuy = async () => {
    //         try {
    //             if (user1?.account?.is_admin) return;
    //             const response2 = await fetch(
    //                 `http://localhost:3000/api/order/checkPaidBook/${bookID}/${user1?.account?.accountId}`,
    //                 {
    //                     method: "GET",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         token: `Bearer ${user1?.accessToken}`,
    //                     },
    //                 }
    //             );
    //             if (response2.status === 400) {
    //                 const response3 = await fetch(
    //                     "http://localhost:3000/api/order/buybook",
    //                     {
    //                         method: "POST",
    //                         body: JSON.stringify({
    //                             bookID: bookID, // ID của sách, kiểu Number
    //                             accountID: user1.account.accountId, // ID của tài khoản, kiểu Number
    //                             price: book.data.price, // Giá trị của đơn hàng, kiểu Number (tùy chọn, có giá trị mặc định là 0)
    //                             method: "MOMO", // Phương thức thanh toán, kiểu String
    //                             status: "Chờ thanh toán", // Trạng thái của đơn hàng, kiểu String
    //                             date: new Date(), // Ngày đặt hàng, kiểu Date
    //                         }),
    //                         headers: {
    //                             "Content-Type": "application/json",
    //                             token: `Bearer ${user1?.accessToken}`,
    //                         },
    //                     })
    //                 const json3 = await response3.json();
    //                 setPaymentUrl(json3.paymentUrl);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };


    //     if (book && book?.data?.price > 0 && user) checkIsBuy();
    // }, [book]);

    if (!book) {
        return <p className="absolute top-16">Không có sách này</p>;
    }

    return (
        <div className="book_detail_page">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 mt-16">
                {/* Book Image */}
                <div className="book_thumbnail">
                    <img src={book?.thumbnail} alt="Book Cover" className="rounded-lg shadow-lg" />
                    <span className={`absolute top-3 left-3 ${book?.price === 0 ? 'bg-emerald-500' : 'bg-red-500'} text-white px-4 py-2 rounded-md text-sm font-bold`}>{book?.price === 0 ? "Miễn phí" : book?.price?.toLocaleString("vi-VN") + "₫"}</span>
                </div>

                {/* Book Details */}
                <div className="book_info">
                    <h1 className="book_title">{book.name}</h1>
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
                            <strong>Tác giả:</strong> {book?.author}
                        </p>
                        <div className="flex flex-wrap item-centers gap-1">
                            <strong>Thể loại:</strong>
                            {book?.genres.map((genre) => {
                                return <p key={genre.id}> {genre.name}</p>
                            })}
                        </div>
                        <p>
                            <strong>Giá truyện:</strong>{" "}
                            {book.price === 0
                                ? "Miễn phí"
                                : book?.price?.toLocaleString("vi-VN") + "₫"}
                        </p>
                    </div>

                    <div className="flex space-x-4 text-sm">
                        <button className="bg-gray-700 text-white px-3 py-1 rounded">
                            Sách điện tử
                        </button>
                        <button className="bg-gray-500 text-white px-3 py-1 rounded">
                            Sách nói
                        </button>
                        <button className="bg-gray-500 text-white px-3 py-1 rounded">
                            Sách giấy
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
                    <div className="flex items-center space-x-4 mt-4">
                        {user === null &&
                            <NavLink to={'/login'} >
                                <button
                                    className={`${book?.price == 0
                                        ? "bg-gradient-to-br from-teal-600 to-green-500"
                                        : "bg-gradient-to-br from-red-400 to-red-500"
                                        } text-white px-5 py-2.5 rounded-lg text-lg font-bold hover:bg-emerald-700 transition-colors`}
                                >
                                    {(book?.price == 0) ? "Đọc sách" : "Mua sách"}
                                </button>
                            </NavLink>}
                        {!(user === null) &&
                            <NavLink to={(paymentUrl || `/book/${bookID}/chaptercontent/1`)} >
                                <button
                                    className={`${(paymentUrl === null || book?.price == 0)
                                        ? "bg-gradient-to-br from-teal-600 to-green-500"
                                        : "bg-gradient-to-br from-red-400 to-red-500"
                                        } text-white px-5 py-2.5 rounded-lg text-lg font-bold hover:bg-emerald-700 transition-colors`}
                                >
                                    {(paymentUrl === null || book?.price == 0) ? "Đọc sách" : "Mua sách"}
                                </button>
                            </NavLink>}

                        <button
                            // onClick={handleFavoriteClick}
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
                        {book.description}
                    </p>

                    {/* Rating */}
                    <h2 className="text-lg font-semibold mt-8">
                        Độc giả nói gì về “{book.name}”
                    </h2>
                    <RatingComponent
                        bookId={book.id}
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
