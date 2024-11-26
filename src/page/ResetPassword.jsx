import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (!email || !token) {
            navigate('/login');
        }
    }, [email, token, navigate]);

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/reset-password', { email, token, newPassword: password });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            console.log(error);
            setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-28">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md relative">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Khôi phục tài khoản</h2>
                    <p className="text-gray-400">Vui lòng nhập mật khẩu mới</p>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleReset}>
                    {/* Password input */}
                    <div>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                            placeholder="Mật khẩu"
                            name='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type='button' className='absolute right-10 top-[55%] -translate-y-1/2 text-gray-400' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {message && <p className='text-red-500'>{message}</p>}
                    {/* Register button */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium"
                    >
                        Đặt lại mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;