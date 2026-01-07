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
            className={`tab ${activeTab === "bonus-points" ? "active" : ""}`}
            onClick={() => setActiveTab("bonus-points")}
          >
            Quản lý điểm
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === "employees" ? (
          <EmployeeList/>
        ) : (
          <div className="bonus-points-placeholder">
            <p>Quản lý điểm thưởng</p>
            {/* TODO: Thêm component quản lý điểm ở đây */}
          </div>
        )}
        
      </div>
    </div>
  );
};
