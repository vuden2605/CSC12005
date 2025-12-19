import React, { useState, useEffect } from "react";
import { EmployeeService } from "../../../../../services/EmployeeService";
import "./style.scss";

export const PersonalInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState({
    name: "",
    department: "",
    position: "",
    workType: "",
    avatar: "👨‍💼",
  });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const employeeData = await EmployeeService.getCurrentUser();
        
        // Map dữ liệu từ API vào state
        setEmployee({
          name: employeeData.fullName || "",
          department: employeeData.department?.departmentName || "",
          position: employeeData.position?.positionName || "",
          workType: employeeData.position?.baseWorkTimes ? `${employeeData.position.baseWorkTimes} giờ/ngày` : "",
          avatar: employeeData.avatar || "👨‍💼",
        });
      } catch (err) {
        console.error("Error fetching personal info:", err);
        setError(err.message || "Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleEdit = () => {
    alert("Chức năng chỉnh sửa sẽ được thêm sau!");
  };

  if (loading) {
    return (
      <div className="personal-info">
        <div className="employee-card">
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="personal-info">
        <div className="employee-card">
          <p style={{ color: "red" }}>Lỗi: {error}</p>
        </div>
      </div>
    );
  }

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
