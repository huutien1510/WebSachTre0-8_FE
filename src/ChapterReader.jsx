import { json, useNavigate, useParams } from "react-router-dom";
import ChapterImage from "./ChapterImage";
import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, getFavoriteStatus, removeFromFavorites } from "./api/apiRequest";
function ChapterReader() {
  const user = useSelector((state) => state.auth?.login?.currentUser?.data)
  const user1 = useSelector((state) => state.auth?.login?.currentUser);
  const id = useSelector(
    (state) => state.auth.login.currentUser?.data.account.accountId
  );
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.data.accessToken
  );
  const bookID = useParams().bookID
  const chapter_number = useParams().chapter_number;
  const [book, setBook] = useState(null);
  const [listChapter, setListChapter] = useState(null);
  const [this_chapter, setThisChapter] = useState(null);
  const [image, setImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user?.account?.accountId && bookID) {
        try {
          const status = await getFavoriteStatus(
            user?.account?.accountId,
            bookID,
            dispatch,
            user1,
            user?.accessToken
          );
          setIsFavorite(status);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    }
    checkFavoriteStatus();
  }, [user?.account?.accountId, bookID]);

  useEffect(() => {
    const fecthBook = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/books/${bookID}`);
        const json = await response.json();
        setBook(json.data);
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fecthBook()

    const fetchListChapter = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/chapter/${bookID}`);
        const json = await response.json()
        setListChapter(json.data)
        setThisChapter(json.data[chapter_number - 1])
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchListChapter();

  }, []);

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(id, bookID, dispatch, user1, accessToken);
      } else {
        await addToFavorites(id, bookID, dispatch, user1, accessToken);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái yêu thích" + error);
    }
  };



  const handleAddReadBook = async (chapterID) => {
    try {
      const response = await fetch(`http://localhost:3000/api/readbook`, {
        method: "POST",
        body: JSON.stringify({
          "accountID": user.account.accountId,
          "bookID": bookID,
          "chapterID": this_chapter._id,
          "chapter_number": this_chapter.chapter_number
        }),
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${user?.accessToken}`
        }
      });
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error.message);
    }
  };

  const handleUpReadView = async (chapterID) => {
    try {
      const response = await fetch(`http://localhost:3000/api/chapter/upView/${chapterID}`, {
        method: "PATCH"
      });
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error.message);
    }
  };



  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/chaptercontent/${this_chapter._id}`)
        const json = await response.json()
        setImage(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (this_chapter) {
      fetchImage();
      handleUpReadView(this_chapter._id)
      handleAddReadBook(this_chapter._id)
    }
  }, [this_chapter]);


  if (!(image && book)) {
    return <h1 className="mt-16">Chưa có chương này</h1>
  }
 
  return (
    <div className="bg-bgChapterReader p-4">
      <div className="bg-white mx-auto mg-b-5 w-2/3 shadow-md mt-16">
        <div className="max-w-4xl mx-auto p-4">
          {/* Breadcrumb navigation */}
          <nav className="text-sm mb-4">
            <ul className="flex gap-2 text-blue-500">
              <li className="hover:text-blue-800 font-medium transition-colors duration-200"><a href="/">Trang chủ</a></li>
              <li>•</li>
              <li className="hover:text-blue-800 font-medium transition-colors duration-200"><a href="#">Thể loại</a></li>
              <li>•</li>
              <li className="hover:text-blue-800 font-medium transition-colors duration-200"><a href={`/book/${bookID}`}>{book.name}</a></li>
              <li>•</li>
              <li>Chapter {this_chapter.chapter_number}</li>
            </ul>
          </nav>

          {/* Title section */}
          <div className="mb-4">
            <h1 className="text-xl">
              <span className="text-blue-500">{book.name}</span> - Chapter {this_chapter.chapter_number}
              <span className="text-sm text-gray-500 ml-2">[Cập nhật lúc: {this_chapter.publish_date}]</span>
              <span className="text-sm text-gray-500 ml-2">[View: {this_chapter.chapter_view}]</span>
            </h1>
          </div>


        </div>

        {/* Navigation hint */}
        <div className="bg-blue-50 p-4 text-center mb-4">
          Sử dụng (Back) hoặc (Next) để chuyển chapter
        </div>

        {/* Chapter navigation */}
        <div className="flex justify-center items-center gap-2 p-4">
          {(this_chapter.chapter_number > 1) && (<button
            onClick={() => {
              const selectedChapter = listChapter.find(chapter => chapter.chapter_number === this_chapter.chapter_number - 1);
              setThisChapter(selectedChapter)
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back
          </button>)}
          <select className="border p-2 rounded"
            value={this_chapter?._id || ""}
            onChange={(e) => {
              const selectedChapter = listChapter.find(chapter => chapter._id === e.target.value);
              setThisChapter(selectedChapter);
            }}
          >
            {listChapter?.map((chapter) => (
              <option key={chapter._id} value={chapter._id}>
                {chapter.chapter_title}
              </option>
            ))}
          </select>
          {(this_chapter.chapter_number < listChapter.length) && (<button
            onClick={() => {
              const selectedChapter = listChapter.find(chapter => chapter.chapter_number === this_chapter.chapter_number + 1);
              setThisChapter(selectedChapter)
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next
          </button>
          )}
          <button onClick={handleFavoriteClick} className="bg-red-500 text-white px-4 py-2 rounded">{isFavorite ? "Đã theo dõi" : "Theo dõi"}</button>
        </div>
      </div>
      <div>
        {image?.data?.map((i) => (
          <ChapterImage key={i.content_number} link={i.content}>
          </ChapterImage>
        )
        )}
      </div>
      <CommentSection chapterID={this_chapter._id}>
      </CommentSection>
    </div>
  );
}

export default ChapterReader;