import React, { useEffect, useRef, useState } from 'react';
import Emojis from '../Emoji/Emojis';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';


function CommentForm({ chapterID, fetchComment }) {
  const inputRef = useRef(null)
  const [showsEmoji, setShowsEmoji] = useState(false)
  const [comment, setComment] = useState('');
  const [cursorPosition, setCursorPosition] = useState()
  const user = useSelector((state) => state.auth?.login?.currentUser?.data)
  const baseURL = import.meta.env.VITE_API_URL;

  const pickEmoji = (e) => {
    const emoji = e.emoji; // Lấy giá trị emoji được chọn
    const ref = inputRef.current
    ref.focus()
    setComment((prevComment) => {
      const start = prevComment.substring(0, ref.selectionStart)
      const end = prevComment.substring(ref.selectionStart)
      const newComment = start + emoji + end
      setCursorPosition(start.length + emoji.length) // Cập nhật vị trí con trỏ
      return newComment
    })


  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Gửi bình luận đến server
    const postComment = async () => {
      try {
        if (!comment) {
          toast.error("Thiếu bình luận");
          return;
        }
        const response = await fetch(`${baseURL}/comments/post`, {
          method: "POST",
          body: JSON.stringify({
            "accountID": user.account.id,
            "chapterID": chapterID,
            "content": comment,
            "postDate": new Date(),
          }),
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${user?.accessToken}`
          }
        });
        const json = await response.json();
        if (json.status === 201) toast.success("Bình luận thành công");
        fetchComment();
        setComment('');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    postComment();
  };

  const handleChange = e => {
    setComment(e.target.value)
  }

  const handleShowEmoji = () => {
    inputRef.current.focus();
    setShowsEmoji(!showsEmoji)
  }

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition])
  return (
    <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg mb-5">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="relative w-full">
          <textarea className="w-full p-2 text-lg border border-gray-300 rounded-lg pr-16"
            value={comment}
            onChange={handleChange}
            ref={inputRef}
            placeholder="Nhập bình luận của bạn..."
          />
          <div className='emoji-icon absolute top-3 right-2 cursor-pointer'>
            <InsertEmoticonIcon onClick={handleShowEmoji} style={{ fontSize: '3rem' }} />
          </div>
          <div className={`emoji-list ${!showsEmoji ? 'pointer-events-none' : 'pointer-events-auto'} 
          ${!showsEmoji && 'hidden'} absolute right-2 cursor-pointer text-gray-400`}>
            <Emojis pickEmoji={pickEmoji} />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Gửi bình luận
          </button>
        </div>
      </form>
    </div >
  );
}


export default CommentForm;