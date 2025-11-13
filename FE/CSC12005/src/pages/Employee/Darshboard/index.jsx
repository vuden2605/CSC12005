import React,{ useState } from "react";
import { Send } from "lucide-react";
import { Outlet } from "react-router-dom";
import "./style.scss";
import InfoCard from "../../../components/InfoCard";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("info");

  const employee = {
    name: "Nguyễn Quang Vũ",
    role: "Nhân viên kỹ thuật",
    avatar: "👨‍💼",
  };
const tabs = [
    { id: "personal", label: "Thông tin cá nhân" },
    { id: "attendance", label: "Lịch sử chấm công" },
    { id: "request", label: "Yêu cầu" },
    { id: "event", label: "Sự kiện" },
    { id: "score", label: "Điểm" },
  ];
  
  return (
    <div className="dashboard-page">
      {/* Header Section */}
      
      <InfoCard employee={employee}/>
<div className="tabs-section">
        <h3 className="section-title">Thao tác nhanh</h3>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
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
