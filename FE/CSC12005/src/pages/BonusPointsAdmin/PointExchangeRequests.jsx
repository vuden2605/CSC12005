import React, { useState, useEffect } from "react";
import "./exchange-requests.scss";
import { HRService } from "../../services/HRService";

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
    status: "",
    direction: "ASC",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchExchangeRequests();
  }, [pagination.page, pagination.size]);

  const fetchExchangeRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        size: pagination.size,
        direction: filters.direction,
        ...(filters.status && { status: filters.status }),
        ...(filters.employeeName && { employeeName: filters.employeeName }),
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
      status: "",
      direction: "ASC",
    });
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
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
      REJECTED: { text: "Đã từ chối", class: "badge-rejected" },
    };
    const statusInfo = statusMap[status] || { text: status, class: "badge-default" };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  return (
    <div className="exchange-requests-section">
      <div className="filter-section">
        <h3>Tìm kiếm yêu cầu đổi điểm</h3>
        <form className="filter-form">
          <div className="form-group">
            <label>Tên nhân viên</label>
            <input
              type="text"
              placeholder="Nhập tên"
              value={filters.employeeName}
              onChange={handleFilterChange("employeeName")}
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
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-search" onClick={handleSearch}>
              Tìm kiếm
            </button>
            <button type="button" className="btn-reset" onClick={handleReset}>
              Đặt lại
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
                <th>Email</th>
                <th>Điểm yêu cầu</th>
                <th>Giải thưởng</th>
                <th>Ngày yêu cầu</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{pagination.page * pagination.size + index + 1}</td>
                  <td>{request.employeeName || "N/A"}</td>
                  <td>{request.email || "N/A"}</td>
                  <td className="points-cell">{request.pointsRequired || 0}</td>
                  <td>{request.rewardName || "N/A"}</td>
                  <td>
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td className="action-cell">
                    {request.status === "PENDING" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? "..." : "Duyệt"}
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? "..." : "Từ chối"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="pagination-controls">
            <button 
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="btn-page"
            >
              Trước
            </button>
            <span className="page-info">
              Trang {pagination.page + 1} / {pagination.totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="btn-page"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointExchangeRequests;
