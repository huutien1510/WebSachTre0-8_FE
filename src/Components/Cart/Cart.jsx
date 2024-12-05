import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../redux/cartSlice';
import { removeBookToCart } from '../../api/apiRequest';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const cartItems = useSelector((state) => state.cart.carts.cartItems);
  const [products, setProducts] = useState([]);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.data.accessToken
  );
  const id = useSelector(
    (state) => state.auth.login.currentUser?.data.account.id
  );
  const cartItemsCount = useSelector(state => state?.cart?.carts?.cartItems?.length);
  useEffect(() => {
    const initializedProducts = cartItems?.map(product => ({
      ...product,
      selected: true,
      quantity: 1
    }));
    setProducts(initializedProducts);
  }, [cartItems]);

  const dispatch = useDispatch();
  const handleremove = async (bookID) => {
    try {
      console.log("accountID: ", accessToken);
      await removeBookToCart(id, bookID, dispatch, user, accessToken);
    }
    catch (error) {
      console.error("Error updating favorite status:", error);
    }
  }
  const navigate = useNavigate();

  const handleOrder = () => {
    const selectedProducts = products.filter(p => p.selected);
    navigate('/checkout', { state: { selectedProducts } });
  };


  const toggleSelect = (id) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const updateQuantity = (id, delta) => {
    setProducts(products?.map(p =>
      p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
    ));
  };

  const totalAmount = products?.filter(p => p.selected)
    .reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 py-28">
      <h1 className=" font-bold text-xl text-white mb-6">GIỎ HÀNG</h1>
      {cartItemsCount === 0 ? (
        <div className="flex flex-col justify-center items-center text-gray-500 gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-14 h-14"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <p className="text-2xl font-bold">Giỏ hàng trống</p>
          <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="w-[400px] p-4 text-left">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={products?.every(p => p.selected)}
                          onChange={() => {
                            const allSelected = products.every(p => p.selected);
                            setProducts(products.map(p => ({ ...p, selected: !allSelected })));
                          }}
                        />
                        Tất cả ({products?.length} sản phẩm)
                      </label>
                    </th>
                    <th className="w-[150px] p-4 text-center">Đơn giá</th>
                    <th className="w-[150px] p-4 text-center">Số lượng</th>
                    <th className="w-[150px] p-4 text-center ">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map(product => (
                    <tr key={product.id} className="border-b">
                      <td className="p-4">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            className="mt-4 rounded border-gray-300"
                            checked={product.selected}
                            onChange={() => toggleSelect(product.id)}
                          />
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-20 h-20 object-cover"
                          />
                          <div className="flex-1 pt-3">
                            <p className="text-sm line-clamp-2">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-center">
                          <p className="text-red-500">{product.price.toLocaleString()}đ</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center">
                          <button
                            className="w-8 h-8 border rounded-l hover:bg-gray-50"
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="w-12 h-8 text-center border-t border-b"
                            value={product.quantity}
                            readOnly
                          />
                          <button
                            className="w-8 h-8 border rounded-r hover:bg-gray-50"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-red-500 ml-auto">
                            {(product.price * product.quantity).toLocaleString()}đ
                          </span>
                          <button className="text-gray-500 ml-4" >
                            <Trash2 className="w-5 h-5" onClick={() => handleremove(product.id)} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between mb-4">
                <span className="text-gray-500">Tổng tiền hàng</span>
                <span>{totalAmount?.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between mb-4 text-lg font-medium">
                <span>Tổng tiền thanh toán</span>
                <span className="text-red-500">{totalAmount?.toLocaleString()}đ</span>
              </div>
              <p className="text-sm text-gray-500 text-right mb-4">
                (Đã bao gồm VAT nếu có)
              </p>
              <button onClick={handleOrder} className={`w-full  text-white py-3 rounded-lg ${products?.filter(p => p.selected).length == 0 ? "bg-red-300" : "bg-red-500"}`} disabled={products?.filter(p => p.selected).length == 0} >
                Mua Hàng ({products?.filter(p => p.selected).length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Cart;

