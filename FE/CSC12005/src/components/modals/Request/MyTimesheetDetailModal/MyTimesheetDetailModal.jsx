import React from "react";
import "../style.scss";

export const MyTimesheetDetailModal = ({ timesheet, onClose }) => {
  if (!timesheet) return null;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "-";

  const formatDateTime = (dateString) =>
    dateString ? new Date(dateString).toLocaleString("vi-VN") : "-";

  const statusMap = {
    PRESENT: "Có mặt (đúng giờ)",
    LATE: "Có mặt (đi muộn)",
    ABSENT: "Vắng mặt",
    WFH: "Làm việc từ xa",
    HALF_DAY: "Làm nửa ngày",
    HOLIDAY: "Ngày nghỉ / ngày lễ",
  };

  const type = timesheet.type || timesheet.status;

  return (
    <div className="modal-overlay">
      <div className="modal-box wfh-detail-modal">
        <div className="modal-header">
          <h2>Chi tiết chấm công</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* Thông tin chung */}
          <div className="detail-section">
            <h3>Thông tin chấm công</h3>

            <div className="detail-row">
              <span className="detail-label">Ngày làm việc:</span>
              <span className="detail-value">{formatDate(timesheet.workDate)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Check-in:</span>
              <span className="detail-value">{timesheet.checkIn || "-"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Check-out:</span>
              <span className="detail-value">{timesheet.checkOut || "-"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Loại chấm công:</span>
              <span className="detail-value">
                {statusMap[type] || type || "-"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Giờ làm:</span>
              <span className="detail-value">
                {typeof timesheet.workHours === "number"
                  ? `${timesheet.workHours} giờ`
                  : "-"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Đi muộn:</span>
              <span className="detail-value">
                {typeof timesheet.lateMinutes === "number"
                  ? `${timesheet.lateMinutes} phút`
                  : "0 phút"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Làm ngày nghỉ / ngày lễ:</span>
              <span className="detail-value">
                {timesheet.isWorkOnHoliday ? "Có" : "Không"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Đã điều chỉnh:</span>
              <span className="detail-value">
                {timesheet.isAdjusted ? "Có" : "Không"}
              </span>
            </div>
          </div>

          {/* Thông tin nhân viên */}
          <div className="detail-section">
            <h3>Thông tin nhân viên</h3>

            <div className="detail-row">
              <span className="detail-label">Mã nhân viên:</span>
              <span className="detail-value">{timesheet.employeeCode || "-"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Tên nhân viên:</span>
              <span className="detail-value">{timesheet.employeeName || "-"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Phòng ban:</span>
              <span className="detail-value">{timesheet.departmentName || "-"}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Chức vụ:</span>
              <span className="detail-value">{timesheet.positionName || "-"}</span>
            </div>
          </div>

          {/* Thông tin hệ thống */}
          <div className="detail-section">
            <h3>Thông tin hệ thống</h3>

            <div className="detail-row">
              <span className="detail-label">Ngày tạo:</span>
              <span className="detail-value">{formatDateTime(timesheet.createdAt)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Người tạo:</span>
              <span className="detail-value">
                {timesheet.employeeCodeCreated
                  ? `${timesheet.employeeNameCreated || ""} (${timesheet.employeeCodeCreated})`
                  : "-"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Lần cập nhật gần nhất:</span>
              <span className="detail-value">{formatDateTime(timesheet.updatedAt)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Người cập nhật:</span>
              <span className="detail-value">
                {timesheet.employeeCodeUpdated
                  ? `${timesheet.employeeNameUpdated || ""} (${timesheet.employeeCodeUpdated})`
                  : "-"}
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn cancel" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
