import BookDetail from "./BookDetail.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Header from "./Components/Header/Header.jsx";
import Home from "./page/Home.jsx";
import Login from "./page/Login.jsx";
import Register from "./page/Register.jsx";
import ChapterReader from "./ChapterReader.jsx";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LayoutAdmin from "./page/LayoutAdmin.jsx";
import Dashboard from "./Components/Admin/Dashboard.jsx";
import Users from "./Components/Admin/Users.jsx";
import Page404 from "./page/Page404.jsx";
import BookManager from "./Components/Admin/Book/BookManager.jsx";
import AddBook from "./Components/Admin/Book/AddBook.jsx";
import UpdateBook from "./Components/Admin/Book/UpdateBook.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerificationSuccess from "./page/VerificationSuccess.jsx";
import AccountLayout from "./Components/AccountLayout/AccountLayout.jsx";
import Profile from "./page/Profile.jsx";
import Bookcase from "./page/Bookcase.jsx";
import Support from "./page/Support.jsx";
import ForgotPassword from "./page/ForgotPassword.jsx";
import ResetPassword from "./page/ResetPassword.jsx";
import RatingAdmin from "./Components/Admin/Rating/RatingAdmin.jsx";
import PaymentReturn from "./PaymentReturn.jsx";
import OrderCard from "./Components/Admin/Order/OrderCard.jsx";
import OrderManager from "./Components/Admin/Order/OrderManager.jsx";
import UpdateOrder from "./Components/Admin/Order/UpdateOrder.jsx";
import ChapterAdmin from "./Components/Admin/Chapter/ChapterAdmin.jsx";
import ChapterBookAdmin from "./Components/Admin/Chapter/ChapterBookAdmin.jsx";
import ChapterAddAdmin from "./Components/Admin/Chapter/ChapterAddAdmin.jsx";
import ChapterEditAdmin from "./Components/Admin/Chapter/ChapterEditAdmin.jsx";
import SearchPage from "./Components/Search/SearchPage.jsx";
import GenreBookPage from "./Components/GenreBook/GenreBookPage.jsx";
import FreeBook from "./Components/FreeBook/FreeBook.jsx";
import FeeBook from "./Components/FeeBook/FeeBook.jsx";
import UserOrder from "./page/UserOrder/UserOrder.jsx"
import UserOrderDetail from "./page/UserOrder/UserOrderDetail.jsx"
import Cart from "./Components/Cart/Cart.jsx";
import Order from "./Components/Order/Order.jsx";
import OrderSuccess from "./Components/Order/OrderSuccess.jsx";
import ContestManager from "./Components/Admin/Contest/ContestManager.jsx";
import AddContest from "./Components/Admin/Contest/AddContest.jsx";
import ContestDetail from "./Components/Admin/Contest/ContestDetail.jsx";
import UpdateContest from "./Components/Admin/Contest/UpdateContest.jsx";
import Contest from "./Components/Contest/UserContest.jsx";
import UserContest from "./Components/Contest/UserContest.jsx";
import UserContestDetail from "./Components/Contest/UserContestDetail.jsx";
import UserBlog from "./Components/Blog/UserBlog.jsx";
import BlogAdmin from "./Components/Admin/Blog/BlogAdmin.jsx";
import AddBlog from "./Components/Admin/Blog/AddBlog.jsx";
import DiscountAdmin from "./Components/Admin/Discount/Discount.jsx";
import AddDiscount from "./Components/Admin/Discount/AddDiscount.jsx";
import UserBlogDetails from "./Components/Blog/UserBlogDetails.jsx";
import BlogDetails from "./Components/Admin/Blog/BlogDetails.jsx";
import EditBlog from "./Components/Admin/Blog/EditBlog.jsx";
import UpdateDiscount from "./Components/Admin/Discount/UpdateDiscount.jsx";
import GiftManager from "./Components/Admin/Gift/GiftManager.jsx";
import AddGift from "./Components/Admin/Gift/AddGift.jsx";
import UpdateGift from "./Components/Admin/Gift/UpdateGift.jsx";
import RedeemPage from "./Components/RedeemPage/RedeemPage.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AttendanceModal from "./Components/ConfirmModal/AttendanceModal.jsx";
import { fetchAttendanceStatus } from "./redux/attendanceSlice.js";
import DesktopMenu from "./Components/Header/DesktopMenu.jsx";


function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const { checkedInToday } = useSelector((state) => state.attendance);
  const [showAttendance, setShowAttendance] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchAttendanceStatus({
        userId: user?.data?.account?.id,
        accessToken: user?.data?.accessToken
      }));
      if (!checkedInToday) {
        setShowAttendance(true);
      }
    } else {
      setShowAttendance(false);
    }
  }, [user, dispatch, checkedInToday]);
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <ToastContainer />
      <BrowserRouter>
        <Header>
          <DesktopMenu
            openAttendanceModal={() => setShowAttendance(true)}
          />
        </Header>
        <AttendanceModal open={showAttendance} onClose={() => setShowAttendance(false)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/genre/:genreId" element={<GenreBookPage />} />
          <Route path="/free-book" element={<FreeBook />} />
          <Route path="/fee-book" element={<FeeBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="changePoint" element={<RedeemPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contests" element={<div> <Outlet /> </div>} >
            <Route index element={<UserContest />} />
            <Route path="contestDetail/:contestID" element={<UserContestDetail />} />
          </Route>
          <Route path="/blogs" element={<div> <Outlet /> </div>} >
            <Route index element={<UserBlog />} />
            <Route path="blogDetails/:articleID" element={<UserBlogDetails />} />
          </Route>
          <Route path="/book/:bookID" element={<BookDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/checkout" element={<Order />} />
          <Route path="/book/:bookID/chaptercontent/:chapter_number" element={<ChapterReader />} />
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="books" element={<div><Outlet /></div>} >
              <Route index element={<BookManager />} />
              <Route path="addBook" element={<AddBook />} />
              <Route path="updateBook/:bookID" element={<UpdateBook />} />
            </Route>
            <Route path="ratings" element={<RatingAdmin />} />
            <Route path="orders" element={<div><Outlet /></div>} >
              <Route index element={<OrderManager />} />
              <Route path="updateOrder/:orderID" element={<UpdateOrder />} />
            </Route>

            <Route path="chapters" element={<div><Outlet /></div>}>
              <Route index element={<ChapterAdmin />} />
              <Route path="book/:bookId" element={<ChapterBookAdmin />} />
              <Route path="addChapter/:bookID/:newChapterNumber" element={<ChapterAddAdmin />} />
              <Route path="editChapter/:chapterID" element={<ChapterEditAdmin />}
              />
            </Route>
            <Route path="contests" element={<div><Outlet /></div>}>
              <Route index element={<ContestManager />} />
              <Route path="addContest" element={<AddContest />} />
              <Route path="contestDetail/:contestID" element={<ContestDetail />} />
              <Route path="editContest" element={<UpdateContest />}
              />
            </Route>
            <Route path="blogs" element={<div><Outlet /></div>} >
              <Route index element={<BlogAdmin />} />
              <Route path="addBlog" element={<AddBlog />} />
              <Route path="blogDetails/:articleID" element={<BlogDetails />} />
              <Route path="editBlog/:articleID" element={<EditBlog />} />
            </Route>
            <Route path="discounts" element={<div><Outlet /></div>}>
              <Route index element={<DiscountAdmin />} />
              <Route path="addDiscount" element={<AddDiscount />} />
              <Route path="updateDiscount/:discountID" element={<UpdateDiscount />} />
            </Route>
            <Route path="gifts" element={<div><Outlet /></div>} >
              <Route index element={<GiftManager />} />
              <Route path="addGift" element={<AddGift />} />
              <Route path="updateGift/:giftID" element={<UpdateGift />} />
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
          <Route
            path="/verification-success"
            element={<VerificationSuccess />}
          />
          <Route path="/account" element={<AccountLayout />}>
            <Route path="profile" element={<Profile />} />
            <Route path="bookcase" element={<Bookcase />} />
            <Route path="orders" element={<div> <Outlet /> </div>} >
              <Route index element={<UserOrder />} />
              <Route path="orderDetails/:orderID" element={<UserOrderDetail />} />
            </Route>
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="payment_return" element={<PaymentReturn />} />
        </Routes>
        <Footer />
      </BrowserRouter >
    </div>
  );
}

export default App;
