//import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AccountInfo from "../Components/Profile/AccountInfo.jsx";
import AccountSecurity from "../Components/Profile/AccountSecurity.jsx";
import AccountLink from "../Components/Profile/AccountLink";

function Profile() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const currentTab = searchParams.get("tab") || "AccountInfo";

  const tabs = [
    {
      id: "AccountInfo",
      label: "Thông tin cá nhân",
    },
    {
      id: "AccountSecurity",
      label: "Tài khoản và bảo mật",
    },
    {
      id: "AccountLink",
      label: "Tài khoản liên kết",
    },
  ];

  const handleTabChange = (tabId) => {
    navigate(`/account/profile?tab=${tabId}`);
  };

  const renderContent = () => {
    switch (currentTab) {
      case "AccountInfo":
        return <AccountInfo />;
      case "AccountSecurity":
        return <AccountSecurity />;
      case "AccountLink":
        return <AccountLink />;
      default:
        return <AccountInfo />;
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-3">Quản lý thông tin</h1>
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-6 border-b border-gray-700 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pb-2 whitespace-nowrap ${
              currentTab === tab.id
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}

export default Profile;
