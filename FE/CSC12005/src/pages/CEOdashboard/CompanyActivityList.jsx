import React from "react";
import { Button } from "reactstrap";

const CompanyActivityList = ({ onSelectActivity }) => {
  const activities = [
    {
      id: 1,
      name: "Yearly Company Meeting",
      description: "Cuộc họp tổng kết hoạt động của công ty trong năm.",
    },
    {
      id: 2,
      name: "Product Launch Event",
      description: "Sự kiện ra mắt sản phẩm mới cho khách hàng và đối tác.",
    },
    // Có thể thêm nhiều hoạt động khác ở đây
  ];

  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <h3>{activity.name}</h3>
          <Button
            color="info"
            onClick={() => onSelectActivity && onSelectActivity(activity)}
          >
            Xem chi tiết
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CompanyActivityList;
