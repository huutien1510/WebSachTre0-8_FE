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





function App() {
  return (
    <div className="bg-black">
      <ToastContainer />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/genre/:genreId" element={<GenreBookPage />} />
          <Route path="/free-book" element={<FreeBook />} />
          <Route path="/fee-book" element={<FeeBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/book/:bookID" element={<BookDetail />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/ordersuccess" element={<OrderSuccess/>} />
          <Route path="/checkout" element={<Order/>}/>
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
            <Route path="chapter" element={<div><Outlet /></div>}>
              <Route index element={<ChapterAdmin />} />
              <Route path="book/:bookId" element={<ChapterBookAdmin />} />
              <Route path="addChapter/:bookId" element={<ChapterAddAdmin />} />
              <Route
                path="editChapter/:bookID/:chapterNumber"
                element={<ChapterEditAdmin />}
              />
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
