import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./style.scss";
import InfoCard from "../../../components/InfoCard";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "personal", label: "Thông tin cá nhân", path: "/employee/dashboard/info" },
    { id: "attendance", label: "Lịch sử chấm công", path: "/employee/dashboard/attendance" },
    { id: "request", label: "Yêu cầu", path: "/employee/dashboard/request" },
    { id: "event", label: "Sự kiện", path: "/employee/dashboard/event" },
    { id: "score", label: "Điểm", path: "/employee/dashboard/score" },
  ];

  // Navigate tới trang mặc định khi vào component
  useEffect(() => {
    // Nếu đang ở đúng path /employee/dashboard (không có sub-path)
    if (location.pathname === "/employee/dashboard") {
      navigate("/employee/dashboard/info", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Cập nhật activeTab dựa trên URL hiện tại
  useEffect(() => {
    const currentTab = tabs.find(tab => location.pathname.startsWith(tab.path));
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <div className="dashboard-page">
      {/* Header Section - Fetch thông tin nhân viên từ API */}
      <InfoCard />
      
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

      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};