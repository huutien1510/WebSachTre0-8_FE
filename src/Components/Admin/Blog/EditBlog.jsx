import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import defaultAvatar from "../../../image/default-avatar.png";
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { format } from 'date-fns';

const EditBlog = () => {
    const user = useSelector((state) => state.auth.login?.currentUser.data)
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [article, setArticle] = useState(null);
    const articleID = useParams().articleID;

    useEffect(() => {
        const fecthArticle = async () => {
            try {
                const response = await fetch(`http://localhost:8080/articles/${articleID}`);
                const json = await response.json();
                setArticle(json.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fecthArticle()
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle({ ...article, [name]: value });

    };


    const handleImageChange = async (e) => {
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


            setArticle((prev) => ({
                ...prev,
                image: response.data.secure_url,
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
        setArticle((prev) => ({
            ...prev,
            image: defaultAvatar,
        }))
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!article?.title || !article?.content || !article?.author || !article?.image) {
            toast.error("Thiếu dữ liệu !");
            return;
        }

        const editBlog = async () => {
            try {
                const response = await fetch(`http://localhost:8080/articles/editArticle/${article.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        "title": article?.title,
                        "author": article?.author,
                        "content": article?.content,
                        "image": article?.image,
                        "date": new Date()
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user?.accessToken}`
                    }
                });
                const json = await response.json();
                if (json.code === 200) {
                    toast.success("Cập nhật bài viết thành công");
                    navigate(-1)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        editBlog();

    };

    if (!article) return (
        <div className='text-white'> Không có bài viết này</div>
    )

    return (
        <div className="bg-[#121212] text-white min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">Thông tin bài viết</h1>

            <div className="w-full flex flex-col items-center mb-8">
                <div
                    className="w-2/3 h-96 bg-gradient-to-br from-teal-300 to-green-400 rounded-lg mb-4"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        backgroundImage: `url(${article?.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
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


            <div className="w-full">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            value={article?.title}
                            placeholder="Nhập tiêu đề bài viết"
                            onChange={handleChange}
                            className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="mb-4 w-full">
                            <label className="block mb-1">Tác giả</label>
                            <input
                                type="text"
                                name="author"
                                value={article?.author}
                                placeholder="Nhập tên tác giả"
                                onChange={handleChange}
                                className="w-full bg-[#262626] p-3 rounded-lg border-gray-600 border"
                            />
                        </div>

                    </div>

                    <div className="mb-4 ">
                        <label className="block mb-1 w-full">Nội dung</label>
                        <Editor
                            apiKey='rvi50sp60yxewwbykge5zhz6bjbwityoo7cisogsk5fxkxpa'
                            init={{
                                plugins: [
                                    // Core editing features
                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                    // Your account includes a free trial of TinyMCE premium features
                                    // Try the most popular premium features until Dec 19, 2024:
                                    'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                                    // Early access to document converters
                                    'importword', 'exportword', 'exportpdf'
                                ],
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                tinycomments_mode: 'embedded',
                                tinycomments_author: 'Author name',
                                mergetags_list: [
                                    { value: 'First.Name', title: 'First Name' },
                                    { value: 'Email', title: 'Email' },
                                ],
                                ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                            }}
                            initialValue={article?.content}
                            onEditorChange={(content) => setArticle((prev) => ({ ...prev, content: content }))}
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


        </div>

    )
}

export default EditBlog