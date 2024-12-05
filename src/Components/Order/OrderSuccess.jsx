import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const OrderSuccess = () => {
    useEffect(() => {
        // Trigger confetti animation on component mount
        const duration = 3 * 1000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        }, 250)

        return () => clearInterval(interval)
    }, [])
    const location = useLocation();
    const { orders } = location.state || { orders: null };
    const user = useSelector((state) => state.auth?.login.currentUser);
    console.log("orders", orders)
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        if (orders === null) {
            navigate('/')
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 py-28">
            {/* Success Banner */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg p-8 mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold text-white text-center mb-4">
                            Yay, đặt hàng thành công!
                        </h1>
                        <p className="text-white text-center text-xl">
                            Chuẩn bị tiền mặt <span className="font-bold">{orders?.totalPrice.toLocaleString()}đ</span>
                        </p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-gray-600">Mã đơn hàng: <span className="font-medium text-gray-900">{orders?.id}</span></p>
                            <p className="text-blue-600 hover:text-blue-700 cursor-pointer">Xem đơn hàng</p>
                        </div>
                        {/* <p className="text-gray-600">Giao thứ 2, trước 19h, 09/12</p> */}
                    </div>
                    {orders?.orderDetails.map((product) =>
                        <div className="flex items-center space-x-4 mb-6" key={product.bookID}>
                            <img
                                src={product?.bookThumbnail}
                                alt={product.bookName}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {product.bookName}
                                </h3>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {product.quantiry}
                                </h3>
                            </div>
                        </div>
                    )}


                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between mb-2">
                            <p className="text-gray-600">Phương thức thanh toán</p>
                            <p className="font-medium text-gray-900">{orders?.paymentMethod === "cod" ? "Thanh toán bằng tiền mặt" : "Thanh toán bằng ví điện tử MoMo"}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600">Tổng cộng</p>
                            <p className="font-bold text-gray-900">{orders?.totalPrice.toLocaleString()}đ</p>
                        </div>
                        <p className="text-gray-500 text-sm text-right">(Đã bao gồm VAT nếu có)</p>
                    </div>
                </div>

                {/* Return Button */}
                <div className="text-center">
                    <button
                        onClick={() => window.location.replace("/")}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        </div>
    )
}
export default OrderSuccess



