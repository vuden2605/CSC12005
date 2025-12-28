import React, { useState, useEffect } from "react";
import "./style.scss";
import { HRService } from "../../services/HRService";
import PointExchangeRequests from "./PointExchangeRequests";
import { Pagination } from "../../components/Pagination";

export const BonusPointsAdmin = () => {
  const [activeTab, setActiveTab] = useState("grant");
  const [bonusPoints, setBonusPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [isGranting, setIsGranting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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

  const handleGrantPoints = async () => {
    if (selectedEmployees.size === 0) {
      setError("Vui lòng chọn ít nhất một nhân viên");
      return;
    }

    try {
      setIsGranting(true);
      setError("");
      setSuccessMessage("");
      
      const candidateIds = Array.from(selectedEmployees);
      await HRService.grantMonthlyPoints(candidateIds);
      
      setSuccessMessage(`Đã phát điểm cho ${candidateIds.length} nhân viên thành công!`);
      setSelectedEmployees(new Set());
      
      // Tải lại dữ liệu sau 2 giây
      setTimeout(() => {
        fetchBonusPoints();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi khi phát điểm");
      console.error("Error granting points:", err);
    } finally {
      setIsGranting(false);
    }
  };

  const handleGrantPointsSingle = async (employeeId) => {
    try {
      setIsGranting(true);
      setError("");
      setSuccessMessage("");
      
      await HRService.grantMonthlyPoints([employeeId]);
      
      setSuccessMessage("Đã phát điểm cho nhân viên thành công!");
      
      // Tải lại dữ liệu sau 2 giây
      setTimeout(() => {
        fetchBonusPoints();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Lỗi khi phát điểm");
      console.error("Error granting points:", err);
    } finally {
      setIsGranting(false);
    }
  };

  const handleSelectEmployee = (employeeId) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId);
    } else {
      newSelected.add(employeeId);
    }
    setSelectedEmployees(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.size === filteredData.length && filteredData.length > 0) {
      // Nếu đã chọn tất cả thì bỏ chọn
      setSelectedEmployees(new Set());
    } else {
      // Chọn tất cả
      const allIds = new Set(filteredData.map(item => item.id));
      setSelectedEmployees(allIds);
    }
  };

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

  const isAllSelected = filteredData.length > 0 && selectedEmployees.size === filteredData.length;
  const isSomeSelected = selectedEmployees.size > 0 && selectedEmployees.size < filteredData.length;

  return (
    <div className="bonus-points-admin">
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === "grant" ? "active" : ""}`}
          onClick={() => setActiveTab("grant")}
        >
          Danh sách phát điểm
        </button>
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
          {selectedEmployees.size > 0 && (
            <button 
              className="btn-grant-points" 
              onClick={handleGrantPoints}
              disabled={isGranting}
            >
              {isGranting ? "Đang phát điểm..." : "Phát điểm"}
            </button>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : paginatedData.length === 0 ? (
          <div className="empty-state">Không có dữ liệu</div>
        ) : (
          <table className="bonus-points-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                    title="Chọn tất cả"
                  />
                </th>
                <th>STT</th>
                <th>Mã nhân viên</th>
                <th>Tên nhân viên</th>
                <th>Email</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Điểm</th>
                <th>Ngày tuyển dụng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((point, index) => (
                <tr key={point.id} className={selectedEmployees.has(point.id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.has(point.id)}
                      onChange={() => handleSelectEmployee(point.id)}
                    />
                  </td>
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
                  <td className="action-cell">
                    <button
                      className="btn-grant-single"
                      onClick={() => handleGrantPointsSingle(point.id)}
                      disabled={isGranting}
                      title="Phát điểm cho nhân viên này"
                    >
                      {isGranting ? "Đang phát..." : "Phát điểm"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedEmployees.size > 0 && (
          <div className="selection-info">
            Đã chọn: <strong>{selectedEmployees.size}</strong> nhân viên
          </div>
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
