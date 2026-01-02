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

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ACTIVITY_STATUS_LABEL = {
    DRAFT: "Nháp",
    OPEN_FOR_REGISTRATION: "Đang mở đăng ký",
    REGISTRATION_CLOSED: "Đã đóng đăng ký",
    ONGOING: "Đang diễn ra",
    COMPLETED: "Đã hoàn thành",
    CANCELLED: "Đã hủy",
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
              <label>Loại hoạt động:</label>
              <span>{activity.activityType || "N/A"}</span>
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
              <label>Thời gian:</label>
              <span>
                {(activity.startTime || activity.endTime) && (
                  <>
                    {activity.startTime || "--:--"} - {activity.endTime || "--:--"}
                  </>
                )}
                {activity.duration
                  ? ` (${activity.duration} phút)`
                  : ""}
              </span>
            </div>

            <div className="detail-row">
              <label>Hạn đăng ký:</label>
              <span>
                {activity.registrationDeadline
                  ? formatDateTime(activity.registrationDeadline)
                  : "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <label>Điểm thưởng:</label>
              <span>{
                activity.basePoints ??
                activity.points ??
                activity.point ??
                activity.reward ??
                0
              }</span>
            </div>

            <div className="detail-row">
              <label>Số lượng:</label>
              <span>
                {activity.minParticipants || activity.maxParticipants
                  ? `${activity.minParticipants || 0} - ${
                      activity.maxParticipants || 0
                    } người`
                  : activity.count || "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <label>Đã đăng ký:</label>
              <span>{activity.registeredCount || 0}</span>
            </div>

            {activity.attachmentUrl && (
              <div className="detail-row">
                <label>Tài liệu/Ảnh đính kèm:</label>
                <span>
                  <a
                    href={activity.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Mở liên kết
                  </a>
                </span>
              </div>
            )}

            <div className="detail-row">
              <label>Địa điểm:</label>
              <span>{activity.location || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>Địa chỉ:</label>
              <span>{activity.address || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>Đơn vị tổ chức:</label>
              <span>{activity.organizer || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>SĐT liên hệ:</label>
              <span>{activity.contactPhone || "N/A"}</span>
            </div>

            <div className="detail-row">
              <label>Email liên hệ:</label>
              <span>{activity.contactEmail || "N/A"}</span>
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

            {activity.activityStatus && (
              <div className="detail-row">
                <label>Trạng thái hoạt động:</label>
                <span>
                  {ACTIVITY_STATUS_LABEL[activity.activityStatus] ||
                    activity.activityStatus}
                </span>
              </div>
            )}

            {activity.isMandatory !== undefined && (
              <div className="detail-row">
                <label>Bắt buộc tham gia:</label>
                <span>{activity.isMandatory ? "Có" : "Không"}</span>
              </div>
            )}

            {(activity.firstPlaceBonus ||
              activity.secondPlaceBonus ||
              activity.thirdPlaceBonus) && (
              <div className="detail-row">
                <label>Thưởng theo giải:</label>
                <span>
                  {activity.firstPlaceBonus &&
                    `Nhất: ${activity.firstPlaceBonus} điểm`}
                  {activity.secondPlaceBonus &&
                    `, Nhì: ${activity.secondPlaceBonus} điểm`}
                  {activity.thirdPlaceBonus &&
                    `, Ba: ${activity.thirdPlaceBonus} điểm`}
                </span>
              </div>
            )}

            {activity.notes && (
              <div className="detail-row">
                <label>Ghi chú:</label>
                <span>{activity.notes}</span>
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
