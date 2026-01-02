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
    employeeCode: "",
    employmentStatus: "",
    workSchedule: "",
    email: "",
    phone: "",
    avatarUrl: "",
    avatar: "👨‍💼",
  });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const employeeData = await EmployeeService.getCurrentUser();

        // Map enum/trạng thái sang tiếng Việt nếu có
        const EMPLOYMENT_STATUS_LABEL = {
          ACTIVE: "Đang làm việc",
          INACTIVE: "Ngừng làm việc",
          PROBATION: "Thử việc",
          TERMINATED: "Đã nghỉ việc",
        };

        const WORK_SCHEDULE_LABEL = {
          FULL_TIME: "Toàn thời gian",
          PART_TIME: "Bán thời gian",
          SHIFT: "Theo ca",
          CONTRACT: "Hợp đồng",
        };

        // Map dữ liệu từ API vào state
        setEmployee({
          name: employeeData.fullName || "",
          department: employeeData.department?.departmentName || "",
          position: employeeData.position?.positionName || "",
          workType: employeeData.position?.baseWorkTimes
            ? `${employeeData.position.baseWorkTimes} giờ/ngày`
            : "",
          employeeCode: employeeData.employeeCode || "",
          employmentStatus:
            EMPLOYMENT_STATUS_LABEL[employeeData.employmentStatus] ||
            employeeData.employmentStatus ||
            "",
          workSchedule:
            WORK_SCHEDULE_LABEL[employeeData.workSchedule] ||
            employeeData.workSchedule ||
            "",
          email: employeeData.email || "",
          phone: employeeData.phone || "",
          avatarUrl: employeeData.avatarUrl || "",
          avatar: "👨‍💼",
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
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt="Avatar"
              className="avatar-image"
            />
          ) : (
            <span className="avatar-emoji">{employee.avatar}</span>
          )}
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

        <div className="info-extra">
          <div className="info-item">
            <span className="info-label">Mã nhân viên</span>
            <span className="info-value">{employee.employeeCode}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Trạng thái làm việc</span>
            <span className="info-value">{employee.employmentStatus}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Chế độ làm việc</span>
            <span className="info-value">{employee.workSchedule}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{employee.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Số điện thoại</span>
            <span className="info-value">{employee.phone}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
