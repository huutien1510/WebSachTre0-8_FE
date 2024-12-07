import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/apiRequest'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';



const Login = () => {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setMessage("Vui lòng điền đầy đủ thông tin");
            return;
        }
        const newUser = {
            username: username,
            password: password
        };
        try {
            await loginUser(newUser, dispatch, navigate);
        } catch (error) {
            setMessage(error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-28">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md relative">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Đăng nhập tài khoản</h2>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    {/* Phone input */}
                    <div>
                        <label className="text-white text-sm"><span className='text-red-600 text-lg'>*</span> User Name</label>
                        <input
                            type="text"
                            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                            placeholder="User Name" name='username' onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    {/* Password input */}
                    <div>
                        <label className="text-white text-sm"><span className='text-red-600 text-lg'>*</span> Mật Khẩu</label>
                        <div className="relative mb-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot password */}
                    <div className="text-right">
                        <NavLink to={"/forgot-password"} className="text-emerald-400 text-sm">Quên mật khẩu?</NavLink>
                    </div>

                    {/* Register button */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium "
                    >
                        Đăng nhập
                    </button>
                    {message && <p className="text-red-500">{message}</p>}
                </form>

                <p className='text-white text-sm mt-1'>Bạn chưa có tài khoản? <NavLink to={"/register"} className={"text-emerald-400"}>Đăng ký ngay</NavLink></p>
            </div>
        </div>
    )
}

export default Login