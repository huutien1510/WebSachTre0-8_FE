import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
} from "../redux/authSlice";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
} from "../redux/userSlice";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";

const baseURL = "http://localhost:8080/api";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params),
});

const refreshToken = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/refresh",
      {},
      {
        withCredentials: true, // Cho phép gửi cookie
      }
    );
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
};


export const createAxiosInstance = (user, dispatch) => {
  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params),
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodeToken = jwt_decode(user?.data.accessToken);
      console.log("Decode token:", decodeToken);
      if (decodeToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        console.log("Refresh token data:", data);
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(loginSuccess(refreshUser));
        config.headers["Authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return axiosInstance;
};

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:8080/api/auth/login", user, { withCredentials: true });
    dispatch(loginSuccess(res.data));
    
    if (res.data.data.account.roles[0] === "ADMIN") {
      navigate("/admin/");
      return;
    }
    navigate("/");
  } catch (err) {
    dispatch(loginFailed());
    console.log("Login error:", err);
    throw (
      err.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập."
    );
  }
};


export const getAllUsers = async (accessToken, dispatch) => {
  dispatch(getUsersStart());
  try {
    console.log("Access Token:", accessToken); // Kiểm tra token trong log
    const res = await axios.get("http://localhost:8080/api/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Đảm bảo header này
      },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    console.log(err); // Xem chi tiết lỗi
    dispatch(getUsersFailure());
  }
};

export const deleteUser = async (id, accessToken, dispatch, user) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  dispatch(deleteUserStart());
  try {
    const res = await axiosInstance.delete(
      `http://localhost:8080/api/user/account/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    dispatch(deleteUserSuccess(res.data));
  } catch (err) {
    dispatch(deleteUserFailure(err.response.data));
  }
};

export const logout = async (dispatch, navigate, token, user) => {
  dispatch(logoutStart());
  try {
    const axiosInstance = createAxiosInstance(user, dispatch);
    await axiosInstance.post(
      "http://localhost:8080/api/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(logoutSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(logoutFailed());
  }
};

export const registerUser = async (user, navigate) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/register",
      user
    );
    console.log("Register response:", res);
    if (res.status === 200) {
      console.log("Register success:", res.data?.data?.message);
      toast.success(res.data?.data?.message, {
        style: {
          backgroundColor: "#0D0D0D",
          color: "#FFFFFF",
        },
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  } catch (err) {
    throw err.response?.data?.message || "Đã xảy ra lỗi khi đăng ký.";
  }
};

export const updateUser = async (user, id, accessToken, dispatch, upUser) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const updateRes = await axiosInstance.patch(`/user/${id}`, upUser, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    if (updateRes.data && updateRes.status === 200) {
      const newUser = {
        ...user,
        data: {
          ...user.data,
          account: {
            ...user.data.account,
            ...updateRes.data.data,
          },
        },
      };
      dispatch(loginSuccess(newUser));
      return {
        success: true,
        data: updateRes.data.data,
      };
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin";
    toast.error(errorMessage, {
      style: {
        backgroundColor: "#0D0D0D",
        color: "#FFFFFF",
      },
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const updatebyAdmin = async (
  user,
  id,
  accessToken,
  dispatch,
  upUser
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const res = await axiosInstance.put(
      `http://localhost:8080/api/user/account/${id}`,
      upUser,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin";
    toast.error(errorMessage, {
      style: {
        backgroundColor: "#0D0D0D",
        color: "#FFFFFF",
      },
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Rating

export const createRating = async (rating, accessToken, user, dispatch) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const res = await axiosInstance.post("http://localhost:8080/ratings/add", rating, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: err.response.data,
    };
  }
};

export const updateRating = async (id, rating, accessToken, user, dispatch) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const res = await axiosInstance.patch(`http://localhost:8080/ratings/update/${id}`, rating, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response.data,
    };
  }
};

export const getAllRating = async (accessToken, dispatch, user) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const res = await axiosInstance.get("http://localhost:8080/ratings/getAll?page=1&limit=15", {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return {
      success: true,
      data: res.data,
    };
  } catch {
    return {
      success: false,
      error: "Error",
    };
  }
};

export const deleteRating = async (id, accessToken, user, dispatch) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const res = await axiosInstance.delete(`http://localhost:8080/ratings/delete/${id}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.response.data,
    };
  }
};

export const getFavoriteStatus = async (
  accountId,
  bookId,
  dispatch,
  user,
  accessToken
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);

  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/favbooks/checkIsFavorites/${accountId}/${bookId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};
export const addToFavorites = async (
  accountId,
  bookId,
  dispatch,
  user,
  accessToken
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);

  try {
    const response = await axiosInstance.post(
      `http://localhost:8080/favbooks/addFavorite/${accountId}/${bookId}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

export const removeFromFavorites = async (
  accountId,
  bookId,
  dispatch,
  user,
  accessToken
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);

  try {
    const response = await axiosInstance.delete(`http://localhost:8080/favbooks/removeFavorite/${accountId}/${bookId}`,
      {
      headers: {
        token: `Bearer ${accessToken}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};
export const getFavoriteBooks = async (
  accountId,
  page,
  limit,
  dispatch,
  user,
  accessToken
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);

  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/favbooks/account/${accountId}?page=${page}&limit=${limit}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting favorite books:", error);
    throw error;
  }
};
export const createChapter = async (
  bookID,
  chapterTitle,
  dispatch,
  user,
  accessToken
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const response = await axiosInstance.post(
      `/chapter/create`,
      {
        bookID: bookID,
        chapter_title: chapterTitle,
        publish_date: new Date().toISOString(),
        chapter_view: 0,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }
};
export const updateChapter = async (
  bookID,
  chapterNumber,
  chapterTitle,
  dispatch,
  user,
  accessToken
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const response = await axiosInstance.post(
      `/chapter/update`,
      {
        bookID: bookID,
        chapter_number: chapterNumber,
        chapter_title: chapterTitle,
        publish_date: new Date().toISOString(),
        chapter_view: 0,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating chapter:", error);
    throw error;
  }
};
export const createChapterContent = async (
  chapterID,
  contentNumber,
  content,
  dispatch,
  user,
  accessToken
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);

  try {
    const response = await axiosInstance.post(
      `/chaptercontent/create`,
      {
        chapterID: chapterID,
        content_number: contentNumber,
        content: content,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating chapter content:", error);
    throw error;
  }
};
export const updateChapterContent = async (
  chapterID,
  contentNumber,
  content,
  dispatch,
  user,
  accessToken
) => {
  const axiosInstance = createAxiosInstance(user, dispatch);

  try {
    const response = await axiosInstance.post(
      `/chaptercontent/update`,
      {
        chapterID: chapterID,
        content_number: contentNumber,
        content: content,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating chapter content:", error);
    throw error;
  }
};
export const deleteChapter = async (chapterID, dispatch, user, accessToken) => {
  const axiosInstance = createAxiosInstance(user, dispatch);
  try {
    const response = await axiosInstance.delete(`/chapter/${chapterID}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting chapter:", error);
    throw error;
  }
};
