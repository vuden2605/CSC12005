import React, { useState, useEffect, useCallback } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { ModalLeave } from "../../../../components/modals/Request/ModalLeave/ModalLeave";
import { ModalWFH } from "../../../../components/modals/Request/ModalWFH/ModalWFH";
import { AttendanceModal } from "../../../../components/modals/Request/ModalTimekeeping/ModalTimekeeping";
import { WFHDetailModal } from "../../../../components/modals/Request/WFHDetailModal/WFHDetailModal";
import { TimeSheetDetailModal } from "../../../../components/modals/Request/TimeSheetDetailModal/TimeSheetDetailModal";
import { LeaveDetailModal } from "../../../../components/modals/Request/LeaveDetailModal/LeaveDetailModal";
import { EmployeeService } from "../../../../services/EmployeeService";
import { Pagination } from "../../../../components/Pagination";
import { useSelector } from "react-redux";

export const Requests = () => {
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [leaveType, setLeaveType] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [statusFilter, setStatusFilter] = useState({
    pending: true,
    approved: true,
    rejected: true,
  });

  const [remainingPaidLeave, setRemainingPaidLeave] = useState(null);

  // Modal control
  const [showChooseTypeModal, setShowChooseTypeModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [selectedWFHRequestId, setSelectedWFHRequestId] = useState(null);
  const [selectedTimeSheetRequestId, setSelectedTimeSheetRequestId] = useState(null);
  const [selectedLeaveRequestId, setSelectedLeaveRequestId] = useState(null);

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
      "TimeSheet": "Chấm công",
    };
    return typeMap[requestType] || requestType;
  };

  // Map lý do nghỉ phép (enum) sang tiếng Việt
  const mapLeaveReason = (reason, requestType) => {
    if (!reason) return "";
    if (requestType !== "Leave") return reason;

    const reasonMap = {
      SICK_LEAVE: "Nghỉ ốm",
      ANNUAL_LEAVE: "Nghỉ phép",
      MATERNITY_LEAVE: "Nghỉ thai sản",
      PERSONAL_LEAVE: "Nghỉ việc riêng",
    };

    return reasonMap[reason] || reason;
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

        return {
          id: item.id,
          type: mapRequestType(item.requestType),
          requestType: item.requestType,
          createdAt: formatDate(item.createdAt),
          status: statusMapped.status,
          statusText: statusMapped.statusText,
          reason: mapLeaveReason(item.reason, item.requestType),
          attachment: item.requestAttachment || "",
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
  }, [fetchRequests, location.key]);

  // Tính số ngày nghỉ có lương còn lại từ currentUser trong Redux (persist vào localStorage)
  useEffect(() => {
    if (!currentUser) {
      setRemainingPaidLeave(null);
      return;
    }

    const annualLeave = currentUser.annualLeave ?? 0;
    const usedLeave = currentUser.usedLeave ?? 0;
    const remaining = Math.max(annualLeave - usedLeave, 0);
    setRemainingPaidLeave(remaining);
  }, [currentUser]);

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

  const totalRequests = filteredData.length;
  const pendingCount = filteredData.filter((item) => item.status === "pending").length;
  const approvedCount = filteredData.filter((item) => item.status === "approved").length;
  const rejectedCount = filteredData.filter((item) => item.status === "rejected").length;

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

  const closeWFHDetailModal = () => setSelectedWFHRequestId(null);

  const openWFHDetailModal = (requestId) => {
    setSelectedWFHRequestId(requestId);
  };

  const closeTimeSheetDetailModal = () => setSelectedTimeSheetRequestId(null);

  const openTimeSheetDetailModal = (requestId) => {
    setSelectedTimeSheetRequestId(requestId);
  };

  const closeLeaveDetailModal = () => setSelectedLeaveRequestId(null);

  const openLeaveDetailModal = (requestId) => {
    setSelectedLeaveRequestId(requestId);
  };

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

  // Download file handler
  const handleDownload = async (fileKey) => {
    try {
      const url = await EmployeeService.downloadFile(fileKey);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error downloading file:", err);
      alert(err.message || "Lỗi khi tải file");
    }
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
            Tổng yêu cầu: <strong>{totalRequests}</strong>
          </div>
          <div className="summary-item">
            Chờ duyệt: <strong>{pendingCount}</strong>
          </div>
          <div className="summary-item">
            Đã duyệt: <strong>{approvedCount}</strong>
          </div>
          <div className="summary-item">
            Từ chối: <strong>{rejectedCount}</strong>
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
                <th>Loại yêu cầu</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Lý do</th>
                <th>Tệp đính kèm</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.type}</td>
                    <td>{item.createdAt}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(item.status)}`}
                      >
                        {item.statusText}
                      </span>
                    </td>
                    <td>{item.reason || "-"}</td>
                    <td>
                      {item.attachment ? (
                        <button
                          onClick={() => handleDownload(item.attachment)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#5c6bc0',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: 0
                          }}
                        >
                          Tải xuống
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {item.requestType === "WorkFromHome" && (
                        <button
                          className="btn-view-detail"
                          onClick={() => openWFHDetailModal(item.id)}
                          title="Xem chi tiết"
                        >
                          Xem chi tiết
                        </button>
                      )}
                      {item.requestType === "TimeSheet" && (
                        <button
                          className="btn-view-detail"
                          onClick={() => openTimeSheetDetailModal(item.id)}
                          title="Xem chi tiết"
                        >
                          Xem chi tiết
                        </button>
                      )}
                      {item.requestType === "Leave" && (
                        <button
                          className="btn-view-detail"
                          onClick={() => openLeaveDetailModal(item.id)}
                          title="Xem chi tiết"
                        >
                          Xem chi tiết
                        </button>
                      )}
                    </td>
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
          <h2>
            {remainingPaidLeave !== null ? `${remainingPaidLeave} Ngày` : "..."}
          </h2>
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

      {/* Modal chi tiết WFH request */}
      {selectedWFHRequestId && (
        <WFHDetailModal
          requestId={selectedWFHRequestId}
          onClose={closeWFHDetailModal}
        />
      )}

      {/* Modal chi tiết TimeSheet request */}
      {selectedTimeSheetRequestId && (
        <TimeSheetDetailModal
          requestId={selectedTimeSheetRequestId}
          onClose={closeTimeSheetDetailModal}
        />
      )}

      {/* Modal chi tiết Leave request */}
      {selectedLeaveRequestId && (
        <LeaveDetailModal
          requestId={selectedLeaveRequestId}
          onClose={closeLeaveDetailModal}
        />
      )}
    </div>
  );
};