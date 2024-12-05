import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentReturn() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate()

    // Lấy giá trị của các tham số từ URL
    const query = {
        orderId: queryParams.get('orderId'),
        resultCode: queryParams.get('resultCode'),
        message: queryParams.get('message'),
    }
    const params = new URLSearchParams(query);
    const updateOrderStatus = async () => {
        try {
            await fetch(`http://localhost:8080/orders/momo_return?${params.toString()}`)
            navigate("/");
        } catch (error) {
            console.log(error)
        }
    }
    updateOrderStatus();

}
export default PaymentReturn