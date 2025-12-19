import React, { useState } from "react";
import "./style.scss";
import EmployeeList from "../../components/EmployeeList";
import CandidateList from "../../components/CandidateList";

export const HRAdmin = () => {
  const [activeTab, setActiveTab] = useState("employees");
  return (
    <div className="dashboard-page">
      <div className="tabs-section">
        <h3 className="section-title">Thao tác nhanh</h3>
        <div className="tabs">
          <button
            className={`tab ${activeTab === "employees" ? "active" : ""}`}
            onClick={() => setActiveTab("employees")}
          >
            Quản lý nhân viên
          </button>
          <button
            className={`tab ${activeTab === "candidates" ? "active" : ""}`}
            onClick={() => setActiveTab("candidates")}
          >
            Ứng viên
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === "employees" ? (
          <EmployeeList/>
        ) : (
          <CandidateList/>
        )}
        
      </div>
    </div>
  );
};
