import React, { useEffect, useState } from "react";
import { ManagerService } from "../../../services/ManagerService";
import { Pagination } from "../../../components/Pagination";
import ManagerScheduleDetailModal from "./ManagerScheduleDetailModal";
import "../../../components/ScheduleList/ScheduleList.scss";
import "./style.scss";

const ManagerMySchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    timeSlot: "",
    status: "SCHEDULED",
    location: "",
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    sortBy: "date",
    direction: "ASC",
  });

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchMySchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.size, filters]);

  const fetchMySchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ManagerService.getMySchedules(filters, pagination);

      if (response && Array.isArray(response.content)) {
        setSchedules(response.content);
        setTotalElements(response.totalElements ?? response.content.length);
      } else if (Array.isArray(response)) {
        setSchedules(response);
        setTotalElements(response.length);
      } else {
        setSchedules([]);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Fetch my schedules error:", err);
      setError(err.message || "Không thể tải lịch phỏng vấn");
      setSchedules([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 0 });
    fetchMySchedules();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      timeSlot: "",
      status: "SCHEDULED",
      location: "",
    });
    setPagination({
      page: 0,
      size: 5,
      sortBy: "date",
      direction: "ASC",
    });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const timeSlotOptions = [
    { value: "MORNING", label: "Buổi sáng" },
    { value: "AFTERNOON", label: "Buổi chiều" },
    { value: "EVENING", label: "Buổi tối" },
  ];

  const statusOptions = [
    { value: "SCHEDULED", label: "Đã lên lịch" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];


  const getStatusClass = (status) => {
    const classes = {
      SCHEDULED: "status-scheduled",
      COMPLETED: "status-completed",
      CANCELLED: "status-cancelled",
    };
    return classes[status] || "status-default";
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  const getTimeSlotLabel = (timeSlot) => {
    const option = timeSlotOptions.find((opt) => opt.value === timeSlot);
    return option ? option.label : timeSlot;
  };

  const totalPages = Math.ceil(totalElements / pagination.size || 1);

  return (
    <div className="schedule-list">
      <div className="page-header">
        <h2 className="page-title">
          <i className="icon-calendar"></i>
          Lịch phỏng vấn được phân công
        </h2>
      </div>

      <div className="filter-section">
        <form onSubmit={handleSearch}>
          <div className="filter-grid">
            <div className="filter-item" style={{ width: "150px" }}>
              <label htmlFor="dateFrom">Từ ngày</label>
              <input
                type="date"
                id="dateFrom"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </div>

            <div className="filter-item" style={{ width: "150px" }}>
              <label htmlFor="dateTo">Đến ngày</label>
              <input
                type="date"
                id="dateTo"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
            </div>

            {/* Removed position filter per backend spec */}

            <div className="filter-item" style={{ width: "150px" }}>
              <label htmlFor="timeSlot">Khung giờ</label>
              <select
                id="timeSlot"
                value={filters.timeSlot}
                onChange={(e) =>
                  setFilters({ ...filters, timeSlot: e.target.value })
                }
              >
                <option value="">Tất cả</option>
                {timeSlotOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item" style={{ width: "150px" }}>
              <label htmlFor="status">Trạng thái</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">Tất cả</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item" style={{ width: "180px", marginRight: "10px" }}>
              <label htmlFor="location">Địa điểm</label>
              <input
                type="text"
                id="location"
                placeholder="Nhập địa điểm..."
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              />
            </div>
          </div>

          <div className="filter-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Đặt lại
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <i className="icon-alert"></i>
          {error}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <i className="icon-inbox"></i>
            <p>Không có lịch phỏng vấn nào được phân công</p>
          </div>
        ) : (
          <>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ngày phỏng vấn</th>
                  <th>Khung giờ</th>
                  <th>Địa điểm</th>
                  <th>Vị trí</th>
                  <th>Người phỏng vấn</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr key={schedule.id}>
                    <td className="text-center">
                      {pagination.page * pagination.size + index + 1}
                    </td>
                    <td>
                      <div className="schedule-date">
                        <strong>{schedule.date}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="time-slot-badge">
                        {getTimeSlotLabel(schedule.timeSlot)}
                      </span>
                    </td>
                    <td>
                      <span className="location-text">{schedule.location}</span>
                    </td>
                    <td>{schedule.position?.positionName || "N/A"}</td>
                    <td>{schedule.interviewer?.fullName || "Chưa gán"}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          schedule.status
                        )}`}
                      >
                        {getStatusLabel(schedule.status)}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-view"
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setIsDetailModalVisible(true);
                        }}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              pageSize={pagination.size}
              totalElements={totalElements}
              onPageChange={handlePageChange}
              onPageSizeChange={(newSize) =>
                setPagination({ ...pagination, size: newSize, page: 0 })
              }
              loading={loading}
            />
          </>
        )}
      </div>

      {isDetailModalVisible && selectedSchedule && (
        <ManagerScheduleDetailModal
          scheduleId={selectedSchedule.id}
          onClose={() => {
            setIsDetailModalVisible(false);
            setSelectedSchedule(null);
          }}
          onUpdate={fetchMySchedules}
        />
      )}
    </div>
  );
};

export default ManagerMySchedules;
