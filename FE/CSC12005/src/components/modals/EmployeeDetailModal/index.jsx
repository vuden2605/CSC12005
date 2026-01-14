import React from "react";
import { useSelector } from "react-redux";
import { formatCurrencyVND } from "../../../Utils/formatCurrency";
import "./style.scss";

const EmployeeDetailModal = ({ employee, open, onClose }) => {
  if (!open || !employee) return null;

  const currentUser = useSelector((state) => state.user.currentUser);
  const role = currentUser?.position?.role?.toUpperCase();
  const canViewSalary = role === "HRM";
  const isActive =
    employee.employmentStatus === "ACTIVE" || employee.status === true;

  return (
    <div className="employee-detail-backdrop" onClick={onClose}>
      <div
        className="employee-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="employee-detail-header">
          <h3>Thông tin nhân viên</h3>
          <button
            type="button"
            className="employee-detail-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="employee-detail-body">
          <div className="detail-row">
            <span className="detail-label">Mã nhân viên</span>
            <span className="detail-value">
              {employee.employeeCode || "N/A"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Họ và tên</span>
            <span className="detail-value">{employee.fullName || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{employee.email || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phòng ban</span>
            <span className="detail-value">
              {employee.department?.departmentName || "N/A"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vị trí</span>
            <span className="detail-value">
              {employee.position?.positionName || "N/A"}
            </span>
          </div>
          {canViewSalary && (
            <div className="detail-row">
              <span className="detail-label">Lương cơ bản</span>
              <span className="detail-value">
                {employee.baseSalary != null
                  ? formatCurrencyVND(employee.baseSalary)
                  : "N/A"}
              </span>
            </div>
          )}
          <div className={`detail-row status-row ${isActive ? "active" : ""}`}>
            <span className="detail-label">Trạng thái</span>
            <span className="detail-value">
              {employee.employmentStatus ||
                (employee.status === true
                  ? "Đang làm việc"
                  : employee.status === false
                  ? "Ngừng làm việc"
                  : "N/A")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
