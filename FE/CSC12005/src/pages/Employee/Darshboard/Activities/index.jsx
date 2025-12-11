import React, { useState, useEffect, useCallback } from "react";
import "./style.scss";
import { EmployeeService } from "../../../../services/EmployeeService";
import { Pagination } from "../../../../components/Pagination";

export const Activities = () => {
  const [activityName, setActivityName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // API data states
  const [activitiesData, setActivitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  // Format date từ ISO string sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Fetch activities từ API
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: "id",
        direction: "ASC",
      };

      if (activityName) params.activityName = activityName;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await EmployeeService.getActivities(params);
      
      // Handle response - có thể là array hoặc object với content
      const activities = Array.isArray(data) ? data : (data?.content || data?.activities || []);
      setActivitiesData(activities);
      
      // Set pagination nếu có
      if (data?.totalPages !== undefined) {
        setPagination(prev => ({
          ...prev,
          page: data.number || pagination.page,
          size: data.size || 10,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        }));
      }

      setError(null);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      setError(err.message);
      setActivitiesData([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, activityName, startDate, endDate]);

  // Fetch activities khi component mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Reset page về 0 khi filters thay đổi
  useEffect(() => {
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  }, [activityName, startDate, endDate]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 0 }));
  };

  const handlePaginationPageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePaginationSizeChange = (size) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
  };

  return (
    <div className="activities-page">
      {/* Filter Section */}
      <div className="filter-section">
        <h3 className="section-title">Lọc sự kiện</h3>
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group">
            <label htmlFor="activityName">Tên sự kiện:</label>
            <input
              type="text"
              id="activityName"
              placeholder="Nhập tên sự kiện"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="startDate">Ngày bắt đầu:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">Ngày kết thúc:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" className="search-button">
            Tìm kiếm
          </button>
          <button
            type="button"
            className="reset-button"
            onClick={() => {
              setActivityName("");
              setStartDate("");
              setEndDate("");
              fetchActivities(0);
            }}
          >
            Đặt lại
          </button>
        </form>
      </div>

      {/* Activities List Section */}
      <div className="activities-section">
        <h3 className="section-title">Danh sách sự kiện</h3>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : activitiesData.length === 0 ? (
          <div className="no-data">Không có sự kiện nào</div>
        ) : (
          <>
            <div className="table-container">
              <table className="activities-table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Loại</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Điểm thưởng</th>
                    <th>Số lượng</th>
                    <th>Đăng ký</th>
                    <th>Xem</th>
                  </tr>
                </thead>
                <tbody>
                  {activitiesData.map((activity, index) => (
                    <tr key={activity.id || index} className={index % 2 === 0 ? 'even-row' : ''}>
                      <td className="name-cell">{activity.activityName || activity.name || "N/A"}</td>
                      <td className="type-cell">{activity.activityType || activity.type || "N/A"}</td>
                      <td className="date-cell">{formatDate(activity.startDate) || "N/A"}</td>
                      <td className="date-cell">{formatDate(activity.endDate) || "N/A"}</td>
                      <td className="point-cell">{activity.point || activity.reward || 0}</td>
                      <td className="quantity-cell">{activity.totalSlot || activity.slots || "N/A"}</td>
                      <td className="register-cell">
                        <button className="register-button">Đăng ký</button>
                      </td>
                      <td className="action-cell">
                        <a href="#" className="view-link">Xem</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.size}
              totalElements={pagination.totalElements}
              onPageChange={handlePaginationPageChange}
              onPageSizeChange={handlePaginationSizeChange}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};
