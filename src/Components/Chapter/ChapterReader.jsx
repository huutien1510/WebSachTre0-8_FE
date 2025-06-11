import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChapterImage from "./ChapterImage";
import { useState, useEffect, useRef } from "react";
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
  const user = useSelector((state) => state.auth?.login?.currentUser?.data)
  const user1 = useSelector((state) => state.auth?.login?.currentUser);
  const id = useSelector(
    (state) => state.auth.login.currentUser?.data.account.id
  );
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.data.accessToken
  );
  const baseURL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const bookID = useParams().bookID
  const chapter_number = useParams().chapter_number;
  const bookName = location?.state?.bookName;
  const [listChapter, setListChapter] = useState(null);
  const [this_chapter, setThisChapter] = useState(null);
  const [chapter_index, setChapterIndex] = useState(null);
  const [image, setImage] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [booksoftbought, setBookSoftBought] = useState(false);
  const [book, setBook] = useState(null);

  // Thời gian đọc
  const [readingSeconds, setReadingSeconds] = useState(0);
  const [localSeconds, setLocalSeconds] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isMissionCompleted, setIsMissionCompleted] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const timerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      try {
        const response = await fetch(
          `${baseURL}/reading/progress?userId=${user?.account?.id}&secondsRead=0`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setReadingSeconds(data.data.totalSecondsToday);
        setTotalPoints(data.data.totalPointsToday);
        setIsMissionCompleted(data.data.isMissionCompleted);
        setProgressLoaded(true);
        // Reset localStorage và localSeconds
        const localKey = getReadingLocalKey(user?.account?.id);
        localStorage.removeItem(localKey);
        setLocalSeconds(0);
      } catch (error) {
        console.error("Lỗi khi lấy tiến trình đọc:", error);
      }
    };
    fetchProgress();
    return () => setProgressLoaded(false);
  }, [user]);

  // Timer chỉ tăng localSeconds và lưu vào localStorage
  useEffect(() => {
    if (!progressLoaded) return;
    function startTimer() {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setLocalSeconds((prev) => {
            const next = prev + 1;
            // Lưu vào localStorage mỗi giây
            const localKey = getReadingLocalKey(user.account.id);
            const today = new Date().toISOString().slice(0, 10);
            localStorage.setItem(localKey, JSON.stringify({
              date: today,
              seconds: next,
            }));
            return next;
          });
        }, 1000);
      }
    }
    function stopTimer() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    const handleVisibility = () => {
      if (document.hidden) stopTimer();
      else startTimer();
    };
    startTimer();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [progressLoaded]);

  // Gửi backend mỗi 5 phút
  useEffect(() => {
    if (localSeconds > 0 && localSeconds % 300 === 0) {
      const sendProgress = async () => {
        try {
          const response = await fetch(
            `${baseURL}/reading/progress?userId=${user.account.id}&secondsRead=${localSeconds}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user?.accessToken}`,
              },
            }
          );
          const data = await response.json();
          console.log("data", data)
          // Reset localStorage và localSeconds
          const localKey = getReadingLocalKey(user.account.id);
          localStorage.removeItem(localKey);
          setLocalSeconds(0);
          setReadingSeconds(data.data.totalSecondsToday);
          setTotalPoints(data.data.totalPointsToday);
          setIsMissionCompleted(data.data.isMissionCompleted);
        } catch (error) {
          console.error("Lỗi khi gửi tiến trình đọc:", error);
        }
      };
      sendProgress();
    }
  }, [localSeconds]);

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

  // Thêm hàm sendProgress để tái sử dụng
  const sendProgress = async () => {
    if (localSeconds > 0) {
      try {
        const response = await fetch(
          `${baseURL}/reading/progress?userId=${user.account.id}&secondsRead=${localSeconds}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );
        const data = await response.json();
        // Reset localStorage và localSeconds
        const localKey = getReadingLocalKey(user.account.id);
        localStorage.removeItem(localKey);
        setLocalSeconds(0);
        setReadingSeconds(data.data.totalSecondsToday);
        setTotalPoints(data.data.totalPointsToday);
        setIsMissionCompleted(data.data.isMissionCompleted);

        // Kiểm tra và cập nhật trạng thái hoàn thành nhiệm vụ
        const totalMinutes = Math.floor((data.data.totalSecondsToday) / 60);
        if (totalMinutes >= 20 && !data.data.isMissionCompleted) {
          try {
            const missionResponse = await fetch(
              `${baseURL}/reading/complete-mission`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${user?.accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: user.account.id,
                }),
              }
            );
            const missionData = await missionResponse.json();
            if (missionData.code === 200) {
              setIsMissionCompleted(true);
              // Có thể thêm thông báo thành công ở đây nếu cần
            }
          } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái nhiệm vụ:", error);
          }
        }
      } catch (error) {
        console.error("Lỗi khi gửi tiến trình đọc:", error);
      }
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
      sendProgress(); // Gửi thời gian đọc khi chuyển chapter
      fetchImage();
      handleUpReadView(this_chapter.id);
      handleAddReadBook();
    }
  }, [this_chapter]);

  // Cập nhật useEffect cho việc rời trang
  useEffect(() => {
    if (!progressLoaded) return;

    const handlePause = () => {
      if (document.hidden) {
        sendProgress();
      }
    };

    const handleBeforeUnload = (e) => {
      // Đảm bảo gửi dữ liệu trước khi rời trang
      sendProgress();
      // Hiển thị thông báo xác nhận nếu cần
      e.preventDefault();
      e.returnValue = '';
    };

    const handleUnload = () => {
      // Gửi dữ liệu một lần cuối khi rời trang
      sendProgress();
    };

    document.addEventListener("visibilitychange", handlePause);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      document.removeEventListener("visibilitychange", handlePause);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      // Gửi dữ liệu khi component unmount
      sendProgress();
    };
  }, [progressLoaded, user, baseURL, localSeconds]);

  if (!(image)) {
    return <h1 className="mt-16">Chưa có chương này</h1>
  }

  return (
    <>
      <ReadingProgressBar
        readingSeconds={readingSeconds + localSeconds}
        isMissionCompleted={isMissionCompleted}
      />
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
    </>
  );
}

export default ChapterReader;