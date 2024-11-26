import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(false);
    const navigate = useNavigate();

    const handleEmail = async (e) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading
        try {
            const res = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
            if (res.data.status === 201) {
                setState(true);
            }
            setMessage(res.data.data.message);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.details?.message || "Something went wrong");
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-28">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md relative">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Quên mật khẩu</h2>
                    <p className="text-gray-400">Vui lòng nhập email để tiếp tục</p>
                </div>

                <form className="space-y-4" onSubmit={handleEmail}>
                    <div>
                        <input
                            type="email"
                            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                            placeholder="Email"
                            name="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {message && <p className={state ? "text-emerald-500" : "text-red-500"}>{message}</p>}


                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-4 border-t-white border-gray-200 rounded-full animate-spin"></div>
                                Đang gửi yêu cầu...
                            </div>
                        ) : (
                            "Tiếp tục"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
