import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../api/apiRequest.js";
import { toast, ToastContainer } from "react-toastify";
import { logoutSuccess } from "../../redux/authSlice";
import { deleteUserSuccess } from "../../redux/userSlice";
import "react-toastify/dist/ReactToastify.css";

function AccountSecurity() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const accessToken = currentUser?.data.accessToken;
  const id = currentUser?.data.account.id;

  const handleDeleteAccount = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        await deleteUser(id, accessToken, dispatch, currentUser);
        // Xóa dữ liệu khỏi redux
        dispatch(logoutSuccess());
        dispatch(deleteUserSuccess("Xóa tài khoản thành công"));

        // Clear localStorage
        localStorage.removeItem("persist:root");
        localStorage.clear();

        toast.success("Xóa tài khoản thành công", {
          style: {
            backgroundColor: "#0D0D0D",
            color: "#FFFFFF",
          },
        });
        setTimeout(() => {
          navigate("/login");
          window.location.reload();
        }, 0);
      } catch (error) {
        toast.error("Xóa tài khoản thất bại" + error, {
          style: {
            backgroundColor: "#0D0D0D",
            color: "#FFFFFF",
          },
        });
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row ">
      <div className="ml-0">
        <div className="space-y-3">
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              value={currentUser.data.account?.email}
              disabled
              className="w-96 bg-gray-800 text-white p-3 rounded-lg"
            />
            <p className="text-green-500 text-sm mt-1">Đã xác thực</p>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Mật khẩu</label>
            <input
              type="password"
              value="********"
              disabled
              className="w-96 bg-gray-800 text-white p-3 rounded-lg"
            />
          </div>

          {/* Delete Account Link */}
          <div className="pt-4">
            <p className="text-white">
              Bạn không có nhu cầu sử dụng tài khoản nữa?{" "}
              <button
                onClick={handleDeleteAccount}
                className="text-emerald-500 hover:underline"
              >
                Xóa tài khoản
              </button>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AccountSecurity;
