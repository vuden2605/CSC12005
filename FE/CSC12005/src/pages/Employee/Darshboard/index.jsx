import React, { useState } from "react";
import { Send } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import "./style.scss";
import InfoCard from "../../../components/InfoCard";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const navigate = useNavigate();

  const employee = {
    name: "Nguyễn Quang Vũ",
    role: "Nhân viên kỹ thuật",
    avatar: "👨‍💼",
  };

  const tabs = [
    { id: "personal", label: "Thông tin cá nhân", path: "/employee/dashboard/info" },
    { id: "attendance", label: "Lịch sử chấm công", path: "/employee/dashboard/attendance" },
    { id: "request", label: "Yêu cầu", path: "/employee/dashboard/leave-request" },
    { id: "event", label: "Sự kiện", path: "/employee/dashboard/event" },
    { id: "score", label: "Điểm", path: "/employee/dashboard/score" },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path); // chuyển route
  };

  return (
    <div className="dashboard-page">
      {/* Header Section */}

        <h3 className="section-title">Thao tác nhanh</h3>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};
