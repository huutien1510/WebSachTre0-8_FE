import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChapterImage from "./ChapterImage";
import { useState, useEffect, useRef, useCallback } from "react";
import CommentSection from "../Comment/CommentSection";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, getFavoriteStatus, removeFromFavorites } from "../../api/apiRequest";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Constants
const SECONDS_PER_5_MINUTES = 300;  // 5 minutes in seconds
const MAX_POINTS_PER_DAY = 20;
const POINTS_PER_5_MINUTES = 5;

// Helper function to get today's date in YYYY-MM-DD format
const getToday = () => new Date().toISOString().split('T')[0];

// Helper function to get localStorage key
const getReadingProgressKey = (userId) => `reading_progress_${userId}_${getToday()}`;

function ReadingProgressBar({ readingSeconds, totalPoints }) {
  const minutes = Math.floor(readingSeconds / 60);
  const seconds = readingSeconds % 60;
  const progress = (totalPoints / MAX_POINTS_PER_DAY) * 100;

  return (
    <div className="fixed top-[340px] right-6 bg-white rounded-lg shadow-lg p-4 w-64 z-50">
      {/* Thời gian đọc */}
      <div className="mb-3">
        <div className="text-sm text-gray-500 mb-1">Thời gian đọc</div>
        <div className="text-2xl font-bold text-blue-600">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Tiến độ điểm</span>
          <span>{totalPoints}/{MAX_POINTS_PER_DAY}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Milestone markers */}
      <div className="relative h-6 mt-1">
        {[5, 10, 15, 20].map((points) => (
          <div
            key={points}
            className={`absolute text-xs transform -translate-x-1/2 ${totalPoints >= points ? "text-blue-600" : "text-gray-400"
              }`}
            style={{ left: `${(points / MAX_POINTS_PER_DAY) * 100}%` }}
          >
            {points}
          </div>
        ))}
      </div>

      {/* Điểm thưởng */}
      <div className="text-center mt-2">
        <div className="text-sm text-gray-500">
          {totalPoints >= MAX_POINTS_PER_DAY ? (
            <span className="text-green-600 font-medium">
              🎉 Chúc mừng! Bạn đã đạt đủ điểm hôm nay
            </span>
          ) : (
            <span>
              Còn <span className="font-medium text-blue-600">{MAX_POINTS_PER_DAY - totalPoints}</span> điểm để hoàn thành
            </span>
          )}
        </div>
      </div>
    </div>
  );
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
  const dispatch = useDispatch();

  // States
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isMissionCompleted, setIsMissionCompleted] = useState(false);
  const [showRestNotice, setShowRestNotice] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const progressRef = useRef({
    totalSeconds: 0,
    lastUpdated: Date.now(),
    lastSyncedSeconds: 0
  });

  // Existing states for chapter functionality
  const [listChapter, setListChapter] = useState(null);
  const [this_chapter, setThisChapter] = useState(null);
  const [chapter_index, setChapterIndex] = useState(null);
  const [image, setImage] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [booksoftbought, setBookSoftBought] = useState(false);
  const [book, setBook] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(true);

  // Load initial progress from localStorage and backend
  useEffect(() => {
    if (!user) return;
    setIsLoadingProgress(true);

    const loadProgress = async () => {
      try {
        // Then fetch from backend first to get the latest data
        const response = await fetch(`${baseURL}/reading/progress?userId=${id}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 200) {
          // Set the initial state from backend
          setReadingSeconds(data.data.totalSecondsToday);
          setTotalPoints(data.data.totalPointsToday);
          setIsMissionCompleted(data.data.isMissionCompleted);

          // Reset progress ref with backend data
          progressRef.current = {
            totalSeconds: data.data.totalSecondsToday,
            lastSyncedSeconds: data.data.totalSecondsToday, // Important: set this to match total seconds
            lastUpdated: Date.now()
          };

          // Update localStorage with fresh data
          localStorage.setItem(getReadingProgressKey(id), JSON.stringify(progressRef.current));
        }
      } catch (error) {
        console.error("Lỗi khi lấy tiến trình đọc:", error);
        // If backend fails, try to load from localStorage as fallback
        const storedProgress = localStorage.getItem(getReadingProgressKey(id));
        if (storedProgress) {
          const progress = JSON.parse(storedProgress);
          setReadingSeconds(progress.totalSeconds);
          setTotalPoints(progress.totalPoints || 0); // Đảm bảo luôn set lại điểm
          progressRef.current = {
            ...progress,
            lastSyncedSeconds: progress.totalSeconds // Ensure lastSyncedSeconds matches totalSeconds
          };
        }
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user, id, accessToken, baseURL]);

  // Timer and progress tracking
  useEffect(() => {
    if (!user || isLoadingProgress) return;

    let timer;
    let isActive = true;

    const updateToServer = async (secondsToSync) => {
      if (secondsToSync <= 0) return;

      try {
        const formData = new URLSearchParams();
        formData.append('userId', id);
        formData.append('secondsRead', secondsToSync);

        const response = await fetch(`${baseURL}/reading/progress`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.code === 200) {
          setTotalPoints(data.data.totalPointsToday);
          setIsMissionCompleted(data.data.isMissionCompleted);
          progressRef.current.lastSyncedSeconds = progressRef.current.totalSeconds;
          // Cập nhật localStorage sau khi sync thành công
          localStorage.setItem(getReadingProgressKey(id), JSON.stringify(progressRef.current));
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật tiến trình:", error);
        // Store failed update in localStorage for retry
        const failedUpdates = JSON.parse(localStorage.getItem('failedReadingUpdates') || '[]');
        failedUpdates.push({
          timestamp: Date.now(),
          userId: id,
          secondsRead: secondsToSync
        });
        localStorage.setItem('failedReadingUpdates', JSON.stringify(failedUpdates));
      }
    };

    // Add retry mechanism for failed updates
    const retryFailedUpdates = async () => {
      const failedUpdates = JSON.parse(localStorage.getItem('failedReadingUpdates') || '[]');
      if (failedUpdates.length === 0) return;

      const today = new Date().toISOString().split('T')[0];
      const todayUpdates = failedUpdates.filter(update =>
        new Date(update.timestamp).toISOString().split('T')[0] === today
      );

      for (const update of todayUpdates) {
        try {
          await updateToServer(update.secondsRead);
          // Remove successful update from failed list
          const remaining = failedUpdates.filter(u => u.timestamp !== update.timestamp);
          localStorage.setItem('failedReadingUpdates', JSON.stringify(remaining));
        } catch (error) {
          console.error("Retry failed for update:", update);
        }
      }
    };

    // Try to retry failed updates when component mounts
    retryFailedUpdates();

    function tick() {
      if (isActive) {
        setReadingSeconds(prev => {
          const newSeconds = prev + 1;

          // Update progress in memory
          progressRef.current.totalSeconds = newSeconds;
          progressRef.current.lastUpdated = Date.now();

          // Nếu đạt đúng mốc 5, 10, 15, 20 phút thì sync ngay
          if (newSeconds > 0 && newSeconds % SECONDS_PER_5_MINUTES === 0) {
            const secondsSinceLastSync = newSeconds - progressRef.current.lastSyncedSeconds;
            if (secondsSinceLastSync > 0) {
              updateToServer(secondsSinceLastSync);
            }
          } else {
            // Check if we need to sync with server (every 5 minutes or 300 seconds)
            const secondsSinceLastSync = newSeconds - progressRef.current.lastSyncedSeconds;
            if (secondsSinceLastSync >= SECONDS_PER_5_MINUTES) {
              updateToServer(secondsSinceLastSync);
            }
          }

          // Save to localStorage
          localStorage.setItem(getReadingProgressKey(id), JSON.stringify(progressRef.current));

          return newSeconds;
        });
        timer = setTimeout(tick, 1000);
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        isActive = false;
        clearTimeout(timer);
        // Sync ngay lập tức khi ẩn tab
        const secondsSinceLastSync = progressRef.current.totalSeconds - progressRef.current.lastSyncedSeconds;
        if (secondsSinceLastSync > 0) {
          // Sử dụng fetch POST để đảm bảo backend nhận đúng dữ liệu
          const formData = new URLSearchParams();
          formData.append('userId', id);
          formData.append('secondsRead', secondsSinceLastSync);

          fetch(`${baseURL}/reading/progress`, {
            method: "POST",
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
          }).then(response => {
            if (response.ok) return response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
          }).then(data => {
            if (data.code === 200) {
              setTotalPoints(data.data.totalPointsToday);
              setIsMissionCompleted(data.data.isMissionCompleted);
              progressRef.current.lastSyncedSeconds = progressRef.current.totalSeconds;
              localStorage.setItem(getReadingProgressKey(id), JSON.stringify(progressRef.current));
            }
          }).catch(error => {
            console.error("Lỗi khi cập nhật tiến trình khi ẩn tab:", error);
          });
        }
      } else {
        isActive = true;
        tick();
      }
    }

    // Xử lý khi rời trang
    function handleBeforeUnload() {
      const secondsSinceLastSync = progressRef.current.totalSeconds - progressRef.current.lastSyncedSeconds;
      if (secondsSinceLastSync > 0) {
        const formData = new FormData();
        formData.append('userId', id);
        formData.append('secondsRead', secondsSinceLastSync);

        // Sử dụng sendBeacon để đảm bảo request được gửi
        navigator.sendBeacon(
          `${baseURL}/reading/progress`,
          formData
        );
      }
    }

    // Thêm event listeners
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Bắt đầu timer
    tick();

    // Cleanup
    return () => {
      isActive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Sync lần cuối khi unmount
      const secondsSinceLastSync = progressRef.current.totalSeconds - progressRef.current.lastSyncedSeconds;
      if (secondsSinceLastSync > 0) {
        updateToServer(secondsSinceLastSync);
      }
    };
  }, [user, isLoadingProgress, id, accessToken, baseURL]);

  // Sync khi chuyển chapter
  useEffect(() => {
    if (!user || !this_chapter) return;

    // Sync thời gian đọc khi chuyển chapter
    const secondsSinceLastSync = progressRef.current.totalSeconds - progressRef.current.lastSyncedSeconds;
    if (secondsSinceLastSync > 0) {
      const formData = new URLSearchParams();
      formData.append('userId', id);
      formData.append('secondsRead', secondsSinceLastSync);

      fetch(`${baseURL}/reading/progress`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      }).then(response => {
        if (response.ok) return response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }).then(data => {
        if (data.code === 200) {
          setTotalPoints(data.data.totalPointsToday);
          setIsMissionCompleted(data.data.isMissionCompleted);
          progressRef.current.lastSyncedSeconds = progressRef.current.totalSeconds;
          localStorage.setItem(getReadingProgressKey(id), JSON.stringify(progressRef.current));
        }
      }).catch(error => {
        console.error("Lỗi khi cập nhật tiến trình chuyển chapter:", error);
      });
    }
  }, [this_chapter, user, id, accessToken, baseURL]);

  // Rest notification
  useEffect(() => {
    if (readingSeconds >= 7200 && !showRestNotice) {
      setShowRestNotice(true);
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

  // Render
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
      {/* Floating toggle button for ReadingProgressBar */}
      <div className="fixed bottom-28 right-6 z-50">
        <button
          className="rounded-full shadow-lg bg-white p-2 flex items-center justify-center hover:scale-110 transition-transform"
          style={{ width: 64, height: 64 }}
          onClick={() => setShowProgressBar((prev) => !prev)}
        >
          <DotLottieReact
            src="https://lottie.host/27d036e6-9c64-4d4e-b6cf-0147c88c6b91/WxPV2qVcPj.lottie"
            loop
            autoplay
            style={{ width: 48, height: 48 }}
          />
        </button>
      </div>
      {/* ReadingProgressBar toggleable */}
      {showProgressBar && (
        <ReadingProgressBar
          readingSeconds={readingSeconds}
          totalPoints={totalPoints}
        />
      )}
      {isMissionCompleted && (
        <div className="text-green-600 text-center font-bold mt-2">
          🎉 Bạn đã tích đủ điểm hôm nay!
        </div>
      )}
      {showRestNotice && (
        <div className="fixed top-16 left-0 w-full z-50 pointer-events-none flex justify-center">
          <div className="overflow-hidden bg-transparent">
            <div
              className="whitespace-nowrap text-xl font-bold text-green-800  flex items-center gap-4"
              style={{ padding: "0.75rem 0" }}
            >
              ⏰ Bạn đã đọc 120 phút, hãy nghỉ ngơi, uống nước, thư giãn mắt nhé! 🧃👀
            </div>
          </div>
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