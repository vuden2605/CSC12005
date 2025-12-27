import React, { useState, useEffect, useMemo } from "react";
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
  const [selectedIds, setSelectedIds] = useState([]);

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

  const getActionsForStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return ['approve', 'reject'];
      case 'APPROVED':
        return ['complete'];
      default:
        return [];
    }
  };

  const bulkActions = useMemo(() => {
    if (selectedIds.length === 0) return [];
    const selected = requests.filter(r => selectedIds.includes(r.id));
    if (selected.length === 0) return [];
    let common = new Set(getActionsForStatus(selected[0].status));
    for (let i = 1; i < selected.length; i++) {
      const actions = new Set(getActionsForStatus(selected[i].status));
      common = new Set([...common].filter(a => actions.has(a)));
      if (common.size === 0) break;
    }
    return [...common];
  }, [selectedIds, requests]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(requests.map(req => req.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
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

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Bạn có chắc muốn phê duyệt ${selectedIds.length} yêu cầu đã chọn?`)) {
      return;
    }

    try {
      setError("");
      await HRService.approvePointExchangeRequest(selectedIds);
      setSuccessMessage(`Đã phê duyệt ${selectedIds.length} yêu cầu thành công!`);
      setSelectedIds([]);
      
      setTimeout(() => {
        fetchExchangeRequests();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi khi phê duyệt hàng loạt");
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

  const handleBulkComplete = async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Bạn có chắc muốn đánh dấu đã chuyển khoản cho ${selectedIds.length} yêu cầu?`)) {
      return;
    }

    try {
      setError("");
      await HRService.completePointExchangeRequest(selectedIds);
      setSuccessMessage(`Đã cập nhật ${selectedIds.length} yêu cầu thành công!`);
      setSelectedIds([]);
      
      setTimeout(() => {
        fetchExchangeRequests();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật hàng loạt");
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

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Bạn có chắc muốn từ chối ${selectedIds.length} yêu cầu đã chọn?`)) {
      return;
    }

    try {
      setError("");
      await HRService.rejectPointExchangeRequest(selectedIds);
      setSuccessMessage(`Đã từ chối ${selectedIds.length} yêu cầu!`);
      setSelectedIds([]);
      
      setTimeout(() => {
        fetchExchangeRequests();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi khi từ chối hàng loạt");
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Danh sách yêu cầu đổi điểm ({pagination.totalElements})</h3>
          {selectedIds.length > 0 && bulkActions.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {bulkActions.includes('approve') && (
                <button 
                  className="btn-approve" 
                  onClick={handleBulkApprove}
                  style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ✓ Phê duyệt ({selectedIds.length})
                </button>
              )}
              {bulkActions.includes('complete') && (
                <button 
                  className="btn-complete" 
                  onClick={handleBulkComplete}
                  style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  💰 Đã chuyển khoản ({selectedIds.length})
                </button>
              )}
              {bulkActions.includes('reject') && (
                <button 
                  className="btn-reject" 
                  onClick={handleBulkReject}
                  style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ✗ Từ chối ({selectedIds.length})
                </button>
              )}
            </div>
          )}
        </div>
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
                <th style={{ width: '50px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === requests.length && requests.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
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
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(request.id)}
                      onChange={() => handleSelectOne(request.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
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
                      style={{ marginRight: '5px' }}
                    >
                      Xem chi tiết
                    </button>
                    {request.status === "PENDING" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                          style={{ 
                            marginRight: '5px', 
                            padding: '6px 12px', 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}
                        >
                          {processingId === request.id ? "..." : "✓ Duyệt"}
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                          style={{ 
                            padding: '6px 12px', 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}
                        >
                          {processingId === request.id ? "..." : "✗ Từ chối"}
                        </button>
                      </>
                    )}
                    {request.status === "APPROVED" && (
                      <button
                        className="btn-complete"
                        onClick={() => handleComplete(request.id)}
                        disabled={processingId === request.id}
                        style={{ 
                          padding: '6px 12px', 
                          backgroundColor: '#007bff', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer' 
                        }}
                      >
                        {processingId === request.id ? "..." : "💰 Chuyển khoản"}
                      </button>
                    )}
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
