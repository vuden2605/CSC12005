import React from "react";
import { Button } from "reactstrap";

const ActivityDetailModal = ({ isOpen, toggle, activity, inline = false }) => {
  if (!isOpen || !activity) return null;

  // Nếu là inline mode, hiển thị card trực tiếp
  if (inline) {
    return (
      <div className="activity-detail-panel">
        <h3>{activity.activityName || activity.name || "Chi tiết hoạt động"}</h3>
        <p>
          <strong>Mô tả:</strong> {activity.description || "N/A"}
        </p>
        {activity.startDate && (
          <p>
            <strong>Ngày bắt đầu:</strong>{" "}
            {new Date(activity.startDate).toLocaleDateString("vi-VN")}
          </p>
        )}
        {activity.endDate && (
          <p>
            <strong>Ngày kết thúc:</strong>{" "}
            {new Date(activity.endDate).toLocaleDateString("vi-VN")}
          </p>
        )}
        {activity.points !== undefined && (
          <p>
            <strong>Điểm thưởng:</strong> {activity.points}
          </p>
        )}
        <div style={{ marginTop: "1rem" }}>
          <Button color="secondary" onClick={toggle}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  // Modal mode (giữ lại cho tương thích)
  return null;
};

export default ActivityDetailModal;
