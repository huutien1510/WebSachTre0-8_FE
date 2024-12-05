import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

const UserContestDetail = () => {
    const user = useSelector((state) => state.auth?.login?.currentUser?.data)
    const contestID = useParams().contestID;
    const [isRegister, setIsRegister] = useState(null);
    const [contest, setContest] = useState(null);
    const [contestant, setContestant] = useState(false);
    const [file, setFile] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSelectFile, setIsSelectFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [listContestant, setListContestant] = useState(null);

    const fetchContest = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/contests/${contestID}`
            );
            const json = await response.json();
            if (json.code === 200) setContest(json.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchListContestants = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/contestants/getContestantByContest/${contestID}`
            );
            const json = await response.json();
            if (json.code === 200)
                setListContestant(json.data.sort((a, b) => b.score - a.score));
            console.log(json)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getContestant = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/contestants/getContestant/${user.account.id}/${contestID}`
            );
            const json = await response.json();
            if (json.code == 200) {
                setIsRegister(true);
                setContestant(json.data);
            }
            if (json?.data?.submission != null) {
                setIsSubmit(true);
                setIsSelectFile(true);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchContest();
        // setTimeout(() => {
        //     window.scrollTo({ top: 0, behavior: "smooth" });
        // }, 200);

    }, []);

    useEffect(() => {
        if (contest)
            if (dayjs(contest?.end_date).startOf('day') < dayjs().startOf('day'))
                fetchListContestants();
            else getContestant();
    }, [contest])

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        } else {
            return text.substring(0, maxLength - 3) + "...";
        }
    }

    const handleRegister = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/contestants/register/${user.account.id}/${contestID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.accessToken}`
                }
            });
            const json = await response.json();
            console.log(json)
            if (json.code === 200) {
                setIsRegister(true);
                toast.success("Đăng ký dự thi thành công");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files[0];
        setFile(files)
        setLoading(false);
        setUploadProgress(0);
        setIsSelectFile(true);
    };

    const handleEdit = () => {
        setIsSelectFile(false);
        setIsSubmit(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setUploadProgress(25);

        try {
            const submissionUrl = await uploadToCloudinary(file);
            setUploadProgress(75);
            setContestant({ ...contestant, submissionName: file.name, submission: submissionUrl, submit_time: new Date() })
            const response = await fetch(`http://localhost:8080/contestants/submitFile`, {
                method: "PATCH",
                body: JSON.stringify({
                    "contestantID": contestant?.id,
                    "submissionName": file.name,
                    "submission": submissionUrl,
                    "submit_time": new Date(),
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.accessToken}`
                }
            });
            const json = await response.json();
            if (json.code == 200) {
                setContestant(json.data)
                setIsSubmit(true);
                toast.success("Submit successfully!");
            }
        } catch (error) {
            setIsSelectFile(false);
            console.error("Error in create process:", error);
            alert("Error submit. Please try again.");
        } finally {
            setLoading(false);
            setUploadProgress(100);
        }
    };


    const uploadToCloudinary = async (file) => {
        if (!file) {
            alert("Vui lòng chọn file để tải lên!");
        }

        if (file.size > 100 * 1024 * 1024) {
            toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn 100MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "contest");
        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dqlb6zx2q/raw/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = await response.json();

            if (!data.secure_url) {
                throw new Error("Không nhận được đường dẫn ảnh từ server!");
            }

            return data.secure_url;
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            alert(error.message || "Có lỗi xảy ra khi tải ảnh lên!");
            throw error;
        }
    };

    const bxhFont = (index) => {
        switch (index) {
            case 0: return "text-yellow-400 font-bold"
            case 1: return "text-gray-500 font-bold"
            case 2: return "text-[#B87333] font-bold"
            default: return "text-black"
        }
    }

    return (
        <div className="text-white bg-black rounded-xl w-3/5 mx-auto mb-10">
            {/* Banner */}
            <div className="relative mx-auto h-96 rounded-t-xl mt-20 sm:h-96 overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={contest?.banner}
                    alt={contest?.name}
                />
            </div>

            {/* Nội dung chi tiết */}
            <div className="container mx-auto px-4 py-8 sm:py">
                <div className="bg-white bg-opacity-20 flex items-center justify-center mb-8 rounded-xl">
                    <h1 className="font-montserrat text-5xl font-bold 
                    text-center tracking-wider leading-relaxed text-white ">{contest?.name}</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-10">
                    <div>
                        {/* Thông tin chi tiết */}
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Thông tin chi tiết</h2>
                        <ul className="space-y-4">
                            <li>
                                <span className="font-semibold ">📅 Từ:</span>{" "}
                                <span className="text-white">{new Date(contest?.start_date).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}</span>
                            </li>
                            <li>
                                <span className="font-semibold">📅 Đến:</span>{" "}
                                <span className="text-white">{new Date(contest?.end_date).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}</span>
                            </li>
                            <li>
                                <span className="font-semibold">👥 Số thí sinh tối đa:</span>{" "}
                                <span className="text-white">{contest?.maxParticipants}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        {/* Mô tả */}
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Lệ phí</h2>
                        <p className="text-white leading-relaxed mb-2">💵 0 đ</p>

                        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Hiện đã có</h2>
                        <p className="text-white leading-relaxed">👥 {contest?.currentParticipants} người tham gia</p>
                    </div>
                </div>
                <div className='p-8'>
                    {/* Thông tin chi tiết */}
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">Thể lệ cuộc thi</h2>
                    <p className="text-white text-lg leading-relaxed">{contest?.description}</p>

                </div>

                {dayjs(contest?.end_date).startOf('day') < dayjs().startOf('day')
                    ?
                    (
                        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg mt-8">
                            <table className="min-w-full bg-white rounded-lg table-layout:fixed">
                                <thead>
                                    <tr className="bg-gradient-to-br from-blue-600 to-purple-500 hover:bg-indigo-700 transition-colors text-black">
                                        <th className="w-[12.5%] py-3 px-4 border-b border-gray-300 text-center font-semibold text-black">BXH</th>
                                        <th className="w-[62.5%] py-3 px-4 border-b border-gray-300 text-center font-semibold ">Tên thí sinh</th>
                                        <th className="w-[25%] py-3 px-4 border-b border-gray-300 text-center font-semibold ">Số điểm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listContestant?.map((contestant, index) => (
                                        <tr key={contestant?.id} className={"bg-gray-200 hover:bg-gray-100 transition duration-200"}>
                                            <td className={`w-[12.5%] py-3 px-4 border-b text-center ${bxhFont(index)}`}>{index + 1}</td>
                                            <td className={`w-[62.5%] py-3 px-4 border-b text-center ${bxhFont(index)} `}>{truncateText(contestant.accountName, 58)}</td>
                                            <td className={`w-[25%] py-3 px-4 border-b text-center ${bxhFont(index)}`}>{contestant.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                    :
                    (
                        !isRegister ?
                            (<button
                                onClick={handleRegister}
                                className="flex items-center justify-center h-16 text-white text-2xl font-bold px-3 py-2 gap-3
                                rounded-xl bg-gradient-to-br from-teal-600 to-green-500  hover:bg-emerald-700 transition-colors w-1/4 mx-auto">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="24"
                                    height="24"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    <path d="M19 8h-2v2h-2v2h2v2h2v-2h2v-2h-2V8z" />
                                </svg>
                                Đăng ký
                            </button>
                            )
                            :
                            (
                                <div>
                                    <label className="block text-xl text-center font-bold text-gray-200 mt-8 mb-4">
                                        BÀI LÀM CỦA BẠN
                                    </label>
                                    {isSelectFile == false ?
                                        (<div className="container mx-auto px-4 py-8 sm:py space-y-4 mb-2">

                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".png, .jpg, .jpeg, .gif, .webp, .pdf, .doc, .docx, .txt, .zip, .rar"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="file-upload"
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#30B685] transition-all duration-200 bg-[#27272a]"
                                                >
                                                    <div className="text-center">
                                                        <FiUpload className="mx-auto mb-4 h-12 w-12 text-blue-500" />
                                                        <p className="mt-2 text-sm text-gray-300">
                                                            Click để chọn file
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            PDF up to 100MB
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        )
                                        :
                                        (
                                            <div className="rounded-xl bg-white px-4 py-8 shadow-md mb-8">
                                                <div className="flex items-center">
                                                    <FiUpload className="mr-4 h-8 w-8 text-blue-500" />
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{file?.name || contestant?.submissionName}</p>
                                                        {loading && (
                                                            <div>
                                                                <div className="bg-gray-200 rounded-full h-2 mt-1">
                                                                    <div
                                                                        className="bg-blue-500 rounded-full h-2"
                                                                        style={{ width: `${uploadProgress}%` }}
                                                                    ></div>
                                                                </div>
                                                                <div className="flex justify-between mt-1 text-sm text-gray-500">
                                                                    <p>{(file.size / 1024 / 1024).toFixed(2)}MB</p>
                                                                    <p>{uploadProgress}%</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {isSubmit && (
                                                            <div className="mt-2 text-sm text-green-500">
                                                                <p>Ngày nộp: {new Date(contestant?.submit_time).toLocaleString("vi-VN", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div >

                                        )
                                    }
                                    < button
                                        onClick={isSubmit ? handleEdit : handleSubmit}
                                        disabled={loading}
                                        className="flex items-center justify-center h-16 text-white text-2xl font-bold px-3 py-2 gap-3
                                        rounded-xl bg-gradient-to-br from-blue-600 to-purple-500 hover:bg-indigo-700 transition-colors w-1/4 mx-auto">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            width="24"
                                            height="24"
                                        >
                                            <path d="M13 19v-4h-2v4H8l4 5 4-5h-3zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z" />
                                        </svg>
                                        {isSubmit ? "Chỉnh sửa" : "Nộp bài"}
                                    </button>
                                </div >
                            )
                    )
                }
            </div >
        </div >
    );
};

export default UserContestDetail;