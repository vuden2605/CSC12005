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

  const handleProjectCreated = () => {
    // Có thể refresh data hoặc show notification ở đây
    console.log("Project created successfully");
  };

  return (
    <div className="dashboard-page">
      {/* Header Section - Fetch thông tin CEO từ API */}
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

      <div className="dashboard-content">
        {activeTab === "employees" && (
          <div>
            <h2>Xem nhân viên mỗi phòng ban</h2>
            <EmployeeList />
          </div>
        )}

        {activeTab === "createProject" && (
          <div>
            <h2>Tạo project</h2>
            <ProjectCreateModal 
              isOpen={true} 
              toggle={() => {}} 
              onProjectCreated={handleProjectCreated}
              inline={true}
            />
          </div>
        )}

        {activeTab === "activities" && (
          <div>
            <h2>Xem hoạt động của cty</h2>
            <CompanyActivityList onSelectActivity={handleSelectActivity} />
          </div>
        )}

        {activeTab === "activityDetail" && (
          <div>
            <h2>Xem chi tiết hoạt động</h2>
            {selectedActivity ? (
              <ActivityDetailModal 
                activity={selectedActivity} 
                isOpen={true} 
                toggle={() => setActiveTab("activities")}
                inline={true}
              />
            ) : (
              <div className="placeholder-text">
                Vui lòng chọn một hoạt động từ tab "Xem hoạt động của cty" để xem chi tiết.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CEODashboard;
