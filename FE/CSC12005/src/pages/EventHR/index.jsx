import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./style.scss";
import { EmployeeService } from "../../services/EmployeeService";
import { Pagination } from "../../components/Pagination";
import { ActivityDetailModal } from "../../components/modals/ActivityDetailModal/ActivityDetailModal";
import img from "../../assets/image.png";
import { ActivityUpdateModal } from "../../components/modals/ActivityUpdateModal/ActivityUpdateModal";
import { ActivityCreateModal } from "../../components/modals/ActivityCreateModal/ActivityCreateModal";

const DEFAULT_PAGINATION = {
  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
};
const DEFAULT_SORT = { sortBy: "startDate", direction: "DESC" };

export const EventPageHR = () => {
  const [filters, setFilters] = useState({
    activityName: "",
    startDate: "",
    endDate: "",
    isRegisteredChecked: false,
    isUnregisteredChecked: false,
  });
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [sort, setSort] = useState(DEFAULT_SORT);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeringMap, setRegisteringMap] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(activities);
  // NEW: modal/create event (UI hook - bạn nối route/modal thật sau)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";

  const buildParams = useMemo(() => {
    const { activityName, startDate, endDate } = filters;
    const params = {
      page: pagination.page,
      size: pagination.size,
      sortBy: sort.sortBy,
      direction: sort.direction,
    };
    if (activityName) params.activityName = activityName;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return params;
  }, [filters, pagination.page, pagination.size, sort]);

  const applyRegistrationFilter = useCallback(
    (items) => {
      const { isRegisteredChecked, isUnregisteredChecked } = filters;
      if (isRegisteredChecked && !isUnregisteredChecked) {
        return items.filter((item) => item.isRegistered === true);
      }
      if (!isRegisteredChecked && isUnregisteredChecked) {
        return items.filter((item) => item.isRegistered === false);
      }
      return items;
    },
    [filters]
  );

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getActivities(buildParams);

      const raw = Array.isArray(data)
        ? data
        : data?.content || data?.activities || [];
      const normalized = raw.map((item) =>
        item?.activity
          ? {
              ...item.activity,
              isRegistered: item.isRegistered,
              isSuccess: item.isSuccess,
            }
          : item
      );

      setActivities(applyRegistrationFilter(normalized));

      if (data?.totalPages !== undefined) {
        setPagination((prev) => ({
          ...prev,
          page: data.number ?? prev.page,
          size: data.size ?? prev.size,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        }));
      }

      setError(null);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      setError(err.message || "Không thể tải dữ liệu");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [applyRegistrationFilter, buildParams]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, [
    filters.activityName,
    filters.startDate,
    filters.endDate,
    filters.isRegisteredChecked,
    filters.isUnregisteredChecked,
  ]);

  const handleInputChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckboxChange = (field) => () => {
    setFilters((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 0 }));
    fetchActivities();
  };

  const handleReset = () => {
    setFilters({
      activityName: "",
      startDate: "",
      endDate: "",
      isRegisteredChecked: false,
      isUnregisteredChecked: false,
    });
    setPagination({ ...DEFAULT_PAGINATION, page: 0 });
    setSort(DEFAULT_SORT);
  };

  const handleRegister = async (activityId) => {
    setRegisteringMap((prev) => ({ ...prev, [activityId]: true }));
    try {
      await EmployeeService.registerActivity(activityId);
      await fetchActivities();
      setSelectedActivity((prev) =>
        prev && prev.id === activityId ? { ...prev, isRegistered: true } : prev
      );
    } catch (err) {
      console.error("Failed to register activity:", err);
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setRegisteringMap((prev) => ({ ...prev, [activityId]: false }));
    }
  };

  const handleSortColumn = (column) => {
    setSort((prev) =>
      prev.sortBy === column
        ? { ...prev, direction: prev.direction === "ASC" ? "DESC" : "ASC" }
        : { sortBy: column, direction: "ASC" }
    );
  };

  const handleCreateEvent = (createActivity) => {
    if (!createActivity) return;

    setActivities((prev) => [createActivity, ...prev]);

    setIsCreateModalOpen(false);
  };
  const handleUpdateActivity = (updatedActivity) => {
    console.log("gửi form:", updatedActivity);
    setActivities((prevActivities) =>
      prevActivities.map((emp) =>
        emp.id === updatedActivity.id ? updatedActivity : emp
      )
    );
  };

  return (
    <div className="dashboard-content">
      <div className="event-hr">
        {/* Header / Hero */}
        <div className="event-hr__hero">
          <div className="event-hr__heroLeft"></div>
          <div className="event-hr__title">
            <img className="event-hr__icon" src={img} alt="megaphone" />
            Quản lý sự kiện
          </div>

          <div className="event-hr__heroRight">
            <button
              type="button"
              className="event-hr__primaryBtn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Tạo mới sự kiện
            </button>
          </div>
        </div>

        <div className="activities-page">
          {/* Filter card */}
          <div className="filter-section">
            <h3 className="section-title">Lọc sự kiện</h3>

            <form onSubmit={handleSearch} className="filter-form">
              <div className="filter-group">
                <label htmlFor="activityName">Tên sự kiện:</label>
                <input
                  type="text"
                  id="activityName"
                  placeholder="Nhập tên sự kiện"
                  value={filters.activityName}
                  onChange={handleInputChange("activityName")}
                  className="input-field"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="startDate">Ngày bắt đầu:</label>
                <input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={handleInputChange("startDate")}
                  className="input-field"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="endDate">Ngày kết thúc:</label>
                <input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={handleInputChange("endDate")}
                  className="input-field"
                />
              </div>

              <div className="filter-actions">
                <button type="submit" className="search-button">
                  Tìm kiếm
                </button>
                <button
                  type="button"
                  className="reset-button"
                  onClick={handleReset}
                >
                  Đặt lại
                </button>
              </div>
            </form>
          </div>

          {/* List card */}
          <div className="activities-section">
            <div className="activities-section__head">
              <h3 className="section-title">Danh sách sự kiện</h3>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Đang tải dữ liệu...</div>
            ) : activities.length === 0 ? (
              <div className="no-data">Không có sự kiện nào</div>
            ) : (
              <>
                <div className="table-container">
                  <table className="activities-table">
                    <thead>
                      <tr>
                        <th>Tên</th>
                        <th
                          className="sortable"
                          onClick={() => handleSortColumn("startDate")}
                          title="Bấm để sắp xếp"
                        >
                          Ngày bắt đầu{" "}
                          {sort.sortBy === "startDate" &&
                            (sort.direction === "ASC" ? "↑" : "↓")}
                        </th>
                        <th>Ngày kết thúc</th>
                        <th>Điểm thưởng</th>
                        <th>Số lượng tối đa</th>
                        <th>Đã đăng ký</th>
                        <th>Xem</th>
                      </tr>
                    </thead>

                    <tbody>
                      {activities.map((activity, index) => (
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
                            {activity.points ??
                              activity.point ??
                              activity.reward ??
                              0}
                          </td>
                          <td className="quantity-cell">
                            {activity.count ??
                              activity.totalSlot ??
                              activity.slots ??
                              "N/A"}
                          </td>
                          <td className="registered-count-cell">
                            {activity.registeredCount || 0}
                          </td>

                          <td className="action-cell">
                            <button
                              className="view-link"
                              onClick={() => (
                                setIsModalOpen(true),
                                setSelectedActivity(activity)
                              )}
                            >
                              Xem
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.size}
                  totalElements={pagination.totalElements}
                  onPageChange={(page) =>
                    setPagination((prev) => ({ ...prev, page }))
                  }
                  onPageSizeChange={(size) =>
                    setPagination((prev) => ({ ...prev, size, page: 0 }))
                  }
                  loading={loading}
                />
              </>
            )}
          </div>

          <ActivityUpdateModal
            activity={selectedActivity}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUpdate={handleUpdateActivity}
          />
          <ActivityCreateModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreateEvent}
          />
        </div>
      </div>
    </div>
  );
};
