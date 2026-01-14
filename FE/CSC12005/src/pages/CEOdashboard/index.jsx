import React, { useState } from "react";
import InfoCard from "../../components/InfoCard";
import EmployeeList from "./EmployeeList";
import CompanyActivityList from "./CompanyActivityList";
import "./style.scss";

const CEODashboard = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setActiveTab("activityDetails");
  };

  return (
    <div className="ceo-dashboard">
      {/* Thẻ thông tin CEO */}
      <InfoCard />

      {/* Các thao tác nhanh */}
      <div className="ceo-quick-actions">
        <button
          className={`ceo-quick-action-btn ${
            activeTab === "employees" ? "active" : ""
          }`}
          onClick={() => setActiveTab("employees")}
        >
          Xem nhân viên mỗi phòng ban
        </button>

        {/* Đã bỏ tab Tạo project theo yêu cầu */}

        <button
          className={`ceo-quick-action-btn ${
            activeTab === "companyActivities" ? "active" : ""
          }`}
          onClick={() => setActiveTab("companyActivities")}
        >
          Xem hoạt động của cty
        </button>

        <button
          className={`ceo-quick-action-btn ${
            activeTab === "activityDetails" ? "active" : ""
          }`}
          onClick={() => setActiveTab("activityDetails")}
        >
          Xem chi tiết hoạt động
        </button>
      </div>

      {/* Nội dung theo tab */}
      <div className="ceo-tab-container">
        {activeTab === "employees" && (
          <section className="ceo-tab-card">
            <h2 className="ceo-tab-title">Xem nhân viên mỗi phòng ban</h2>
            <EmployeeList />
          </section>
        )}

        {activeTab === "companyActivities" && (
          <section className="ceo-tab-card">
            <h2 className="ceo-tab-title">Xem hoạt động của cty</h2>
            <CompanyActivityList onSelectActivity={handleSelectActivity} />
          </section>
        )}

        {activeTab === "activityDetails" && (
          <section className="ceo-tab-card">
            <h2 className="ceo-tab-title">Xem chi tiết hoạt động</h2>
            {selectedActivity ? (
              <div className="ceo-activity-detail">
                <h3>{selectedActivity.name}</h3>
                {selectedActivity.description ? (
                  <p>{selectedActivity.description}</p>
                ) : (
                  <p>Chưa có mô tả cho hoạt động này.</p>
                )}
              </div>
            ) : (
              <p className="ceo-empty-text">
                Vui lòng chọn một hoạt động từ tab{" "}
                <strong>"Xem hoạt động của cty"</strong> để xem chi tiết.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default CEODashboard;
