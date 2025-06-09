	import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChapterImage from "./ChapterImage";
import { useState, useEffect } from "react";
import CommentSection from "../Comment/CommentSection";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, getFavoriteStatus, removeFromFavorites } from "../../api/apiRequest";

function ChapterReader() {
  const user = useSelector((state) => state.auth?.login?.currentUser?.data);
  const user1 = useSelector((state) => state.auth?.login?.currentUser);
  const id = useSelector((state) => state.auth.login.currentUser?.data.account.id);
  const accessToken = useSelector((state) => state.auth?.login?.currentUser?.data.accessToken);
  const baseURL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const bookID = useParams().bookID;
  const chapter_number = useParams().chapter_number;
  const bookName = location?.state?.bookName;
  const [listChapter, setListChapter] = useState(null);
  const [this_chapter, setThisChapter] = useState(null);
  const [chapter_index, setChapterIndex] = useState(null);
  const [image, setImage] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [booksoftbought, setBookSoftBought] = useState(false);
  const [book, setBook] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State cho tính năng đọc truyện
  const [readingSessionId, setReadingSessionId] = useState(null);
  const [readingPoints, setReadingPoints] = useState(0);
  const [readingTime, setReadingTime] = useState(0); // giây
  const [isReadingActive, setIsReadingActive] = useState(false);

  // Các mốc thời gian
  const timeMilestones = [5, 10, 15, 20]; // phút
  const currentMinutes = Math.floor(readingTime / 60);

  // Hàm bắt đầu phiên đọc
  const startReadingSession = async () => {
    try {
      const response = await fetch(
        `${baseURL}/reading/start?userId=${user.account.id}&chapterId=${this_chapter.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log("start reading session", data)
      if (data.code === 200) {
        setReadingSessionId(data.data.sessionId);
        setIsReadingActive(true);
      }
    } catch (error) {
      console.error("Lỗi khi bắt đầu phiên đọc:", error);
    }
  };

  // Hàm cập nhật trạng thái đọc
  const updateReadingStatus = async () => {
    if (!isReadingActive || !readingSessionId) return;

    try {
      const response = await fetch(
        `${baseURL}/reading/status?userId=${user.account.id}&chapterId=${this_chapter.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      const data = await response.json();

      if (data.code === 200) {
        setReadingPoints(data.data.pointsEarned);
        setReadingTime(data.data.readingTime);

        if (data.data.shouldShowWarning) {
          alert(data.data.warningMessage);
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đọc:", error);
    }
  };

  // Hàm kết thúc phiên đọc
  const endReadingSession = async () => {
    if (!isReadingActive || !readingSessionId) return;

    try {
      const response = await fetch(
        `${baseURL}/reading/end?userId=${user.account.id}&chapterId=${this_chapter.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log("end reading session", data)

      if (data.code === 200) {
        alert(`Bạn đã đọc ${data.data.totalReadingMinutes} phút và nhận được ${data.data.pointsEarned} điểm!`);
        setReadingPoints(0);
        setReadingTime(0);
        setIsReadingActive(false);
        setReadingSessionId(null);
      }
    } catch (error) {
      console.error("Lỗi khi kết thúc phiên đọc:", error);
    }
  };

  // Effect để bắt đầu phiên đọc khi chapter thay đổi
  useEffect(() => {
    if (this_chapter && user?.account?.id) {
      startReadingSession();
    }
    // eslint-disable-next-line
  }, [this_chapter]);

  // Effect để cập nhật trạng thái đọc định kỳ
  useEffect(() => {
    if (!isReadingActive) return;

    const statusInterval = setInterval(updateReadingStatus, 60000); // mỗi phút

    return () => {
      clearInterval(statusInterval);
      endReadingSession();
    };
    // eslint-disable-next-line
  }, [isReadingActive, this_chapter]);

  // UI hiển thị thông tin đọc
  const renderReadingInfo = () => (
    <div className="bg-blue-50 p-4 text-center mb-2">
      <div className="flex justify-center items-center gap-4">
        <div>
          <span className="font-medium">Thời gian đọc:</span>
          <span className="ml-2">{Math.floor(readingTime / 60)} phút {readingTime % 60} giây</span>
        </div>
        <div>
          <span className="font-medium">Điểm đã nhận:</span>
          <span className="ml-2">{readingPoints}</span>
        </div>
      </div>
    </div>
  );

  // UI thanh tiến độ thời gian đọc
  const renderTimeProgressBar = () => (
    <div className="w-full mt-2 mb-4">
      <div className="relative h-4 bg-gray-200 rounded-full">
        <div
          className="absolute h-4 bg-blue-500 rounded-full transition-all duration-300"
          style={{
            width: `${Math.min((currentMinutes / 20) * 100, 100)}%`
          }}
        ></div>
        {timeMilestones.map((m) => (
          <div
            key={m}
            className="absolute top-0 -mt-6 text-xs text-gray-700"
            style={{
              left: `${(m / 20) * 100}%`,
              transform: "translateX(-50%)"
            }}
          >
            {m}p
          </div>
        ))}
      </div>
      <div className="text-center mt-2 text-sm">
        Đã đọc: <span className="font-bold">{currentMinutes} phút</span>
      </div>
    </div>
  );

  // Các useEffect và hàm fetch dữ liệu khác giữ nguyên như cũ
  useEffect(() => {
    const fetchingBookSoftBought = async () => {
      try {
        const response = await fetch(
          `${baseURL}/orders/checkSoftBookBought/${id}/${bookID}`
        );
        const json = await response.json();
        if (json.code !== 500) {
          setBookSoftBought(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `${baseURL}/books/${bookID}`
        );
        const json = await response.json();
        if (json.code !== 500) {
          setBook(json.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchingBookSoftBought();

    setTimeout(() => {
      fetchBook();
    }, 2000);
  }, [bookID]);

  if (!user) {
    navigate("/login");
  }

  if (booksoftbought === false && book?.price > 0) {
    navigate(`/book/${bookID}`);
  }

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user?.account?.id && bookID) {
        try {
          const status = await getFavoriteStatus(
            user?.account?.id,
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
    // eslint-disable-next-line
  }, [user?.account?.id, bookID]);

  useEffect(() => {
    const fetchListChapter = async () => {
      try {
        const response = await fetch(`${baseURL}/chapters/${bookID}`);
        const json = await response.json()
        setListChapter(json.data)
        const index = json.data.findIndex((chapter) => chapter.chapterNumber == chapter_number);
        setChapterIndex(index)
        setThisChapter(json.data[index])
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchListChapter();
    // eslint-disable-next-line
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

  const handleAddReadBook = async () => {
    try {
      const response = await fetch(`${baseURL}/readinghistory`, {
        method: "POST",
        body: JSON.stringify({
          "accountID": user.account.id,
          "chapterID": this_chapter.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error.message);
    }
  };

  const handleUpReadView = async (chapterID) => {
    try {
      await fetch(`${baseURL}/chapters/upView/${chapterID}`, {
        method: "PATCH"
      });
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error.message);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`${baseURL}/chaptercontents/${this_chapter.id}`)
        const json = await response.json()
        setImage(json.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (this_chapter) {
      fetchImage();
      handleUpReadView(this_chapter.id)
      handleAddReadBook()
    }
    // eslint-disable-next-line
  }, [this_chapter]);

  if (!(image)) {
    return <h1 className="mt-16">Chưa có chương này</h1>
  }

  return (
    <div className="bg-bgChapterReader p-4">
      <div className="bg-white mx-auto mg-b-5 w-2/3 shadow-md mt-16">
        {/* Breadcrumb navigation */}
        <nav className="text-sm mb-4">
          <ul className="flex gap-2 text-blue-500">
            <li className="hover:text-blue-800 font-medium transition-colors duration-200"><a href="/">Trang chủ</a></li>
            <li>•</li>
            <li className="hover:text-blue-800 font-medium transition-colors duration-200"><a href="#">Thể loại</a></li>
            <li>•</li>
            <li className="hover:text-blue-800 font-medium transition-colors duration-200"><a href={`/book/${bookID}`}>{bookName}</a></li>
            <li>•</li>
            <li>Chapter {this_chapter.chapterNumber}</li>
          </ul>
        </nav>

        {/* Title section */}
        <div className="mb-4">
          <h1 className="text-xl">
            <span className="text-blue-500">{bookName} - {this_chapter?.title}</span>
            <span className="text-sm text-gray-500 ml-2">
              [Cập nhật lúc: {new Date(this_chapter.pushlishDate)
                .toLocaleDateString("vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}]</span>
            <span className="text-sm text-gray-500 ml-2">[View: {this_chapter.viewCount}]</span>
          </h1>
        </div>

        {/* Navigation hint */}
        <div className="bg-blue-50 p-4 text-center mb-4">
          Sử dụng (Back) hoặc (Next) để chuyển chapter
        </div>

        {/* Chapter navigation */}
        <div className="flex justify-center items-center gap-2 p-4">
          {(chapter_index > 0) && (<button
            onClick={() => {
              const selectedChapter = listChapter[chapter_index - 1];
              setChapterIndex((prev) => prev - 1)
              setThisChapter(selectedChapter)
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back
          </button>)}
          <select className="border p-2 rounded"
            value={this_chapter?.chapterNumber || ""}
            onChange={(e) => {
              const selectedChapter = listChapter.find(chapter => chapter.chapterNumber == e.target.value);
              setThisChapter(selectedChapter);
            }}
          >
            {listChapter?.map((chapter) => (
              <option key={chapter.id} value={chapter.chapterNumber}>
                Chapter {chapter.chapterNumber}
              </option>
            ))}
          </select>
          {(chapter_index < listChapter.length - 1) && (<button
            onClick={() => {
              const selectedChapter = listChapter[chapter_index + 1];
              setChapterIndex((prev) => prev + 1)
              setThisChapter(selectedChapter)
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Next
          </button>
          )}
          <button onClick={handleFavoriteClick} className="bg-red-500 text-white px-4 py-2 rounded">{isFavorite ? "Đã theo dõi" : "Theo dõi"}</button>
        </div>

        {/* Thông tin đọc và thanh tiến độ */}
        {isReadingActive && renderReadingInfo()}
        {isReadingActive && renderTimeProgressBar()}

      </div>
      <div>
        {image?.map((i) => (
          <ChapterImage key={i.id} link={i.content}>
          </ChapterImage>
        )
        )}
      </div>
      <CommentSection chapterID={this_chapter.id}>
      </CommentSection>
    </div>
  );
}

export default ChapterReader;