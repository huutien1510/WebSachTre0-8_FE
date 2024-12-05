import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <section
      id="sidebar"
      className="w-64 min-h-screen p-4 text-white border-r border-r-custom-gray my-4"
    >
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2 py-2 rounded ${isActive ? "bg-[#2A2A2B] text-[#18B088]" : "hover:bg-[#2A2A2B]"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
              />
            </svg>

            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2 py-2 rounded ${isActive ? "bg-[#2A2A2B] text-[#18B088]" : "hover:bg-[#2A2A2B]"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

            <span>Users</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/books"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2 py-2 rounded ${isActive ? "bg-[#2A2A2B] text-[#18B088]" : "hover:bg-[#2A2A2B]"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span>Books</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/chapters"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2 py-2 rounded ${isActive ? "bg-[#2A2A2B] text-[#18B088]" : "hover:bg-[#2A2A2B]"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 4h14c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 9h14"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13h14"
              />
            </svg>
            <span>Chapters</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/ratings"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2 py-2 rounded ${isActive ? "bg-[#2A2A2B] text-[#18B088]" : "hover:bg-[#2A2A2B]"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
            <span>Ratings</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-1 py-2 rounded-lg ${isActive ? "bg-[#2A2A2B] text-[#18B088]" : "hover:bg-[#2A2A2B]"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
              className="w-8 h-8"
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
            </svg>
            <span>Orders</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/contests"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2 py-2 rounded ${isActive ? "bg-[#2A2A2B] text-[#18B088]" : "hover:bg-[#2A2A2B]"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 3.5H8c-1.1 0-2 .9-2 2v2a5.5 5.5 0 0 0 4 5.288V17H8.75a.75.75 0 0 0-.75.75v.5c0 .415.336.75.75.75h6.5a.75.75 0 0 0 .75-.75v-.5a.75.75 0 0 0-.75-.75H14v-4.212a5.5 5.5 0 0 0 4-5.288V5.5c0-1.1-.9-2-2-2Zm0 2.25v1.806a3.25 3.25 0 0 1-2 3.048V5.75h2ZM10 5.75v4.854a3.25 3.25 0 0 1-2-3.048V5.75h2Z"
              />
            </svg>
            <span>Contest</span>
          </NavLink>
        </li>
      </ul>
    </section>
  );
}
