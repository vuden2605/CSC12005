// src/pages/CEODashboard/index.jsx
import React, { useState } from "react";
import "./style.scss";
import InfoCard from "../../components/InfoCard";
import EmployeeList from "./EmployeeList";
import CompanyActivityList from "./CompanyActivityList";
import ProjectCreateModal from "./ProjectCreateModal";
import ActivityDetailModal from "./ActivityDetailModal";

const CEODashboard = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [selectedActivity, setSelectedActivity] = useState(null);

  const tabs = [
    { id: "employees", label: "Xem nhân viên mỗi phòng ban" },
    { id: "createProject", label: "Tạo project" },
    { id: "activities", label: "Xem hoạt động của cty" },
    { id: "activityDetail", label: "Xem chi tiết hoạt động" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setActiveTab("activityDetail");
  };

  return (
    <div className="ceo-dashboard-page">
      {/* Header giống employee dashboard, dùng InfoCard */}
      <InfoCard />

      <h3 className="section-title">Thao tác nhanh</h3>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ceo-dashboard-content">
        {activeTab === "employees" && (
          <>
            <h2>Nhân viên theo phòng ban</h2>
            <EmployeeList />
          </>
        )}

        {activeTab === "activities" && (
          <>
            <h2>Hoạt động của công ty</h2>
            <CompanyActivityList onSelectActivity={handleSelectActivity} />
          </>
        )}

        {activeTab === "createProject" && (
          <>
            <h2>Tạo project</h2>
            <ProjectCreateModal />
          </>
        )}

        {activeTab === "activityDetail" && (
          <>
            <h2>Chi tiết hoạt động</h2>
            {selectedActivity ? (
              <ActivityDetailModal activity={selectedActivity} />
            ) : (
              <div className="placeholder-text">
                Vui lòng chọn một hoạt động trong tab "Xem hoạt động của cty"
                trước khi xem chi tiết.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CEODashboard;
