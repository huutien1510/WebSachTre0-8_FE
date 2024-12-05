import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { DatePicker, Radio } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/apiRequest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [sex, setSex] = useState('Nam');
    const [loading, setLoading] = useState(false); // State để theo dõi loading
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const plainOptions = ['Nam', 'Nữ', 'Khác'];

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const disabledDate = (current) => {
        const startDate = dayjs().startOf('day'); // Ngày bắt đầu
        return current && (current > startDate);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setPasswordError('Mật khẩu không khớp');
        } else {
            setPasswordError('');
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return;

        setLoading(true); // Bắt đầu loading
        const newUser = { username, email, birthday, password, sex, phone };

        try {
            await registerUser(newUser, navigate);
        } catch (error) {
            setMessage(error); // Gán lỗi vào `message` khi có lỗi
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    const onChangeSex = ({ target: { value } }) => {
        setSex(value);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-28">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md relative">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Đăng ký tài khoản</h2>
                    <p className="text-gray-400">Đăng ký để theo dõi quá trình đọc sách</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="text-white text-sm"><span className='text-red-600 text-lg'>*</span> User Name</label>
                        <input
                            type="tel"
                            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                            placeholder="User Name"
                            name='username'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm"><span className='text-red-600 text-lg'>*</span> Email</label>
                        <input
                            type="tel"
                            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                            placeholder="Email"
                            name='email'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm"><span className='text-red-600 text-lg'>*</span> Số điện thoại</label>
                        <input
                            type="tel"
                            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                            placeholder="Số điện thoại"
                            name='phone'
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm block"><span className='text-red-600 text-lg'>*</span> Ngày sinh</label>
                        <DatePicker
                            onChange={(dateString) => setBirthday(dateString)}
                            value={birthday}
                            disabledDate={disabledDate}
                            className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1 text-base"
                            placeholder="Chọn ngày sinh"
                            format="DD/MM/YYYY"
                            name='birthday'
                        />
                    </div>
                    <div>
                        <label className='text-gray-300 text-sm block'><span className='text-red-600 text-lg'>*</span> Giới tính</label>
                        <Radio.Group
                            className='px-4 py-1 mt-1 text-base'
                            options={plainOptions}
                            onChange={onChangeSex}
                            value={sex}
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm"><span className='text-red-600 text-lg'>*</span> Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">Mật khẩu bao gồm ít nhất 8 ký tự</p>
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm"><span className='text-red-600 text-lg'>*</span> Nhập lại mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full bg-gray-700 rounded-lg px-4 py-3 text-white mt-1"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
                        <p className="text-gray-500 text-sm mt-1">Mật khẩu bao gồm ít nhất 8 ký tự</p>
                    </div>
                    {message && <p className='text-red-500'>{message}</p>}

                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-4 border-t-white border-gray-200 rounded-full animate-spin"></div>
                                Đang đăng ký...
                            </div>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>
                </form>

                <p className='text-white text-sm mt-1'>Bạn đã có tài khoản? <NavLink to={"/login"} className={"text-emerald-400"}>Đăng nhập ngay</NavLink></p>
            </div>
        </div>
    );
};

export default Register;
