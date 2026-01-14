import React from "react";
import "./style.scss";

export const EmployeeDetailModal = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="employee-modal-overlay" onClick={onClose}>
      <div
        className="employee-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="employee-modal-header">
          <h2>Chi tiết nhân viên</h2>
          <button className="employee-close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="employee-modal-body">
          <div className="employee-basic-info">
            <div className="employee-avatar">
              <span>{employee.fullName?.[0] || "👤"}</span>
            </div>
            <div className="employee-main">
              <h3>{employee.fullName || "N/A"}</h3>
              <p className="employee-code">
                Mã nhân viên: <strong>{employee.employeeCode || "N/A"}</strong>
              </p>
              <p>
                Vị trí:{" "}
                <strong>
                  {employee.position?.positionName || "Chưa cập nhật"}
                </strong>
              </p>
              <p>
                Phòng ban:{" "}
                <strong>
                  {employee.department?.departmentName || "Chưa cập nhật"}
                </strong>
              </p>
            </div>
          </div>

          <div className="employee-detail-section">
            <h3>Thông tin chi tiết</h3>

            <div className="employee-detail-row">
              <label>Ngày vào làm:</label>
              <span>{formatDate(employee.joinDate)}</span>
            </div>

            <div className="employee-detail-row">
              <label>Email:</label>
              <span>{employee.email || "N/A"}</span>
            </div>

            <div className="employee-detail-row">
              <label>Số điện thoại:</label>
              <span>{employee.phoneNumber || "N/A"}</span>
            </div>

            <div className="employee-detail-row">
              <label>Trạng thái:</label>
              <span>
                {employee.status === "ACTIVE"
                  ? "Đang làm việc"
                  : employee.status === "INACTIVE"
                  ? "Ngừng làm việc"
                  : "Chưa cập nhật"}
              </span>
            </div>
          </div>
        </div>

        <div className="employee-modal-footer">
          <button className="employee-close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

