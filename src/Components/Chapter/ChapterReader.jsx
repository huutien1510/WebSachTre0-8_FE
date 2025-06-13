import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChapterImage from "./ChapterImage";
import { useState, useEffect, useRef, useCallback } from "react";
import CommentSection from "../Comment/CommentSection";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, getFavoriteStatus, removeFromFavorites } from "../../api/apiRequest";

function ReadingProgressBar({ readingSeconds, isMissionCompleted }) {
  const minutes = Math.floor(readingSeconds / 60);
  const seconds = readingSeconds % 60;
  const percent = Math.min((minutes / 20) * 100, 100);
  const milestones = [5, 10, 15, 20];

  return (
    <div
      style={{
        position: "fixed",
        top: 84,
        right: 12,
        zIndex: 1000,
        width: 260,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 16,
      }}
    >
      <div className="font-semibold text-blue-600 mb-2 flex items-center justify-between">
        <span>Thời gian đọc:</span>
        <span>
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="relative h-4 bg-gray-200 rounded-full mb-2">
        <div
          className="absolute h-4 bg-blue-500 rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            minWidth: "8px",
            maxWidth: "100%",
          }}
        ></div>
        {milestones.map((m) => (
          <div
            key={m}
            className="absolute top-5 text-xs text-gray-700"
            style={{
              left: `${(m / 20) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            {m}p
          </div>
        ))}
      </div>
      <div className="text-sm text-center mt-8">
        {isMissionCompleted ? (
          <span className="text-green-600 font-bold">🎉 Đã hoàn thành 20 phút!</span>
        ) : (
          <span>
            Đã đọc <span className="font-bold">{minutes}</span> phút / 20 phút
          </span>
        )}
      </div>
    </div>
  );
}

// Hàm lấy key lưu localStorage theo user và ngày
function getReadingLocalKey(userId) {
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  return `reading_progress_${userId}_${today}`;
}

function ChapterReader() {
  const user = useSelector((state) => state.auth?.login?.currentUser?.data);
  const user1 = useSelector((state) => state.auth?.login?.currentUser);
  const id = useSelector(
    (state) => state.auth.login.currentUser?.data.account.id
  );
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.data.accessToken
  );
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
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Thời gian đọc
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [isMissionCompleted, setIsMissionCompleted] = useState(false);
  const [showRestNotice, setShowRestNotice] = useState(false);
  const lastSavedSeconds = useRef(0);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryTimeout = useRef(null);
  const pendingProgress = useRef(0);
  const [hasInitReadingSeconds, setHasInitReadingSeconds] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Khi vào trang, lấy tổng số giây đã đọc hôm nay
  useEffect(() => {
    if (!user) return;
    setIsLoadingProgress(true);

    const fetchProgress = async () => {
      try {
        const response = await fetch(`${baseURL}/reading/progress?userId=${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await response.json();
        if (data.code === 200 && !hasInitReadingSeconds) {
          setReadingSeconds(data.data.totalSecondsToday || 0);
          setHasInitReadingSeconds(true);
          setIsMissionCompleted(data.data.isMissionCompleted);
          lastSavedSeconds.current = data.data.totalSecondsToday || 0;
          setRetryCount(0); // Reset retry count on success
        }
      } catch (error) {
        console.error("Lỗi khi lấy tiến trình đọc:", error);
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          retryTimeout.current = setTimeout(fetchProgress, 2000 * (retryCount + 1)); // Exponential backoff
        }
      } finally {
        setIsLoadingProgress(false);
        setProgressLoaded(true); // Đảm bảo luôn set true để timer chạy
      }
    };

    fetchProgress();

    return () => {
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
    };
  }, [user, id, accessToken, baseURL, retryCount, hasInitReadingSeconds]);

  // Gửi tiến trình khi rời trang/tab hoặc mỗi 1 phút
  const sendProgress = useCallback(async (force = false) => {
    if (!progressLoaded || !user) return;

    const diff = Math.max(0, readingSeconds - lastSavedSeconds.current);
    if (diff > 0 || force) {
      pendingProgress.current = diff;
      try {
        const response = await fetch(`${baseURL}/reading/progress`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: new URLSearchParams({
            userId: id,
            secondsRead: diff
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save progress');
        }

        lastSavedSeconds.current = readingSeconds;
        pendingProgress.current = 0;
      } catch (error) {
        console.error("Lỗi khi gửi tiến trình đọc:", error);
        // Store in localStorage for retry
        const failedProgress = {
          timestamp: Date.now(),
          seconds: diff,
          userId: id
        };
        localStorage.setItem('failedReadingProgress', JSON.stringify(failedProgress));
      }
    }
  }, [readingSeconds, progressLoaded, user, id, accessToken, baseURL]);

  // Debounced version of sendProgress
  const debouncedSendProgress = useCallback(
    debounce(() => sendProgress(false), 1000),
    [sendProgress]
  );

  useEffect(() => {
    if (!progressLoaded || !user) return;

    // Định kỳ mỗi 1 phút gửi lên backend
    const interval = setInterval(() => sendProgress(true), 60000);

    // Gửi khi rời trang/tab
    const handleLeave = () => {
      const diff = Math.max(0, readingSeconds - lastSavedSeconds.current);
      if (diff > 0) {
        // Lưu vào localStorage để gửi lại khi vào lại trang
        const failedProgress = {
          timestamp: Date.now(),
          seconds: diff,
          userId: id
        };
        localStorage.setItem('failedReadingProgress', JSON.stringify(failedProgress));
        lastSavedSeconds.current = readingSeconds;
      }
    };
    window.addEventListener("beforeunload", handleLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) handleLeave();
    });

    // Check for failed progress on mount
    const checkFailedProgress = () => {
      const failedProgress = localStorage.getItem('failedReadingProgress');
      if (failedProgress) {
        const { timestamp, seconds, userId } = JSON.parse(failedProgress);
        // Only retry if it's from today
        if (new Date(timestamp).toDateString() === new Date().toDateString()) {
          // Gửi lại bằng fetch (có header)
          fetch(`${baseURL}/reading/progress`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: new URLSearchParams({ userId: id, secondsRead: seconds })
          });
        }
        localStorage.removeItem('failedReadingProgress');
      }
    };
    checkFailedProgress();

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleLeave);
      document.removeEventListener("visibilitychange", handleLeave);
    };
  }, [progressLoaded, user, sendProgress, readingSeconds, id, accessToken, baseURL]);

  // Thông báo nghỉ ngơi khi đủ 120 phút
  useEffect(() => {
    if (readingSeconds >= 7200 && !showRestNotice) {
      setShowRestNotice(true);
      alert("Bạn đã đọc 120 phút, hãy nghỉ ngơi nhé!");
    }
  }, [readingSeconds, showRestNotice]);

  // Kiểm tra trạng thái yêu thích
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
          console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
        }
      }
    };
    checkFavoriteStatus();
  }, [user?.account?.id, bookID, dispatch, user1, user?.accessToken]);

  // Lấy thông tin sách và trạng thái mua sách
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
        console.error("Lỗi khi lấy dữ liệu sách đã mua:", error);
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
        console.error("Lỗi khi lấy dữ liệu sách:", error);
      }
    };

    fetchingBookSoftBought();
    setTimeout(() => {
      fetchBook();
    }, 2000);
  }, [bookID, id, baseURL]);

  // Chuyển hướng nếu chưa đăng nhập hoặc sách chưa mua
  if (!user) {
    navigate("/login");
    return null;
  }

  if (booksoftbought === false && book?.price > 0) {
    navigate(`/book/${bookID}`);
    return null;
  }

  // Lấy danh sách chương
  useEffect(() => {
    const fetchListChapter = async () => {
      try {
        const response = await fetch(`${baseURL}/chapters/${bookID}`);
        const json = await response.json();
        setListChapter(json.data);
        const index = json.data.findIndex((chapter) => chapter.chapterNumber == chapter_number);
        setChapterIndex(index);
        setThisChapter(json.data[index]);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chương:", error);
      }
    };

    fetchListChapter();
  }, [bookID, chapter_number, baseURL]);

  // Xử lý yêu thích
  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(id, bookID, dispatch, user1, accessToken);
      } else {
        await addToFavorites(id, bookID, dispatch, user1, accessToken);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái yêu thích: " + error);
    }
  };

  // Cập nhật lịch sử đọc
  const handleAddReadBook = async () => {
    try {
      const response = await fetch(`${baseURL}/readinghistory`, {
        method: "POST",
        body: JSON.stringify({
          accountID: user.account.id,
          chapterID: this_chapter.id,
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
      console.error("Lỗi khi thêm lịch sử đọc:", error.message);
    }
  };

  // Cập nhật lượt xem chương
  const handleUpReadView = async (chapterID) => {
    try {
      await fetch(`${baseURL}/chapters/upView/${chapterID}`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật lượt xem:", error.message);
    }
  };

  // Lấy hình ảnh chương
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`${baseURL}/chaptercontents/${this_chapter.id}`);
        const json = await response.json();
        setImage(json.data);
      } catch (error) {
        console.error("Lỗi khi lấy hình ảnh chương:", error);
      }
    };
    if (this_chapter) {
      fetchImage();
      handleUpReadView(this_chapter.id);
      handleAddReadBook();
    }
  }, [this_chapter, baseURL]);

  // Timer: tăng readingSeconds mỗi giây
  useEffect(() => {
    if (!progressLoaded || !user) return;
    let timer;
    let isActive = true;

    function tick() {
      if (isActive) {
        setReadingSeconds(prev => prev + 1);
        timer = setTimeout(tick, 1000);
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        isActive = false;
        clearTimeout(timer);
      } else {
        isActive = true;
        tick();
      }
    }

    tick();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isActive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [progressLoaded, user]);

  // Trạng thái tải
  if (isLoadingProgress || !image || !this_chapter) {
    return (
      <div className="mt-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar
        readingSeconds={readingSeconds}
        isMissionCompleted={isMissionCompleted}
      />
      {pendingProgress.current > 0 && (
        <div className="text-yellow-600 text-center font-bold mt-2">
          ⚠️ Đang lưu tiến trình đọc...
        </div>
      )}
      {isMissionCompleted && (
        <div className="text-green-600 text-center font-bold mt-2">
          🎉 Bạn đã tích đủ điểm hôm nay!
        </div>
      )}
      {readingSeconds >= 7200 && (
        <div className="text-red-600 text-center font-bold mt-2">
          ⏰ Đã đến lúc nghỉ ngơi!
        </div>
      )}
      <div className="bg-bgChapterReader p-4">
        <div className="bg-white mx-auto mg-b-5 w-2/3 shadow-md mt-16">
          <div className="max-w-4xl mx-auto p-4">
            {/* Breadcrumb navigation */}
            <nav className="text-sm mb-4">
              <ul className="flex gap-2 text-blue-500">
                <li className="hover:text-blue-800 font-medium transition-colors duration-200">
                  <a href="/">Trang chủ</a>
                </li>
                <li>•</li>
                <li className="hover:text-blue-800 font-medium transition-colors duration-200">
                  <a href="#">Thể loại</a>
                </li>
                <li>•</li>
                <li className="hover:text-blue-800 font-medium transition-colors duration-200">
                  <a href={`/book/${bookID}`}>{bookName}</a>
                </li>
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
                    .toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}]
                </span>
                <span className="text-sm text-gray-500 ml-2">[View: {this_chapter.viewCount}]</span>
              </h1>
            </div>
          </div>

          {/* Navigation hint */}
          <div className="bg-blue-50 p-4 text-center mb-4">
            Sử dụng (Back) hoặc (Next) để chuyển chapter
          </div>

          {/* Chapter navigation */}
          <div className="flex justify-center items-center gap-2 p-4">
            {chapter_index > 0 && (
              <button
                onClick={() => {
                  const selectedChapter = listChapter[chapter_index - 1];
                  setChapterIndex((prev) => prev - 1);
                  setThisChapter(selectedChapter);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Back
              </button>
            )}
            <select
              className="border p-2 rounded"
              value={this_chapter?.chapterNumber || ""}
              onChange={(e) => {
                const selectedChapter = listChapter.find(
                  (chapter) => chapter.chapterNumber == e.target.value
                );
                setThisChapter(selectedChapter);
                setChapterIndex(listChapter.findIndex(
                  (chapter) => chapter.chapterNumber == e.target.value
                ));
              }}
            >
              {listChapter?.map((chapter) => (
                <option key={chapter.id} value={chapter.chapterNumber}>
                  Chapter {chapter.chapterNumber}
                </option>
              ))}
            </select>
            {chapter_index < listChapter.length - 1 && (
              <button
                onClick={() => {
                  const selectedChapter = listChapter[chapter_index + 1];
                  setChapterIndex((prev) => prev + 1);
                  setThisChapter(selectedChapter);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Next
              </button>
            )}
            <button
              onClick={handleFavoriteClick}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              {isFavorite ? "Đã theo dõi" : "Theo dõi"}
            </button>
          </div>
        </div>
        <div>
          {image?.map((i) => (
            <ChapterImage key={i.id} link={i.content} />
          ))}
        </div>
        <CommentSection chapterID={this_chapter.id} />
      </div>
    </>
  );
}

export default ChapterReader;