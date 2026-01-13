import React from "react";

// Panel chi tiết hoạt động hiển thị inline trong dashboard
const ActivityDetailModal = ({ activity }) => {
  if (!activity) return null;

  return (
    <div className="activity-detail-panel">
      <h3>{activity.name}</h3>
      <p>Mô tả: {activity.description}</p>
    </div>
  );
};

export default ActivityDetailModal;
