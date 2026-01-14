import React, { useState, useEffect } from "react";
import "./style.scss";
import { HRService } from "../../services/HRService";
import PointExchangeRequests from "./PointExchangeRequests";
import { Pagination } from "../../components/Pagination";

export const BonusPointsAdmin = () => {
  const [activeTab, setActiveTab] = useState("exchange");
  const [bonusPoints, setBonusPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });
  const [filters, setFilters] = useState({
    employeeName: "",
    pointsFrom: "",
    pointsTo: "",
    departmentId: "",
  });

  useEffect(() => {
    fetchBonusPoints();
  }, []);

  const fetchBonusPoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await HRService.getMonthlyCandidatesPoints();
      
      // Normalize dữ liệu từ API
      const data = Array.isArray(response) ? response : response?.data || response || [];
      setBonusPoints(data);
    } catch (error) {
      console.error("Error fetching bonus points:", error);
      setError(error.message || "Không thể tải dữ liệu điểm thưởng");
      setBonusPoints([]);
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

  const applyFilters = () => {
    // Filter logic
    let filtered = bonusPoints;

    if (filters.employeeName) {
      filtered = filtered.filter((item) =>
        item.fullName?.toLowerCase().includes(filters.employeeName.toLowerCase())
      );
    }

    if (filters.pointsFrom) {
      filtered = filtered.filter((item) => (item.position?.point || 0) >= parseFloat(filters.pointsFrom));
    }

    if (filters.pointsTo) {
      filtered = filtered.filter((item) => (item.position?.point || 0) <= parseFloat(filters.pointsTo));
    }

    if (filters.departmentId) {
      filtered = filtered.filter((item) => item.department?.id === parseInt(filters.departmentId));
    }

    return filtered;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filters được áp dụng realtime
  };

  const handleReset = () => {
    setFilters({
      employeeName: "",
      pointsFrom: "",
      pointsTo: "",
      departmentId: "",
    });
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

  // Bỏ chức năng phát điểm thủ công vì BE đã dùng lịch.

  const filteredData = applyFilters();
  
  // Pagination logic
  const totalElements = filteredData.length;
  const totalPages = Math.ceil(totalElements / pagination.size);
  const paginatedData = filteredData.slice(
    pagination.page * pagination.size,
    (pagination.page + 1) * pagination.size
  );
  
  // Get unique departments for filter dropdown
  const departments = [...new Set(bonusPoints.map(item => item.department?.id))].map(id => 
    bonusPoints.find(item => item.department?.id === id)?.department
  ).filter(Boolean);


  return (
    <div className="bonus-points-admin">
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === "exchange" ? "active" : ""}`}
          onClick={() => setActiveTab("exchange")}
        >
          Yêu cầu đổi điểm
        </button>
      </div>

      {activeTab === "grant" ? (
        <>
          <div className="filter-section">
            <h3>Tìm kiếm điểm thưởng</h3>
            <form onSubmit={handleSearch} className="filter-form">
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
                <label>Điểm từ</label>
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.pointsFrom}
              onChange={handleFilterChange("pointsFrom")}
            />
          </div>

          <div className="form-group">
            <label>Điểm đến</label>
            <input
              type="number"
              placeholder="Đến"
              value={filters.pointsTo}
              onChange={handleFilterChange("pointsTo")}
            />
          </div>

          <div className="form-group">
            <label>Phòng ban</label>
            <select
              value={filters.departmentId}
              onChange={handleFilterChange("departmentId")}
            >
              <option value="">-- Tất cả --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-search">
              Tìm kiếm
            </button>
            <button type="button" className="btn-reset" onClick={handleReset}>
              Đặt lại
            </button>
          </div>
        </form>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h3>Danh sách nhân viên cần phát điểm tháng này ({totalElements})</h3>
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : paginatedData.length === 0 ? (
          <div className="empty-state">Không có dữ liệu</div>
        ) : (
          <table className="bonus-points-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã nhân viên</th>
                <th>Tên nhân viên</th>
                <th>Email</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Điểm</th>
                <th>Ngày tuyển dụng</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((point, index) => (
                <tr key={point.id}>
                  <td>{pagination.page * pagination.size + index + 1}</td>
                  <td>{point.employeeCode || "N/A"}</td>
                  <td>{point.fullName || "N/A"}</td>
                  <td>{point.email || "N/A"}</td>
                  <td>{point.department?.departmentName || "N/A"}</td>
                  <td>{point.position?.positionName || "N/A"}</td>
                  <td className="points-cell">{point.position?.point || 0}</td>
                  <td>
                    {point.hireDate
                      ? new Date(point.hireDate).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {totalElements > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            pageSize={pagination.size}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handleSizeChange}
            loading={loading}
          />
        )}
      </div>
        </>
      ) : (
        <PointExchangeRequests />
      )}
    </div>
  );
};;;
