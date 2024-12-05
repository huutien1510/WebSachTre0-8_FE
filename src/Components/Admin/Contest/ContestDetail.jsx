import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const ContestDetail = () => {
    const contestID = useParams().contestID;
    const location = useLocation();
    const [contest, setContest] = useState(null);
    const [listContestant, setListContestant] = useState(null);
    const [scoringId, setScoringId] = React.useState(null); // Lưu ID thí sinh đang chấm điểm
    const [score, setScore] = React.useState(""); // Lưu điểm nhập

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        } else {
            return text.substring(0, maxLength - 3) + "...";
        }
    }

    const submitScore = async (contestantID) => {
        try {
            const response = await fetch(`http://localhost:8080/contestants/scoreContestant/${contestantID}`, {
                method: "PATCH",
                body: JSON.stringify({ score }),
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                toast.success("Điểm đã được lưu!");
                fetchContestants();
            }
            else toast.error("Chấm điểm thất bại");
            setScoringId(null); // Đóng chế độ chấm điểm
            setScore(""); // Xóa điểm nhập
        } catch (error) {
            console.error("Error saving score:", error);
            alert("Có lỗi xảy ra khi lưu điểm!");
        }
    };

    const fetchContest = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/contests/${contestID}`
            );
            const json = await response.json();
            if (json.code === 200)
                setContest(json.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchContestants = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/contestants/getContestantByContest/${contestID}`
            );
            const json = await response.json();
            if (json.code === 200)
                setListContestant(json.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    useEffect(() => {
        fetchContest();
        fetchContestants();
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 200);
    }, [location]);
    return (
        <div className="text-white bg-black rounded-xl w-3/4 mx-auto">
            {/* Banner */}
            <div className="relative mx-auto h-96 rounded-t-xl sm:h-96 overflow-hidden">
                <img
                    className="w-full h-full object-cover "
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
                                <span className="font-semibold">📅 Từ:</span>{" "}
                                <span className="text-white">{new Date(contest?.start_date).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}</span>
                            </li>
                            <li>
                                <span className="font-semibold text-lg">📅 Đến:</span>{" "}
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


                {/* buttonEdit */}
                <NavLink to={`/admin/contests/editContest`} state={{ contest: contest }} className="flex-1">
                    <button className="flex items-center justify-center h-14 text-white text-2xl font-bold px-3 py-2 
                    rounded-lg bg-gradient-to-br from-teal-600 to-green-500  hover:bg-emerald-700 transition-colors w-1/4 mx-auto">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <rect x="3" y="4" width="12" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M14 3l5 5-10 10H6v-3l10-10z" />
                            <path d="M5 9h8M5 12h8M5 15h8" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        Edit
                    </button>
                </NavLink>
            </div>

            {/* Kết quả */}

            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg mt-8">
                <table className="min-w-full bg-white rounded-lg table-layout:fixed">
                    <thead>
                        <tr className="bg-gradient-to-br from-blue-600 to-purple-500 hover:bg-indigo-700 transition-colors text-black">
                            <th className="w-12 py-3 px-4 border-b border-gray-300 text-center font-semibold text-black">STT</th>
                            <th className="w-60 py-3 px-4 border-b border-gray-300 text-center font-semibold ">Tên thí sinh</th>
                            <th className="w-60 py-3 px-4 border-b border-gray-300 text-center font-semibold ">Bài làm</th>
                            <th className="w-24 py-3 px-4 border-b border-gray-300 text-center font-semibold ">Số điểm</th>
                            <th className="w-36 py-3 px-4 border-b border-gray-300 text-center font-semibold "></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listContestant?.map((contestant, index) => (
                            <tr key={contestant?.id} className={"bg-gray-200 hover:bg-gray-100 transition duration-200"}>
                                <td className="w-12 py-3 px-4 border-b text-center text-gray-800">{index + 1}</td>
                                <td className="w-60 py-3 px-4 border-b text-center text-gray-800 ">{truncateText(contestant?.accountName, 29)}</td>
                                <td className="w-60 py-3 px-4 border-b text-center text-gray-800 ">
                                    {contestant?.submission ? (
                                        <a
                                            href={contestant?.submission}
                                            download
                                            className="text-blue-500 hover:underline text-center cursor-pointer"
                                        >
                                            {truncateText((contestant?.submissionName || "Tải xuống"), 29)}
                                        </a>
                                    ) : (
                                        <span className="text-black">Không có bài làm</span>
                                    )}
                                </td>
                                <td className="w-24 py-3 px-4 border-b text-center text-gray-800">{contestant.score}</td>
                                <td className="w-36 py-3 px-4 border-b text-center">
                                    {contestant.submission && (
                                        scoringId === contestant.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={score}
                                                    onChange={(e) => setScore(e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    // step="1"
                                                    className="text-black w-20 px-2 py-1 border border-gray-300 rounded"
                                                    placeholder="Nhập điểm"
                                                />
                                                <button
                                                    onClick={() => submitScore(contestant?.id)}
                                                    className="text-red-500 hover:text-red-700 font-bold transition duration-150"
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    onClick={() => setScoringId(null)} // Đóng chế độ chấm điểm
                                                    className="text-gray-700 hover:text-gray-900 font-bold transition duration-150"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setScoringId(contestant?.id)} // Mở chế độ chấm điểm
                                                className="text-red-500 hover:text-red-700 font-bold transition duration-150"
                                            >
                                                Chấm
                                            </button>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default ContestDetail;