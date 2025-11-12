import React from "react";
import "./style.scss";

export const InfoDetails = () => {
  const employee = {
    name: "Nguyễn Quang Vũ",
    department: "Phòng kỹ thuật",
    position: "Lập trình web",
    workType: "Full time",
    avatar: "👨‍💼",
  };

  return (
    <div className="personal-info">
      <div className="employee-card">
        <div className="profile-avatar-medium">
          <span className="avatar-emoji">{employee.avatar}</span>
        </div>
        <h2>{employee.name}</h2>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Phòng ban</span>
            <span className="info-value">{employee.department}</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-item">
            <span className="info-label">Tên công việc</span>
            <span className="info-value">{employee.position}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Loại công việc</span>
            <span className="info-value">{employee.workType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
