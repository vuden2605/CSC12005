import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { ActivityService } from "../../services/ActivityService";

// Danh sách hoạt động của công ty dành cho CEO
const CompanyActivityList = ({ onSelectActivity }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ActivityService.getActivities({
          page: 0,
          size: 10,
        });
        // BE trả về Page, lấy content
        const list = Array.isArray(data) ? data : data?.content || [];
        setActivities(list);
      } catch (err) {
        setError(err.message || "Không thể tải danh sách hoạt động");
        console.error("Error fetching activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div>Đang tải hoạt động công ty...</div>;
  }

  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="activity-list">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div>
              <h3>{activity.activityName}</h3>
              <p>{activity.description}</p>
            </div>
            <Button
              color="info"
              onClick={() => onSelectActivity && onSelectActivity(activity)}
            >
              Xem chi tiết
            </Button>
          </div>
        ))
      ) : (
        <div>Không có hoạt động nào.</div>
      )}
    </div>
  );
};

export default CompanyActivityList;
