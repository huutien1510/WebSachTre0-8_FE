import React, { useState, useEffect } from "react";
import axios from "axios";
import { QrCode, CreditCard, Wallet, Package } from 'lucide-react'
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from 'date-fns';
import { checkOut, removeBookToCart } from "../../api/apiRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Order = () => {
  const user = useSelector((state) => state.auth?.login?.currentUser?.data?.account);
  const user1 = useSelector((state) => state.auth?.login?.currentUser);
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.data.accessToken
  );
  const id = useSelector(
    (state) => state.auth.login.currentUser?.data.account.id
  );
  const [paymentUrl, setPaymentUrl] = useState(null);
  const cartItems = useSelector((state) => state.cart.carts.cartItems)
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    province: "",
    district: "",
    ward: "",
    address: "",
    paymentMethod: "momo"
  });
  const location = useLocation();
  const { selectedProducts } = location.state || { selectedProducts: [] };
  let [firstType] = selectedProducts.map((product) => product.type) ;
  
  const cartItem = useSelector((state) => state.cart.carts.cartItems);


  const toTalprice = Math.round(
    selectedProducts.reduce((acc, product) => acc + product.price * product.quantity, 0)
  );


  const [locations, setLocations] = useState({
    provinces: [],
    districts: [],
    wards: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePaymentMethodSelect = (method) => {
    setFormData(prevState => ({
      ...prevState,
      paymentMethod: method
    }))
  }

  // Fetch provinces data on mount
  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((response) => {
        setLocations((prev) => ({
          ...prev,
          provinces: response.data,
        }));
      })
      .catch((error) => console.error("Error fetching location data:", error));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update dependent dropdowns
    if (name === "province") {
      const selectedProvince = locations.provinces.find(
        (p) => p.Id === value
      );
      setLocations((prev) => ({
        ...prev,
        districts: selectedProvince?.Districts || [],
        wards: [],
      }));
      setFormData((prev) => ({
        ...prev,
        district: "",
        ward: "",
      }));
    }

    if (name === "district") {
      const selectedDistrict = locations.districts.find(
        (d) => d.Id === value
      );
      setLocations((prev) => ({
        ...prev,
        wards: selectedDistrict?.Wards || [],
      }));
      setFormData((prev) => ({
        ...prev,
        ward: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Details:", formData);
    // Process the data as needed
  };
  const handleCheckOut = async () => {
    if (firstType === null){
      firstType = "Sach mem";
    }
    let addressOrder = "";
    if (firstType === "Sach cung") {
      const province = locations.provinces.find((p) => p.Id === formData.province);
      const district = locations.districts.find((d) => d.Id === formData.district);
      const ward = locations.wards.find((w) => w.Id === formData.ward);
      addressOrder = `${formData.address}, ${ward.Name}, ${district.Name}, ${province.Name}`;
    } 
    const date = new Date();
    const formattedDate = format(new Date(date), "dd/MM/yyyy HH:mm:ss");
      const newOrder = {
        totalPrice: toTalprice,
        address: addressOrder,
        date: formattedDate,
        paymentMethod: formData.paymentMethod,
        account: user.id,
        orderDetails: selectedProducts.map((product) => {
          return {
            bookID: product.id,
            quantity: product.quantity
          }
        })
      }
    try {
      const response = await checkOut(dispatch, user1, newOrder, accessToken);
      if (response.code === 1000) {
        toast.success(response.message);
        const orders = response.data;
        setPaymentUrl(response.data.momoPayUrl);
        for (let product of selectedProducts) {

          const isProductInCart = cartItem.some((item) => item.id === product.id);

          if (isProductInCart) {
            await removeBookToCart(id, product.id, dispatch, user1, accessToken);
          }
        }

        if (response.data.paymentMethod === "cod") {
          navigate(`/ordersuccess`, { state: { orders } });
        }
        else {
          window.location.href = orders.momoPayUrl;
        }
      }
    }
    catch (error) {
      console.error("Error checking out:", error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
    }
  }

  return (

    <div className="min-h-screen bg-black text-white p-4 py-28">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      {firstType === "Sach cung" && (<h1 className="text-2xl font-bold mb-6 ml-24 pl-3">Địa chỉ nhận hàng</h1>)}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-2">
          {firstType === "Sach cung" && (
            <div className="bg-zinc-900 p-6 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block">Họ và tên người nhận</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nhập họ và tên người nhận"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={user?.name}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={user?.phone}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập email"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={user?.email}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block">Tỉnh/Thành phố</label>
                  <select
                    name="province"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                    value={formData.province}
                    onChange={handleChange}
                  >
                    <option value="">Chọn Tỉnh/Thành Phố</option>
                    {locations.provinces.map((province) => (
                      <option key={province.Id} value={province.Id}>
                        {province.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block">Quận/Huyện</label>
                  <select
                    name="district"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!locations.districts.length}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {locations.districts.map((district) => (
                      <option key={district.Id} value={district.Id}>
                        {district.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block">Xã/Phường/Thị trấn</label>
                  <select
                    name="ward"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                    value={formData.ward}
                    onChange={handleChange}
                    disabled={!locations.wards.length}
                  >
                    <option value="">Chọn Xã/Phường/Thị Trấn</option>
                    {locations.wards.map((ward) => (
                      <option key={ward.Id} value={ward.Id}>
                        {ward.Name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block">Địa chỉ nhận hàng</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Nhập Địa chỉ nhận hàng (ghi rõ số nhà)"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                    value={formData.address}
                    onChange={handleChange}
                  />

                </div>

                {/* <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
              >
                Lưu địa chỉ
              </button> */}
              </form>
            </div>
          )}
          {/* Sản phẩm */}
          <h2 className="my-6 text-2xl font-bold ">Kiểm tra lại sản phẩm</h2>
          <div className="relative overflow-x-auto bg-zinc-900 rounded-md">
            <table className="w-full text-left">
              <thead className="text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 w-1/2">Đơn giá</th>
                  <th scope="col" className="px-6 py-3 text-center">Số lượng</th>
                  <th scope="col" className="px-6 py-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr key={product.id} className="border-t border-zinc-800">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-20 h-28 object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="mt-1">{product.price.toLocaleString()}đ</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="w-16 text-center bg-zinc-800 border border-zinc-700 rounded p-1">{product.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">{(product.price * product.quantity).toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Phương thức thanh toán */}
          <h2 className="my-6 text-2xl font-bold ">Hình thức thanh toán</h2>
          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="space-y-4">
              <button
                onClick={() => handlePaymentMethodSelect('momo')}
                className={`relative w-full flex items-center space-x-4 p-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors ${formData.paymentMethod === 'ewallet' ? 'border-2 border-emerald-500' : 'border-2 border-zinc-800'
                  }`}
              >
                <Wallet className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-medium">MoMo</div>
                </div>
                {formData.paymentMethod === 'momo' && (
                  <div className="ml-auto absolute right-3">
                    <svg
                      className="w-6 h-6 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>

              {firstType === "Sach cung" && (
                <button
                  onClick={() => handlePaymentMethodSelect('cod')}
                  className={`relative w-full flex items-center space-x-4 p-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors ${formData.paymentMethod === 'cod' ? 'border-2 border-emerald-500' : 'border-2 border-zinc-800'
                    }`}
                >
                  <Package className="w-8 h-8" />
                  <div className="text-left">
                    <div className="font-medium">Thanh toán khi nhận hàng</div>
                  </div>
                  {formData.paymentMethod === 'cod' && (
                    <div className="ml-auto absolute right-3">
                      <svg
                        className="w-6 h-6 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>




        {/* Order Summary Section */}
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Thành tiền</span>
                  <span>{toTalprice.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>0đ</span>
                </div>
                <div className="border-t border-zinc-700 pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Tổng số tiền</span>
                    <span>{toTalprice.toLocaleString()}đ</span>
                  </div>
                </div>
                <button className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded mt-4 `}
                  disabled={formData.paymentMethod == null} onClick={handleCheckOut}>
                  Mua hàng
                </button>
              </div>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg mt-2">
              <div className="space-y-4">
                <input
                  type="text"
                  name="discount"
                  placeholder="Nhập mã giảm giá"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                  value={formData.discount}
                  onChange={handleChange}
                />
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded mt-4">
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
