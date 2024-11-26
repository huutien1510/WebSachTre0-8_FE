// src/components/VerificationSuccess.js
import React from 'react';
import { Link } from 'react-router-dom';

const VerificationSuccess = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Email đã được xác minh thành công!</h2>
            <p className="text-gray-600 mb-6">Tài khoản của bạn đã được kích hoạt. Bây giờ bạn có thể đăng nhập vào tài khoản của mình.</p>
            <Link to="/login" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Đi đến trang Đăng nhập
            </Link>
        </div>
    </div>
);

export default VerificationSuccess;
