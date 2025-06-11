import React, { useState, useEffect, createRef } from "react";
import CommentForm from "./CommentForm.jsx";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function CommentSection({ chapterID }) {
  const [comments, setComments] = useState(null);
  const users = useSelector((state) => state.users.users?.allUsers?.data);
  const baseURL = import.meta.env.VITE_API_URL;
  const fetchComment = async () => {
    try {
      const response = await fetch(
        `${baseURL}/comments/chapter/${chapterID}`
      );
      const json = await response.json();
      setComments(json.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (chapterID) fetchComment();
  }, [chapterID]);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-4 w-4/5 h-320 mt-10 mx-auto ">
      {/* Phần hướng dẫn */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm">
          Mời bạn thảo luận, vui lòng không spam, share link kiếm tiền, thiếu
          lành mạnh..., để tránh bị khóa tài khoản
        </p>
      </div>
      <div>
        <CommentForm
          chapterID={chapterID}
          fetchComment={fetchComment}
        ></CommentForm>
        {/* Bình luận của người dùng */}
        {comments?.length > 0 &&
          comments?.map((i) => (
            <div key={i.id} className="flex items-start mb-4">
              <img
                src={i.accountAvt || "https://via.placeholder.com/50"}
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-blue-600">
                    {i.accountName}
                  </span>
                  <span className="bg-green-200 text-green-700 text-xs px-2 py-1 rounded">
                    {new Date(i.postDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-gray-800">{i.content}</p>
              </div>
            </div>
          ))}

        {/* Thông báo xem thêm bình luận */}
        <div className="text-center">
          {/* <img
            src="https://via.placeholder.com/30" // Thay thế bằng URL biểu tượng
            alt="Icon"
            className="inline-block w-6 h-6 mr-2 mb-1"
          /> */}
          <p className="text-gray-600 text-sm">
            Bình luận ở bên dưới!
          </p>
        </div>
        {/* Thêm phần để load thêm bình luận nếu cần */}
        {/* <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Xem thêm bình luận
      </button> */}
      </div>
    </div>
  );
}

export default CommentSection;
