import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import defaultAvatar from "../../../image/default-avatar.png";

function UpdateBook() {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const bookId = useParams().bookId
    const navigate = useNavigate();
    const [book, setBook] = useState(null)
    const [genre, setGenre] = useState([])
    const priceInputRef = useRef(null)
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchGenre = async () => {
        try {
            const response = await fetch(`http://localhost:8080/genres/getAll`);
            const json = await response.json();
            setGenre(json.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchBook = async () => {
        try {
            const response = await fetch(`http://localhost:8080/books/${bookId}`);
            const json = await response.json();
            setBook(json.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "price")
            if (value > 0 && value < 1000)
                priceInputRef.current?.setCustomValidity("Truyện miễn phí hoặc có giá từ 1,000.");
            else
                priceInputRef.current?.setCustomValidity('');

        setBook({ ...book, [name]: value });

    };

    const handleGenresChange = (event) => {
        const selectedValue = event.target.value;
        let newGenres = book.genres;

        // Nếu thể loại đã được chọn, bỏ qua
        if (book.genres.some((item) => item.id == selectedValue)) return;

        // Tìm thể loại theo `id` và thêm vào danh sách đã chọn
        const selectedGenre = genre.find((item) => item.id == selectedValue);
        newGenres.push(selectedGenre)
        if (selectedGenre) {
            setBook({ ...book, genres: newGenres });
        }
    };

    const handleRemoveGenre = (id) => {
        // Xóa thể loại khỏi danh sách đã chọn
        const selectedGenres = book.genres.filter((item) => item.id !== id);
        setBook({ ...book, genres: selectedGenres });
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
            formData.append("upload_preset", "bookstore");

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dhs93uix6/image/upload",
                formData
            );


            setBook((prev) => ({
                ...prev,
                thumbnail: response.data.secure_url,
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
        setBook((prev) => ({
            ...prev,
            thumbnail: defaultAvatar,
        }))
    }

    const updateBook = async () => {
        try {
            const response = await fetch(`http://localhost:8080/books/updateBook/${bookId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    "name": book.name,
                    "author": book.author,
                    "description": book.description,
                    "genreIDs": book.genres.map((genre) => genre.id),
                    "thumbnail": book.thumbnail,
                    "price": book.price
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.accessToken}`
                }
            });
            const json = await response.json();
            console.log(json);
            if (json.code === 200) {
                toast.success("Cập nhật thành công!")
                navigate("/admin/books")
            } else {
                toast.error("Cập nhật thất bại!")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!book.name || !book.description || !book.author || !book.genres || !book.thumbnail) {
            toast.error("Thiếu dữ liệu !");
            return;
        }

        updateBook();
    };

    useEffect(() => {
        fetchGenre();
        fetchBook();
    }, [])

    if (!(book)) {
        return <p className="absolute top-16" >Không có sách này</p>
    }

    return (
        <div className="bg-[#121212] text-white min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">THÔNG TIN SÁCH</h1>

            <div className="flex">
                <div className="w-2/3">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Tiêu đề</label>
                            <input
                                type="text"
                                name="name"
                                value={book.name}
                                placeholder="Nhập tiêu đề sách"
                                onChange={handleChange}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <div className="mb-4 w-3/5">
                                <label className="block mb-1">Tác giả</label>
                                <input
                                    type="text"
                                    name="author"
                                    value={book.author}
                                    placeholder="Nhập tên tác giả"
                                    onChange={handleChange}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                />
                            </div>

                            <div className="mb-4 w-2/5">
                                <label className="block mb-1">Giá truyện</label>
                                <input
                                    type="number"
                                    name="price"
                                    ref={priceInputRef}
                                    value={book.price}
                                    min="0"
                                    max="50000000"
                                    placeholder="Nhập giá"
                                    onChange={handleChange}
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="mb-4">
                                <label className="block mb-1 text-gray-300">Thể loại</label>
                                <select
                                    className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                                    name="genres"
                                    onChange={handleGenresChange}
                                >
                                    <option value="" disabled>Chọn thể loại</option>
                                    {genre.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Danh sách thể loại đã chọn */}
                            {book.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {book.genres.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-lg"
                                        >
                                            <span>{item.name}</span>
                                            <button
                                                className="ml-2 text-red-500"
                                                onClick={() => handleRemoveGenre(item.id)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 w-full">Mô tả truyện</label>
                            <textarea
                                type="text"
                                name="description"
                                value={book.description}
                                placeholder="Nhập mô tả truyện"
                                onChange={handleChange}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg"
                            >
                                Cập nhật
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
                        className="w-3/4 h-full bg-gradient-to-br from-teal-300 to-green-400 rounded-lg mb-4"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            backgroundImage: `url(${book.thumbnail})`,
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
    );
}

export default UpdateBook;