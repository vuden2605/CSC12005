import React, { useState, useEffect, useCallback } from "react";
import "./style.scss";
import { EmployeeService } from "../../../../services/EmployeeService";
import { Pagination } from "../../../../components/Pagination";
import { ActivityDetailModal } from "../../../../components/modals/ActivityDetailModal/ActivityDetailModal";
import { useAlert } from "../../../../context/AlertContext";

export const Activities = () => {
  const [activityName, setActivityName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRegisteredChecked, setIsRegisteredChecked] = useState(false);
  const [isUnregisteredChecked, setIsUnregisteredChecked] = useState(false);
  const [isMandatoryChecked, setIsMandatoryChecked] = useState(false);
  const [isOptionalChecked, setIsOptionalChecked] = useState(false);
  const [activityStatus, setActivityStatus] = useState("");

  // API data states
  const [activitiesData, setActivitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeringMap, setRegisteringMap] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [sortBy, setSortBy] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("DESC");

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
        sortBy: sortBy,
        direction: sortDirection,
      };

      if (activityName) params.activityName = activityName;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const data = await EmployeeService.getActivitiesEMP(params);

      // Normalize payload so table can render nested shape from API
      const rawActivities = Array.isArray(data)
        ? data
        : data?.content || data?.activities || [];
      let normalizedActivities = rawActivities.map((item) => {
        if (item?.activity) {
          return {
            ...item.activity,
            isRegistered: item.isRegistered,
            isSuccess: item.isSuccess,
          };
        }
        return item;
      });

      // Apply frontend filtering for registration status
      if (isRegisteredChecked && !isUnregisteredChecked) {
        // Only show registered
        normalizedActivities = normalizedActivities.filter(
          (item) => item.isRegistered === true
        );
      } else if (!isRegisteredChecked && isUnregisteredChecked) {
        // Only show unregistered
        normalizedActivities = normalizedActivities.filter(
          (item) => item.isRegistered === false
        );
      }
      // If both are checked or both are unchecked, show all

      // Apply frontend filtering for mandatory status
      if (isMandatoryChecked && !isOptionalChecked) {
        // Only mandatory activities
        normalizedActivities = normalizedActivities.filter(
          (item) => item.isMandatory === true
        );
      } else if (!isMandatoryChecked && isOptionalChecked) {
        // Only optional (non-mandatory) activities
        normalizedActivities = normalizedActivities.filter(
          (item) => item.isMandatory === false
        );
      }

      // Apply frontend filtering for activity status
      if (activityStatus) {
        normalizedActivities = normalizedActivities.filter(
          (item) => item.activityStatus === activityStatus
        );
      }

      setActivitiesData(normalizedActivities);

      // Set pagination nếu có
      if (data?.totalPages !== undefined) {
        setPagination((prev) => ({
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
  }, [
    pagination.page,
    pagination.size,
    activityName,
    startDate,
    endDate,
    isRegisteredChecked,
    isUnregisteredChecked,
    isMandatoryChecked,
    isOptionalChecked,
    activityStatus,
    sortBy,
    sortDirection,
  ]);

  // Fetch activities khi component mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Reset page về 0 khi filters thay đổi
  useEffect(() => {
    if (pagination.page !== 0) {
      setPagination((prev) => ({ ...prev, page: 0 }));
    }
  }, [
    activityName,
    startDate,
    endDate,
    isRegisteredChecked,
    isUnregisteredChecked,
    isMandatoryChecked,
    isOptionalChecked,
    activityStatus,
  ]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleSizeChange = (newSize) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const handlePaginationPageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePaginationSizeChange = (size) => {
    setPagination((prev) => ({ ...prev, size, page: 0 }));
  };
  const { showAlert } = useAlert();
  const handleToggleRegister = async (activity) => {
    const activityId = activity.id;

    setRegisteringMap((prev) => ({ ...prev, [activityId]: true }));

    try {
      if (activity.isRegistered) {
        await EmployeeService.cancelActivity(activityId);
        showAlert("success", "Hủy đăng ký thành công");
      } else {
        await EmployeeService.registerActivity(activityId);
        showAlert("success", "Đăng ký thành công");
      }

      await fetchActivities();

      setSelectedActivity((prev) =>
        prev && prev.id === activityId
          ? { ...prev, isRegistered: !activity.isRegistered }
          : prev
      );
    } catch (err) {
      showAlert("error", err.message || "Có lỗi xảy ra");
    } finally {
      setRegisteringMap((prev) => ({ ...prev, [activityId]: false }));
    }
  };

  const handleViewActivity = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSortColumn = (column) => {
    if (sortBy === column) {
      // Toggle direction if clicking same column
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      // Set new column and default to ASC
      setSortBy(column);
      setSortDirection("ASC");
    }
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

          <div className="filter-group">
            <span className="filter-label">Trạng thái đăng ký:</span>
            <div className="checkbox-row">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isRegisteredChecked}
                  onChange={() => setIsRegisteredChecked(!isRegisteredChecked)}
                />
                Đã đăng ký
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isUnregisteredChecked}
                  onChange={() =>
                    setIsUnregisteredChecked(!isUnregisteredChecked)
                  }
                />
                Chưa đăng ký
              </label>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Bắt buộc tham gia:</span>
            <div className="checkbox-row">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isMandatoryChecked}
                  onChange={() => setIsMandatoryChecked(!isMandatoryChecked)}
                />
                Bắt buộc
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isOptionalChecked}
                  onChange={() => setIsOptionalChecked(!isOptionalChecked)}
                />
                Không bắt buộc
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="activityStatus">Trạng thái hoạt động:</label>
            <select
              id="activityStatus"
              value={activityStatus}
              onChange={(e) => setActivityStatus(e.target.value)}
              className="input-field"
            >
              <option value="">Tất cả</option>
              <option value="ONGOING">Đang diễn ra</option>
              <option value="OPEN_FOR_REGISTRATION">Đang mở đăng ký</option>
              <option value="REGISTRATION_CLOSED">Đã đóng đăng ký</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              {/* <option value="CANCELLED">Đã hủy</option>
              <option value="DRAFT">Nháp</option> */}
            </select>
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
              setIsRegisteredChecked(false);
              setIsUnregisteredChecked(false);
              setIsMandatoryChecked(false);
              setIsOptionalChecked(false);
              setActivityStatus("");
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
                    <th
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => handleSortColumn("startDate")}
                      title="Bấm để sắp xếp"
                    >
                      Ngày bắt đầu{" "}
                      {sortBy === "startDate" &&
                        (sortDirection === "ASC" ? "↑" : "↓")}
                    </th>
                    <th>Ngày kết thúc</th>
                    <th>Điểm thưởng</th>
                    <th>Số lượng</th>
                    <th>Đã đăng ký</th>
                    <th>Đăng ký</th>
                    <th>Xem</th>
                  </tr>
                </thead>
                <tbody>
                  {activitiesData.map((activity, index) => (
                    <tr
                      key={activity.id || index}
                      className={index % 2 === 0 ? "even-row" : ""}
                    >
                      <td className="name-cell">
                        {activity.activityName || activity.name || "N/A"}
                      </td>
                      <td className="date-cell">
                        {formatDate(activity.startDate) || "N/A"}
                      </td>
                      <td className="date-cell">
                        {formatDate(activity.endDate) || "N/A"}
                      </td>
                      <td className="point-cell">
                        {activity.basePoints ??
                          activity.points ??
                          activity.point ??
                          activity.reward ??
                          0}
                      </td>
                      <td className="quantity-cell">
                        {activity.maxParticipants ??
                          activity.count ??
                          activity.totalSlot ??
                          activity.slots ??
                          "N/A"}
                      </td>
                      <td className="registered-count-cell">
                        {activity.registeredCount || 0}
                      </td>
                      <td className="register-cell">
                        <button
                          className={`register-button ${
                            activity.isRegistered ? "registered" : ""
                          }`}
                          onClick={() => handleToggleRegister(activity)}
                        >
                          {activity.isRegistered
                            ? "Hủy đăng ký"
                            : registeringMap[activity.id]
                            ? "Đang đăng ký..."
                            : "Đăng ký"}
                        </button>
                      </td>
                      <td className="action-cell">
                        <button
                          className="view-link"
                          onClick={() => handleViewActivity(activity)}
                        >
                          Xem
                        </button>
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

      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
