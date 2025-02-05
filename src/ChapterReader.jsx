import { json, useLocation, useNavigate, useParams } from "react-router-dom";
import ChapterImage from "./ChapterImage";
import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, getFavoriteStatus, removeFromFavorites } from "./api/apiRequest";
function ChapterReader() {
  const user = useSelector((state) => state.auth?.login?.currentUser?.data)
  const user1 = useSelector((state) => state.auth?.login?.currentUser);
  const id = useSelector(
    (state) => state.auth.login.currentUser?.data.account.id
  );
  const accessToken = useSelector(
    (state) => state.auth?.login?.currentUser?.data.accessToken
  );
  const localtion = useLocation();
  const bookID = useParams().bookID
  const chapter_number = useParams().chapter_number;
  const bookName = localtion?.state?.bookName;
  const [listChapter, setListChapter] = useState(null);
  const [this_chapter, setThisChapter] = useState(null);
  const [chapter_index, setChapterIndex] = useState(null);
  const [image, setImage] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [booksoftbought, setBookSoftBought] = useState(false);
  const [book, setBook] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchingBookSoftBought = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/orders/checkSoftBookBought/${id}/${bookID}`
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
          `http://localhost:8080/books/${bookID}`
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
  
  // useEffect(() => {
  //   const fetchBook = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8080/books/${bookID}`
  //       );
  //       const json = await response.json();
  //       if (json.code !== 500) {
  //         setBook(json.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  //   fetchBook();
  // }, [bookID]); // Ensure the dependency array is correct

  if (!user) {
    navigate("/login");
  }

  if (booksoftbought == false  && book?.price > 0) {
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
        const response = await fetch(`http://localhost:8080/chapters/${bookID}`);
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
      const response = await fetch(`http://localhost:8080/readinghistory`, {
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
      await fetch(`http://localhost:8080/chapters/upView/${chapterID}`, {
        method: "PATCH"
      });
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error.message);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:8080/chaptercontents/${this_chapter.id}`)
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
  }, [this_chapter]);

  if (!(image)) {
    return <h1 className="mt-16">Chưa có chương này</h1>
  }
  console.log(chapter_index)

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
  );
}

export default ChapterReader;