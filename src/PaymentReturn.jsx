import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentReturn() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate()
    const accessToken = useSelector(
        (state) => state.auth?.login?.currentUser?.data.accessToken
    );
    const baseURL = import.meta.env.VITE_API_URL;

    // Lấy giá trị của các tham số từ URL
    const query = {
        orderId: queryParams.get('orderId'),
        resultCode: queryParams.get('resultCode'),
        message: queryParams.get('message'),
    }
    const params = new URLSearchParams(query);
    const updateOrderStatus = async () => {
        try {
            const response = await fetch(`${baseURL}/orders/momo-return?${params.toString()}`, {
                method: "GET",
            });
            const data = await response.json();
            const orders = data.data;
            navigate(`/ordersuccess`, { state: { orders } });
        } catch (error) {
            console.log(error);
        }
    }
    updateOrderStatus();

}
export default PaymentReturn