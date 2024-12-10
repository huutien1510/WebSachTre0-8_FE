import React from 'react';


const OrderDetailCard = ({ orderDetail }) => {
    return (
        <div className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg shadow-sm bg-gray-1000 hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="w-20 h-20 flex-shrink-0 rounded-md bg-gray-100 overflow-hidden">
                <img
                    src={orderDetail.bookThumbnail}
                    alt={orderDetail.bookName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Book Information */}
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-400">{orderDetail.bookName}</h3>
                <p className="text-sm text-gray-400 mt-1">Loại sách: {orderDetail.bookType == "Sach cung" ? "Sách giấy" : "Sách điện tử"}</p>
                <p className="text-sm text-gray-400 mt-1">Số lượng: x{orderDetail.quantity}</p>
            </div>
        </div>
    );
};



export default OrderDetailCard;
