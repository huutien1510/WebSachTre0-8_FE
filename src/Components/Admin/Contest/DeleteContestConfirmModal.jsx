
import React from 'react';

export default function DeleteContestConfirmModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
                <p className="mb-6">Bạn có muốn xóa cuộc thi này?</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
                        Không
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition">
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
}
