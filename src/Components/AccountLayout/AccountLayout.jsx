import { NavLink, Outlet } from "react-router-dom";
import defaultAvatar from "../../image/default-avatar.png";
import { useSelector } from "react-redux";
const AccountLayout = () => {
  const user = useSelector((state) => state.auth.login.currentUser);

  const menuItems = [
    {
      path: "/account/profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Quản lý tài khoản",
    },
    {
      path: "/account/bookcase",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      label: "Tủ sách cá nhân",
    },
    {
      path: "/account/orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
          className="w-8 h-8"
          style={{ marginLeft: '-5px', marginRight: '-4px' }}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <g>
            <path
              fillRule="nonzero"
              d="M1346.82 382.948c-13.254 0-24 10.746-24 24s10.746 24 24 24h194.114v1313.05H507.074V430.948H701.19c13.254 0 24-10.746 24-24s-10.746-24-24-24H483.074c-13.254 0-24 10.746-24 24v1361.05c0 13.254 10.746 24 24 24h1081.86c13.254 0 24-10.746 24-24V406.948c0-13.254-10.746-24-24-24H1346.82z"
            />
            <path
              fillRule="nonzero"
              d="M689.597 551.999h668.808l-73.097-248.001H762.695l-73.098 248.001zm700.841 48H658.056a24.006 24.006 0 0 1-7.277-.98c-12.713-3.746-19.982-17.092-16.235-29.805l.058.016 86.753-294.333c2.338-10.805 11.951-18.899 23.455-18.899h557.94c10.54-.2 20.339 6.614 23.463 17.215l-23.02 6.785 22.968-6.75 86.743 294.296c.99 2.63 1.534 5.48 1.534 8.456 0 13.254-10.746 24-24 24z"
            />
            <path
              fillRule="nonzero"
              d="M1371.45 487.589c-13.254 0-24 10.746-24 24s10.746 24 24 24h64.782v1103.72H611.764V535.589h64.783c13.254 0 24-10.746 24-24s-10.746-24-24-24h-88.783c-13.254 0-24 10.746-24 24v1151.72c0 13.254 10.746 24 24 24h872.468c13.254 0 24-10.746 24-24V511.589c0-13.254-10.746-24-24-24h-88.782z"
            />
            <path
              fillRule="nonzero"
              d="M684.602 691.713h128.001c13.254 0 24 10.746 24 24v128.001c0 13.254-10.746 24-24 24H684.602c-13.254 0-24-10.746-24-24V715.713c0-13.254 10.746-24 24-24zm104.001 48h-80v80h80v-80zM883.398 819.712H1363.4v48H883.398zM684.602 999.446h128.001c13.254 0 24 10.746 24 24v128.001c0 13.254-10.746 24-24 24H684.602c-13.254 0-24-10.746-24-24v-128.001c0-13.254 10.746-24 24-24zm104.001 48h-80v80h80v-80zM883.398 1127.44H1363.4v48H883.398zM684.602 1307.18h128.001c13.254 0 24 10.746 24 24v128.001c0 13.254-10.746 24-24 24H684.602c-13.254 0-24-10.746-24-24V1331.18c0-13.254 10.746-24 24-24zm104.001 48h-80v80h80v-80zM883.398 1435.18H1363.4v48H883.398z"
            />
          </g>
        </svg >
      ),
      label: "Lịch sử mua sách",
    },
    {
      path: "/account/support",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      label: "Hỗ trợ khách hàng",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full pl-28 pr-0 pt-20 pb-10">
        {/* Header Section */}
        <div className="bg-black rounded-xl p-4  shadow-lg ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.data.account.avatar || defaultAvatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.data.account.username}
                </h1>
                {/* <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-500 font-medium">0</span>
                  <span className="text-gray-400">điểm</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Sidebar Navigation */}
          <div className="w-1/2 lg:w-72">
            <div className="bg-black rounded-xl p-4  ">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                      ${isActive
                        ? "bg-gray-700 text-emerald-400"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 ">
            <div className="bg-black rounded-xl px-6 shadow-lg">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
