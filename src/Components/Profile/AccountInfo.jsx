import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultAvatar from "../../image/default-avatar.png";
import { updateUser } from "../../api/apiRequest.js";
import { format } from 'date-fns';

function AccountInfo() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const accessToken = currentUser?.data.accessToken;
  const id = currentUser?.data.account.id;
  const [user, setUser] = useState({
    username: "",
    id: "",
    name: "",
    dateOfBirth: "",
    phone: "",
    sex: "Khác",
    avatar: defaultAvatar,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatbirthday = (birthday) => {
    if (!birthday) return ""; // Trả về chuỗi rỗng nếu không có ngày

    if (typeof birthday === "string") {
      // Chuỗi dạng dd/MM/yyyy
      const [day, month, year] = birthday.split("/");
      return `${year}-${month}-${day}`; // Định dạng thành yyyy-MM-dd cho input[type="date"]
    }

    if (birthday instanceof Date) {
      return birthday.toISOString().split("T")[0];
    }

    return "";
  };

  useEffect(() => {
    if (currentUser?.data?.account) {
      const account = currentUser.data.account;
      setUser({
        username: account.username || "",
        id: account.id || "",
        name: account.name || "",
        dateOfBirth: formatbirthday(account.birthday),
        phone: account.phone || "",
        sex:
          account.sex?.charAt(0).toUpperCase() +
          account.sex?.slice(1).toLowerCase() || "Khác",
        avatar: account.avatar || defaultAvatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!id || !accessToken) {
      toast.error("Thông tin xác thực không hợp lệ!");
      return;
    }

    setIsUpdating(true);
    try {
      const updateData = {
        name: user.name,
        birthday: user.dateOfBirth
          ? format(new Date(user.dateOfBirth), "dd/MM/yyyy") // Chuyển đổi định dạng
          : null,
        sex: user.sex.toLowerCase(),
        phone: user.phone,
        avatar: user.avatar,
      };

      const result = await updateUser(
        currentUser,
        id,
        accessToken,
        dispatch,
        updateData
      );

      if (result.success) {
        toast.success("Cập nhật thông tin thành công!");
        // setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!" + error);
    } finally {
      setIsUpdating(false);
    }
  };


  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "demo-upload");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dqlb6zx2q/image/upload",
        formData
      );
      console.log(response.data.secure_url);

      setUser((prev) => ({
        ...prev,
        avatar: response.data.secure_url,
      }));
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải ảnh lên" + error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = (e) => {
    e.preventDefault();
    fileInputRef.current.value = "";
    setUser((prev) => ({
      ...prev,
      avatar: defaultAvatar,
    }))
  }

  const handleResetForm = () => {
    if (currentUser?.data?.account) {
      const account = currentUser.data.account;
      setUser({
        username: account.username || "",
        id: account.id || "",
        name: account.name || "",
        dateOfBirth: formatbirthday(account.birthday),
        sex:
          account.sex?.charAt(0).toUpperCase() +
          account.sex?.slice(1).toLowerCase() || "Khác",
        avatar: account.avatar || defaultAvatar,
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 max-w-2xl">
        <div className="space-y-2">
          {/* Form fields */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Tên đăng nhập</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full bg-gray-700 rounded-lg px-4 py-2.5 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">ID người dùng</label>
            <input
              type="text"
              value={user.id}
              disabled
              className="w-full bg-gray-700 rounded-lg px-4 py-2.5 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-gray-900 rounded-lg px-4 py-2.5 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full bg-gray-900 rounded-lg px-4 py-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={user.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-gray-900 rounded-lg px-4 py-2.5 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Giới tính</label>
              <select
                name="sex"
                value={user.sex}
                onChange={handleChange}
                className="w-full bg-gray-900 rounded-lg px-4 py-2.5 text-white"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg"
            >
              {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            <button
              onClick={handleResetForm}
              disabled={isUpdating}
              className="bg-[#383838] text-white py-2 px-4 rounded-lg border-gray-400 border"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>

      {/* Avatar section */}
      <div className="lg:w-60">
        <div className="flex flex-col items-center sticky top-6">
          <div
            className="w-32 h-32 rounded-full bg-gray-700 mb-4 overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundImage: `url(${user.avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          <div className='flex '>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-gradient-to-br from-teal-500 to-green-600 text-white py-2 px-4 rounded-lg mr-4"
            >
              {isUploading ? "Đang tải lên..." : "Thay ảnh"}
            </button>
            <button
              onClick={handleRemoveAvatar}
              className="bg-gradient-to-br from-red-400 to-red-500 text-white py-2 px-4 rounded-lg">
              Gỡ ảnh
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AccountInfo;
