import React, { useState, useEffect } from "react";
import "./exchange-requests.scss";
import { HRService } from "../../services/HRService";
import { Pagination } from "../../components/Pagination";
import PointExchangeDetailModal from "../../components/modals/PointExchangeDetailModal";

const PointExchangeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    employeeName: "",
    employeeCode: "",
    status: "",
    startDate: "",
    endDate: "",
    sortBy: "requestedAt",
    direction: "DESC",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchExchangeRequests();
  }, [pagination.page, pagination.size]);

  // Auto-search khi filters thay đổi (với debounce cho text inputs)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 0 }));
      fetchExchangeRequests();
    }, 500); // Debounce 500ms

    return () => clearTimeout(debounceTimer);
  }, [filters.employeeName, filters.employeeCode, filters.status, filters.startDate, filters.endDate]);

  const fetchExchangeRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: filters.sortBy,
        direction: filters.direction,
        ...(filters.status && { status: filters.status }),
        ...(filters.employeeName && { employeeName: filters.employeeName }),
        ...(filters.employeeCode && { employeeCode: filters.employeeCode }),
        ...(filters.startDate && { 
          startDate: filters.startDate + 'T00:00:00.000'
        }),
        ...(filters.endDate && { 
          endDate: filters.endDate + 'T23:59:59.999'
        }),
      };
      
      const response = await HRService.getPointExchangeRequests(params);
      
      // Xử lý response có pagination
      if (response?.content && Array.isArray(response.content)) {
        setRequests(response.content);
        setPagination(prev => ({
          ...prev,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
        }));
      } else {
        // Fallback cho response không có pagination
        const data = Array.isArray(response) ? response : response?.data || [];
        setRequests(data);
      }
    } catch (error) {
      console.error("Error fetching exchange requests:", error);
      setError(error.message || "Không thể tải dữ liệu yêu cầu đổi điểm");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchExchangeRequests();
  };

  const handleReset = () => {
    setFilters({
      employeeName: "",
      employeeCode: "",
      status: "",
      startDate: "",
      endDate: "",
      sortBy: "requestedAt",
      direction: "DESC",
    });
    setPagination(prev => ({ ...prev, page: 0 }));
    setTimeout(() => fetchExchangeRequests(), 100);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSizeChange = (newSize) => {
    setPagination(prev => ({ 
      ...prev, 
      size: newSize,
      page: 0 
    }));
  };

  const handleSort = (column) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      direction: prev.sortBy === column && prev.direction === 'ASC' ? 'DESC' : 'ASC',
    }));
    setPagination(prev => ({ ...prev, page: 0 }));
    setTimeout(() => fetchExchangeRequests(), 100);
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return '⇅';
    return filters.direction === 'ASC' ? '↑' : '↓';
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const handleApproveFromModal = async () => {
    if (selectedRequest) {
      await handleApprove(selectedRequest.id);
      handleCloseDetail();
    }
  };

  const handleCompleteFromModal = async () => {
    if (selectedRequest) {
      await handleComplete(selectedRequest.id);
      handleCloseDetail();
    }
  };

  const handleRejectFromModal = async () => {
    if (selectedRequest) {
      await handleReject(selectedRequest.id);
      handleCloseDetail();
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId);
      setError("");
      await HRService.approvePointExchangeRequest(requestId);
      setSuccessMessage("Phê duyệt yêu cầu thành công!");
      
      setTimeout(() => {
        fetchExchangeRequests();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi khi phê duyệt yêu cầu");
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (requestId) => {
    try {
      setProcessingId(requestId);
      setError("");
      await HRService.completePointExchangeRequest(requestId);
      setSuccessMessage("Đã cập nhật trạng thái chuyển khoản!");
      
      setTimeout(() => {
        fetchExchangeRequests();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật chuyển khoản");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);
      setError("");
      await HRService.rejectPointExchangeRequest(requestId);
      setSuccessMessage("Từ chối yêu cầu thành công!");
      
      setTimeout(() => {
        fetchExchangeRequests();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi khi từ chối yêu cầu");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { text: "Chờ duyệt", class: "badge-pending" },
      APPROVED: { text: "Đã duyệt", class: "badge-approved" },
      COMPLETED: { text: "Đã chuyển khoản", class: "badge-completed" },
      REJECTED: { text: "Đã từ chối", class: "badge-rejected" },
    };
    const statusInfo = statusMap[status] || { text: status, class: "badge-default" };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <div className="exchange-requests-section">
      <div className="filter-section">
        <div className="filter-header">
          <h3>🔍 Tìm kiếm yêu cầu đổi điểm</h3>
        </div>
        <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
          <div className="filter-grid">
            <div className="form-group">
              <label>Tên nhân viên</label>
              <input
                type="text"
                placeholder="Nhập tên..."
                value={filters.employeeName}
                onChange={handleFilterChange("employeeName")}
              />
            </div>

            <div className="form-group">
              <label>Mã nhân viên</label>
              <input
                type="text"
                placeholder="Nhập mã..."
                value={filters.employeeCode}
                onChange={handleFilterChange("employeeCode")}
              />
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={filters.status}
                onChange={handleFilterChange("status")}
              >
                <option value="">-- Tất cả --</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="COMPLETED">Đã chuyển khoản</option>
                <option value="REJECTED">Đã từ chối</option>
              </select>
            </div>

            <div className="form-group">
              <label>Từ ngày</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={handleFilterChange("startDate")}
              />
            </div>

            <div className="form-group">
              <label>Đến ngày</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={handleFilterChange("endDate")}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button type="submit" className="btn-search" onClick={handleSearch}>
              <span className="btn-icon">🔍</span>
              <span>Tìm kiếm</span>
            </button>
            <button type="button" className="btn-reset" onClick={handleReset}>
              <span className="btn-icon">🔄</span>
              <span>Đặt lại</span>
            </button>
          </div>
        </form>
      </div>

      <div className="table-section">
        <h3>Danh sách yêu cầu đổi điểm ({pagination.totalElements})</h3>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : requests.length === 0 ? (
          <div className="empty-state">Không có dữ liệu</div>
        ) : (
          <table className="exchange-requests-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên nhân viên</th>
                <th>Mã NV</th>
                <th className="sortable" onClick={() => handleSort('pointUsed')}>
                  Điểm sử dụng {getSortIcon('pointUsed')}
                </th>
                <th className="sortable text-right" onClick={() => handleSort('exchangeValue')}>
                  Giá trị quy đổi {getSortIcon('exchangeValue')}
                </th>
                <th>Ghi chú</th>
                <th className="sortable" onClick={() => handleSort('requestedAt')}>
                  Ngày yêu cầu {getSortIcon('requestedAt')}
                </th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{pagination.page * pagination.size + index + 1}</td>
                  <td>{request.employeeName || "N/A"}</td>
                  <td>{request.employeeCode || "N/A"}</td>
                  <td className="points-cell">{request.pointUsed || 0}</td>
                  <td className="value-cell">{(request.exchangeValue || 0).toLocaleString('vi-VN')} ₫</td>
                  <td className="note-cell">{request.note || ""}</td>
                  <td>
                    {request.requestedAt
                      ? new Date(request.requestedAt).toLocaleDateString("vi-VN", {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "N/A"}
                  </td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td className="action-cell">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetail(request)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination */}
        {requests.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.size}
            totalElements={pagination.totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handleSizeChange}
            loading={loading}
          />
        )}
      </div>

      {/* Detail Modal */}
      <PointExchangeDetailModal
        isOpen={showDetailModal}
        selectedRequest={selectedRequest}
        processingId={processingId}
        getStatusBadge={getStatusBadge}
        onClose={handleCloseDetail}
        onApprove={handleApproveFromModal}
        onReject={handleRejectFromModal}
        onComplete={handleCompleteFromModal}
      />
    </div>
  );
};

export default PointExchangeRequests;
