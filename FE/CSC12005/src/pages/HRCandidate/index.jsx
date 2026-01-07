import React, { useState } from "react";
import "./style.scss";
import CandidateList from "../../components/CandidateList";
import ScheduleList from "../../components/ScheduleList/ScheduleList";

export const HRCandidate = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  return (
    <div className="dashboard-page">
      <div className="tabs-section">
        <h3 className="section-title">Thao tác nhanh</h3>
        <div className="tabs">
          
          <button
            className={`tab ${activeTab === "candidates" ? "active" : ""}`}
            onClick={() => setActiveTab("candidates")}
          >
            Quản lý ứng viên
          </button>
          <button
            className={`tab ${activeTab === "schedules" ? "active" : ""}`}
            onClick={() => setActiveTab("schedules")}
          >
            Quản lý lịch
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === "candidates" ? (
          <CandidateList/>
        ) :  (
          <ScheduleList/>
        )
        }
        
      </div>
    </div>
  );
};
