import React, { useState, useEffect, useCallback } from "react";
import "./style.scss";

import { ModalLeave } from "../../../../components/modals/Request/ModalLeave/ModalLeave";
import { ModalWFH } from "../../../../components/modals/Request/ModalWFH/ModalWFH";
import { AttendanceModal } from "../../../../components/modals/Request/ModalTimekeeping/ModalTimekeeping";
import { EmployeeService } from "../../../../services/EmployeeService";
import { Pagination } from "../../../../components/Pagination";

export const Requests = () => {
  const [leaveType, setLeaveType] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [statusFilter, setStatusFilter] = useState({
    pending: true,
    approved: true,
    rejected: true,
  });

  // Modal control
  const [showChooseTypeModal, setShowChooseTypeModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);

  // API data states
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  // Map requestType từ API sang tên hiển thị
  const mapRequestType = (requestType) => {
    const typeMap = {
      "WorkFromHome": "Làm việc tại nhà",
      "Leave": "Nghỉ phép",
      "Attendance": "Chấm công",
      "TimeSheet": "Chấm công", // Có thể có cả TimeSheet
    };
    return typeMap[requestType] || requestType;
  };

  // Map tên hiển thị sang requestType API
  const mapDisplayTypeToApiType = (displayType) => {
    const typeMap = {
      "Làm việc tại nhà": "WorkFromHome",
      "Nghỉ phép": "Leave",
      "Chấm công": "TimeSheet", // Hoặc "Attendance" tùy API
    };
    return typeMap[displayType] || null;
  };

  // Map status từ API sang format component
  const mapStatus = (status) => {
    const statusMap = {
      "PENDING": { status: "pending", statusText: "Chờ duyệt" },
      "APPROVED": { status: "approved", statusText: "Đã duyệt" },
      "REJECTED": { status: "rejected", statusText: "Từ chối" },
    };
    return statusMap[status] || { status: status.toLowerCase(), statusText: status };
  };

  // Format date từ ISO string sang YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Tính số ngày giữa 2 ngày
  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Fetch requests từ API
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = {
        page: pagination.page,
        size: pagination.size,
        direction: "ASC",
        sortBy: "id",
      };

      // Thêm date filters nếu có
      if (startDate) {
        params.startDate = `${startDate}T00:00:00`;
      }
      if (endDate) {
        params.endDate = `${endDate}T23:59:59`;
      }

      // Thêm requestType filter nếu không phải "Tất cả"
      if (leaveType !== "Tất cả") {
        const apiRequestType = mapDisplayTypeToApiType(leaveType);
        if (apiRequestType) {
          params.requestType = apiRequestType;
        }
      }

      // Thêm requeststatus filter nếu chỉ có 1 status được chọn
      const selectedStatuses = Object.entries(statusFilter)
        .filter(([_, isSelected]) => isSelected)
        .map(([status]) => status);
      
      if (selectedStatuses.length === 1) {
        // Map status từ UI sang API format
        const statusMap = {
          "pending": "PENDING",
          "approved": "APPROVED",
          "rejected": "REJECTED",
        };
        params.requeststatus = statusMap[selectedStatuses[0]] || selectedStatuses[0].toUpperCase();
      }

      const response = await EmployeeService.getRequests(params);

      // Map dữ liệu từ API sang format component
      const mappedData = response.content.map((item) => {
        const statusMapped = mapStatus(item.status);
        const requestStartDate = item.startDate || item.createdAt;
        const requestEndDate = item.endDate || item.createdAt;
        
        return {
          id: item.id,
          name: item.employee?.fullName || "",
          duration: calculateDuration(requestStartDate, requestEndDate),
          startDate: formatDate(requestStartDate),
          endDate: formatDate(requestEndDate),
          status: statusMapped.status,
          statusText: statusMapped.statusText,
          reason: item.reason || "",
          paid: false, // API không có field này, có thể cần điều chỉnh
          type: mapRequestType(item.requestType),
          requestType: item.requestType, // Giữ nguyên để filter
        };
      });

      setRequestData(mappedData);
      setPagination({
        page: response.number || 0,
        size: response.size || 10,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
      });
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message || "Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, startDate, endDate, leaveType, statusFilter]);

  // Fetch data khi component mount và khi dependencies thay đổi
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Reset page về 0 khi filters thay đổi
  useEffect(() => {
    if (pagination.page !== 0) {
      setPagination(prev => ({ ...prev, page: 0 }));
    }
  }, [startDate, endDate, leaveType, statusFilter]);

  // Filter data theo type và status (date filter đã được xử lý ở API level)
  const filteredData = requestData.filter((item) => {
    const typeMatch = leaveType === "Tất cả" || item.type === leaveType;

    const statusMatch =
      (statusFilter.pending && item.status === "pending") ||
      (statusFilter.approved && item.status === "approved") ||
      (statusFilter.rejected && item.status === "rejected");

    return typeMatch && statusMatch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-waiting";
      default:
        return "";
    }
  };

  const totalDays = filteredData.reduce((sum, item) => sum + item.duration, 0);
  const paidDays = filteredData
    .filter((item) => item.paid)
    .reduce((sum, item) => sum + item.duration, 0);
  const unpaidDays = totalDays - paidDays;

  const handleStatusChange = (statusKey) => {
    setStatusFilter(prev => ({
      ...prev,
      [statusKey]: !prev[statusKey]
    }));
  };

  // --- Chọn modal ---
  const openRequestModal = (type) => {
    setSelectedRequestType(type);
    setShowChooseTypeModal(false);
  };

  const closeModal = () => setSelectedRequestType(null);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: parseInt(newSize), page: 0 }));
  };

  const handlePaginationPageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePaginationSizeChange = (size) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
  };

  return (
    <div className="leave-management">
      <div className="header-section">
        <div className="filter-group">
          <label>Loại yêu cầu</label>
          <select
            className="select-input"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Nghỉ phép">Nghỉ phép</option>
            <option value="Làm việc tại nhà">Làm việc tại nhà</option>
            <option value="Chấm công">Chấm công</option>
          </select>
        </div>

        <div className="date-filter">
          <label>Khoảng thời gian</label>
          <div className="date-inputs">
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="status-filter">
          <label>Trạng thái</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={statusFilter.pending}
                onChange={() => handleStatusChange('pending')}
              />
              Chờ duyệt
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={statusFilter.approved}
                onChange={() => handleStatusChange('approved')}
              />
              Đã duyệt
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={statusFilter.rejected}
                onChange={() => handleStatusChange('rejected')}
              />
              Từ chối
            </label>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-item">
            Tổng số ngày yêu cầu: <strong>{totalDays}</strong>
          </div>
          <div className="summary-item">
            Nghỉ có lương: <strong>{paidDays}</strong>
          </div>
          <div className="summary-item">
            Nghỉ không lương: <strong>{unpaidDays}</strong>
          </div>
        </div>
      </div>



      {/* Table */}
      <div className="table-section">
        <h3 className="section-title">Danh sách các yêu cầu</h3>
        
        {loading && (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
            <p>Lỗi: {error}</p>
            <button onClick={fetchRequests} style={{ marginTop: "10px" }}>
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && (
          <table className="leave-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Thời gian</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Trạng thái</th>
                <th>Lí do</th>
                <th>Loại nghỉ</th>
                <th>Loại yêu cầu</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.duration}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(item.status)}`}
                      >
                        {item.statusText}
                      </span>
                    </td>
                    <td>{item.reason}</td>
                    <td>{item.paid ? "Có lương" : "Không lương"}</td>
                    <td>{item.type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.size}
            totalElements={pagination.totalElements}
            onPageChange={handlePaginationPageChange}
            onPageSizeChange={handlePaginationSizeChange}
            loading={loading}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="remaining-leave">
          <div className="leaf-icon">🌿</div>
          <p>Ngày nghỉ có lương còn lại</p>
          <h2>0 Ngày</h2>
        </div>

        <button
          className="create-btn"
          onClick={() => setShowChooseTypeModal(true)}
        >
          Tạo yêu cầu
        </button>
      </div>

      {/* Modal chọn loại yêu cầu */}
      {showChooseTypeModal && (
        <div className="modal-overlay">
          <div className="modal choose-type-modal">
            <h3>Chọn loại yêu cầu</h3>

            <button
              onClick={() => openRequestModal("Nghỉ phép")}
              className="modal-btn"
            >
              Nghỉ phép
            </button>
            <button
              onClick={() => openRequestModal("Làm việc tại nhà")}
              className="modal-btn"
            >
              Làm việc tại nhà
            </button>
            <button
              onClick={() => openRequestModal("Chấm công")}
              className="modal-btn"
            >
              Chấm công
            </button>

            <button
              className="close-btn"
              onClick={() => setShowChooseTypeModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Render modal tương ứng */}
      {selectedRequestType === "Nghỉ phép" && (
        <ModalLeave onClose={closeModal} onSuccess={fetchRequests} />
      )}
      {selectedRequestType === "Làm việc tại nhà" && (
        <ModalWFH onClose={closeModal} onSuccess={fetchRequests} />
      )}
      {selectedRequestType === "Chấm công" && (
        <AttendanceModal onClose={closeModal} onSuccess={fetchRequests} />
      )}
    </div>
  );
};