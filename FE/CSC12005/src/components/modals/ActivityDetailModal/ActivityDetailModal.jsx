import React from "react";
import "./style.scss";

export const ActivityDetailModal = ({ activity, isOpen, onClose }) => {
  if (!isOpen || !activity) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{activity.activityName || activity.name || "Chi tiết sự kiện"}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Thông tin sự kiện</h3>
            
            <div className="detail-row">
              <label>Tên sự kiện:</label>
              <span>{activity.activityName || activity.name || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>Mô tả:</label>
              <span>{activity.description || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>Ngày bắt đầu:</label>
              <span>{formatDate(activity.startDate) || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>Ngày kết thúc:</label>
              <span>{formatDate(activity.endDate) || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>Điểm thưởng:</label>
              <span>{activity.points ?? 0}</span>
            </div>

            <div className="detail-row">
              <label>Số lượng:</label>
              <span>{activity.count || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>Đã đăng ký:</label>
              <span>{activity.registeredCount || 0}</span>
            </div>

            <div className="detail-row">
              <label>Trạng thái đăng ký:</label>
              <span className={activity.isRegistered ? "status-registered" : "status-unregistered"}>
                {activity.isRegistered ? "Đã đăng ký" : "Chưa đăng ký"}
              </span>
            </div>

            {activity.isSuccess !== undefined && (
              <div className="detail-row">
                <label>Trạng thái hoàn thành:</label>
                <span className={activity.isSuccess ? "status-success" : "status-pending"}>
                  {activity.isSuccess ? "Hoàn thành" : "Chưa hoàn thành"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
