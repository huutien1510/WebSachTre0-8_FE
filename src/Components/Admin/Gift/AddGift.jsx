import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import defaultGift from "../../../image/default-gift.jpg";
import axios from 'axios';

const AddGift = () => {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_URL;
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [discounts, setDiscounts] = useState([]);

    const [item, setItem] = useState({
        type: "",
        name: "",
        point: "",
        link: defaultGift,
        quantity: "",
        active: true,
        discountId: null
    });


    useEffect(() => {
        const fetchDiscounts = async () => {
            const url = `${baseURL}/discounts/getAllByGift`;
            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`
                    }
                });
                const json = await response.json();
                if (json.code === 200) {
                    setDiscounts(json.data);
                }
            } catch (error) {
                console.error('Error fetching discounts:', error);
            }
        };

        fetchDiscounts();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });

        // Reset discountId khi đổi type khác voucher
        if (name === 'type' && value !== 'VOUCHER') {
            setItem(prev => ({ ...prev, discountId: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!item.type || !item.name || !item.point || !item.quantity) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        // Kiểm tra nếu là voucher thì phải chọn discountId
        if (item.type === 'VOUCHER' && !item.discountId) {
            toast.error("Vui lòng chọn mã giảm giá cho voucher!");
            return;
        }

        // Thêm validation cho số lượng voucher
        if (item.type === 'VOUCHER') {
            const selectedDiscount = discounts.find(d => d.id === item.discountId);
            if (selectedDiscount && parseInt(item.quantity) > selectedDiscount.quantity) {
                toast.error(`Số lượng voucher không được vượt quá số lượng mã giảm giá (${selectedDiscount.quantity})`);
                return;
            }
        }

        const addItem = async () => {
            try {
                const response = await fetch(`${baseURL}/items`, {
                    method: "POST",
                    body: JSON.stringify({
                        type: item.type,
                        name: item.name,
                        point: parseInt(item.point),
                        link: item.link,
                        quantity: parseInt(item.quantity),
                        active: item.active,
                        discountId: item.discountId
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.accessToken}`
                    }
                });
                const json = await response.json();
                if (json.code === 200) {
                    toast.success("Thêm vật phẩm thành công");
                    navigate("/admin/gifts");
                } else {
                    toast.error(json.message);
                }
            } catch (error) {
                console.error('Error:', error.message);
                toast.error("Có lỗi xảy ra khi thêm vật phẩm");
            }
        };

        addItem();
    };

    const handleThumbnailChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "demo-upload");

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dqlb6zx2q/image/upload",
                formData
            );

            setItem((prev) => ({
                ...prev,
                link: response.data.secure_url,
            }));
            toast.success("Tải ảnh lên thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tải ảnh lên" + error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveThumbnail = (e) => {
        e.preventDefault();
        fileInputRef.current.value = "";
        setItem((prev) => ({
            ...prev,
            link: defaultGift,
        }))
    }

    return (
        <div className="bg-[#121212] text-white min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">THÔNG TIN VẬT PHẨM</h1>

            <div className="flex">
                <div className="w-2/3">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Tên vật phẩm</label>
                            <input
                                type="text"
                                name="name"
                                value={item.name}
                                placeholder="Nhập tên vật phẩm"
                                onChange={handleChange}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <div className="mb-4 w-1/2">
                                <label className="block mb-1">Loại vật phẩm: </label>
                                <select
                                    name="type"
                                    value={item.type}
                                    onChange={handleChange}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                >
                                    <option value="" disabled>Chọn loại vật phẩm</option>
                                    <option value="VOUCHER">Voucher</option>
                                    <option value="gift">Quà tặng</option>
                                </select>
                            </div>
                            <div className="mb-4 w-1/2">
                                <label className="block mb-1">Số điểm cần đổi:</label>
                                <input
                                    type="number"
                                    name="point"
                                    value={item.point}
                                    min="0"
                                    placeholder="Nhập số điểm"
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== 'Backspace' &&
                                            e.key !== 'ArrowLeft' &&
                                            e.key !== 'ArrowRight' &&
                                            e.key !== 'Tab'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border h-[45px]"
                                />
                            </div>
                        </div>

                        {/* Hiển thị select discount khi type là VOUCHER */}
                        {item.type === 'VOUCHER' && (
                            <div className="mb-4">
                                <label className="block mb-1">Chọn mã giảm giá:</label>
                                <select
                                    name="discountId"
                                    value={item.discountId || ""}
                                    onChange={handleChange}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                >
                                    <option value="" disabled>Chọn mã giảm giá</option>
                                    {discounts.map((discount) => (
                                        <option key={discount.id} value={discount.id}>
                                            {discount.code} - {discount.type == 'FIXED_AMOUNT' ? "Giảm giá cố định" : "Giảm giá theo phần trăm"} - {discount.value}{discount.type === 'FIXED_AMOUNT' ? ' VNĐ' : '%'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block mb-1">Số lượng</label>
                            <input
                                type="number"
                                name="quantity"
                                value={item.quantity}
                                min="0"
                                placeholder="Nhập số lượng"
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                    if (
                                        !/[0-9]/.test(e.key) &&
                                        e.key !== 'Backspace' &&
                                        e.key !== 'ArrowLeft' &&
                                        e.key !== 'ArrowRight' &&
                                        e.key !== 'Tab'
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border h-[45px]"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg"
                            >
                                Thêm vật phẩm
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                type='button'
                                className="bg-[#383838] text-white py-2 px-4 rounded-lg border-gray-400 border">
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-1/3 flex flex-col items-center">
                    <div
                        className="w-3/4 h-96 bg-gradient-to-br from-teal-300 to-green-400 rounded-lg mt-12 mb-4"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            backgroundImage: `url(${item.link})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleThumbnailChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className='flex '>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg mr-4">
                            {isUploading ? "Đang tải lên..." : "Thay ảnh"}
                        </button>
                        <button
                            onClick={handleRemoveThumbnail}
                            className="bg-gradient-to-br from-red-400 to-red-500 text-white py-2 px-4 rounded-lg">
                            Gỡ ảnh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGift