import React, { useState, useEffect } from "react";
import Select from "react-select";
import { HRService } from "../../services/HRService";
import { PositionService } from "../../services/PositionService";
import CreateScheduleModal from "./CreateScheduleModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import { Pagination } from "../Pagination";
import { useAlert } from "../../context/AlertContext";
import "./ScheduleList.scss";

const ScheduleList = () => {
  const { showAlert } = useAlert();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    positionId: null,
    timeSlot: "",
    status: "",
    location: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sortBy: "date",
    direction: "ASC",
  });

  // Modal states
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // Positions
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetchPositions();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [pagination.page, pagination.size, filters]);

  const fetchPositions = async () => {
    try {
      const data = await PositionService.getAll();
      setPositions(data);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Remove empty filters
      const cleanFilters = Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const response = await HRService.filterSchedules(
        cleanFilters,
        pagination
      );

      // Handle paginated response
      if (response && response.content && Array.isArray(response.content)) {
        setSchedules(response.content);
        setTotalElements(response.totalElements || response.content.length);
      } else if (Array.isArray(response)) {
        setSchedules(response);
        setTotalElements(response.length);
      } else {
        setSchedules([]);
        setTotalElements(0);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch schedules");
      console.error("Fetch schedules error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 0 });
    fetchSchedules();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      positionId: null,
      timeSlot: "",
      status: "",
      location: "",
    });
    setPagination({
      page: 0,
      size: 10,
      sortBy: "date",
      direction: "ASC",
    });
  };

  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
    setIsDetailModalVisible(true);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateSuccess = () => {
    showAlert("success", "Tạo lịch phỏng vấn thành công!");
    setIsCreateModalVisible(false);
    fetchSchedules();
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const positionOptions = positions.map((p) => ({
    value: p.id,
    label: p.positionName || p.name,
  }));

  const timeSlotOptions = [
    { value: "MORNING", label: "Buổi sáng" },
    { value: "AFTERNOON", label: "Buổi chiều" },
  ];

  const statusOptions = [
    { value: "SCHEDULED", label: "Đã lên lịch" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const customStyles = {
    container: (base) => ({
      ...base,
      width: "200px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
    }),
  };

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

  const totalPages = Math.ceil(totalElements / pagination.size);

  return (
    <div className="schedule-list">
      <div className="page-header">
        <h2 className="page-title">
          <i className="icon-calendar"></i>
          Lịch phỏng vấn
        </h2>
        <div className="actions">
          <button
            className="btn add"
            onClick={handleOpenCreateModal}
            disabled={loading}
          >
            + Tạo lịch mới
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <form onSubmit={handleSearch}>
          <div className="filter-grid">
            {/* Date From */}
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

            {/* Date To */}
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

            {/* Position */}
            <div className="filter-item">
              <label>Vị trí</label>
              <Select
                options={positionOptions}
                isClearable
                isSearchable
                placeholder="Chọn vị trí..."
                value={positionOptions.find(
                  (opt) => opt.value === filters.positionId
                )}
                styles={customStyles}
                onChange={(opt) =>
                  setFilters({
                    ...filters,
                    positionId: opt ? opt.value : null,
                  })
                }
              />
            </div>

            {/* Time Slot */}
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

            {/* Status */}
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

            {/* Location */}
            <div
              className="filter-item"
              style={{ width: "180px", marginRight: "10px" }}
            >
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

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <i className="icon-alert"></i>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <i className="icon-inbox"></i>
            <p>Không có dữ liệu</p>
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
                        onClick={() => handleViewDetails(schedule)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
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

      {/* Create Modal */}
      {isCreateModalVisible && (
        <CreateScheduleModal
          onClose={() => setIsCreateModalVisible(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Detail Modal */}
      {isDetailModalVisible && (
        <ScheduleDetailModal
          scheduleId={selectedSchedule.id}
          onClose={() => {
            setIsDetailModalVisible(false);
            setSelectedSchedule(null);
          }}
          onUpdate={fetchSchedules}
        />
      )}
    </div>
  );
};

export default ScheduleList;
