import React, { useState, useEffect, use } from "react";
import { HRService } from "../../services/HRService";
import CandidateDetailModal from "./CandidateDetailModal";
import "./style.scss";
import { PositionService } from "../../services/PositionService";
import Select from "react-select";
import AddCandidateModal from "./AddCandidateModal";
import { useAlert } from "../../context/AlertContext";
import { Pagination } from "../Pagination";
const CandidateList = () => {
  const { showAlert } = useAlert();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  // Filter state
  const [filters, setFilters] = useState({
    fullName: "",
    email: "",
    positionId: null,
    status: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sortBy: "createdAt",
    direction: "DESC",
  });

  // Modal state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Positions
  const [positions, setPositions] = useState([]);
  const fetchPositions = async () => {
    try {
      const data = await PositionService.getAll();
      setPositions(data);
      console.log("position", data);
      console.log("Fetched positions:", data);
    } catch (err) {
      console.error("Failed to fetch positions:", err);
    } finally {
    }
  };
  useEffect(() => {
    fetchPositions();
  }, []);

  const positionOptions = positions.map((p) => ({
    value: p.id,
    label: p.positionName || p.name,
  }));
  const customStyles = {
    container: (base) => ({
      ...base,
      width: "250px",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "150px",
    }),
  };
  ///-------------------
  const statusOptions = [
    { value: "NOT_INTERVIEWED", label: "Chưa phỏng vấn" },
    { value: "INTERVIEWING", label: "Đang phỏng vấn" },
    { value: "INTERVIEWED", label: "Đã phỏng vấn" },
    { value: "PASSED", label: "Đạt" },
    { value: "FAILED", label: "Không đạt" },
    { value: "HIRED", label: "Đã thành nhân viên" },
  ];

  useEffect(() => {
    fetchCandidates();
  }, [pagination.page, pagination.size, filters]);

  const fetchCandidates = async () => {
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

      const response = await HRService.filterCandidates(
        cleanFilters,
        pagination
      );

      console.log("Full response structure:", response);
      console.log("Response keys:", Object.keys(response || {}));

      // ========== XỬ LÝ RESPONSE ==========
      if (response && response.content && Array.isArray(response.content)) {
        // ✅ PAGINATED RESPONSE từ backend
        console.log(
          "Using paginated response - totalElements:",
          response.totalElements
        );

        const allCandidates = response.content;
        const notInterviewedCandidates = allCandidates.filter(
          (candidate) => candidate.status === "NOT_INTERVIEWED"
        );

        setCandidates(allCandidates);
        setTotalElements(response.totalElements || allCandidates.length);

        console.log(
          `Total:  ${response.totalElements}, Not interviewed: ${notInterviewedCandidates.length}`
        );
      } else if (Array.isArray(response)) {
        // ✅ ARRAY RESPONSE
        console.log("Using array response - length:", response.length);

        const notInterviewedCandidates = response.filter(
          (candidate) => candidate.status === "NOT_INTERVIEWED"
        );

        setCandidates(response);
        setTotalElements(response.length);

        console.log(
          `Total: ${response.length}, Not interviewed: ${notInterviewedCandidates.length}`
        );
      } else {
        console.log("No valid response");
        setCandidates([]);
        setTotalElements(0);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch candidates");
      console.error("Fetch candidates error:", err);

      setCandidates([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 0 });
    fetchCandidates();
  };

  const handleReset = () => {
    setFilters({
      fullName: "",
      email: "",
      positionId: null,
      status: "",
    });
    setPagination({
      page: 0,
      size: 10,
      sortBy: "createdAt",
      direction: "DESC",
    });
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalVisible(true);
  };
  //-----------------------------create--------------
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const handleOpenAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
  };

  const handleAddSuccess = (newCandidate) => {
    showAlert("success", "Thêm ứng viên thành công!");
    setIsAddModalVisible(false);
    fetchCandidates(); // Refresh list
  };
  const handleUpdateSuccess = (newCandidate) => {
    showAlert("success", "Sửa thông tin ứng viên thành công!");
    fetchCandidates(); // Refresh list
  };
  //----------------------------------------
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handlePageSizeChange = (e) => {
    setPagination({ ...pagination, size: parseInt(e.target.value), page: 0 });
  };

  const getStatusClass = (status) => {
    const classes = {
      NOT_INTERVIEWED: "status-new",
      HIRED: "status-screening",
      INTERVIEWING: "status-interviewing",
      INTERVIEWED: "status-interviewed",
      PASSED: "status-passed",
      FAILED: "status-rejected",
    };
    return classes[status] || "status-default";
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  const totalPages = Math.ceil(totalElements / pagination.size);

  return (
    <div className="candidate-list">

      <div className="page-header">
        <h2 className="page-title">
          <i className="icon-user"></i>
          Danh sách ứng viên
        </h2>
        <div className="actions">
          <button
            className="btn add"
            onClick={handleOpenAddModal}
            disabled={loading}
          >
            + Thêm ứng viên mới
          </button>

          <button
            className="btn add"
            // onClick={() => setShowImportModal(true)}
            disabled={loading}
          >
            + Thêm ứng viên từ file
          </button>
          <button className="btn export">Xuất ▼</button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <form onSubmit={handleSearch}>
          <div className="filter-grid">
            <div className="filter-item" style={{ width: "250px" }}>
              <label htmlFor="fullName">Tìm theo tên</label>
              <input
                type="text"
                id="fullName"
                placeholder="Nhập tên ứng viên..."
                value={filters.fullName}
                onChange={(e) =>
                  setFilters({ ...filters, fullName: e.target.value })
                }
              />
            </div>

            <div className="filter-item" style={{ width: "250px" }}>
              <label htmlFor="email">Tìm theo email</label>
              <input
                type="text"
                id="email"
                placeholder="Nhập email..."
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />
            </div>

            <div className="filter-item">
              <label htmlFor="positionId">Vị trí</label>
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

            <div className="filter-item">
              <label htmlFor="status">Trạng thái</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">Tất cả trạng thái</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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

      {/* Statistics */}
      {/* <div className="statistics">
        <span className="total-count">
          Tổng số ứng viên mới: <strong>{totalNotInterviewed}</strong>
        </span>
      </div> */}

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
        ) : candidates.length === 0 ? (
          <div className="empty-state">
            <i className="icon-inbox"></i>
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <>
            <table className="candidate-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vị trí</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td className="text-center">
                      {pagination.page * pagination.size + index + 1}
                    </td>
                    <td>
                      <div className="candidate-name">
                        <i className="icon-user-small"></i>
                        <strong>{candidate.fullName}</strong>
                      </div>
                    </td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone || "N/A"}</td>
                    <td>{candidate.position?.positionName || "N/A"}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          candidate.status
                        )}`}
                      >
                        {getStatusLabel(candidate.status)}
                      </span>
                    </td>
                    <td className="text-center">
                      {candidate.createdAt ? (
                        <span className="rating-badge">
                          {candidate.createdAt}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-view"
                        onClick={() => handleViewDetails(candidate)}
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

      {/* Detail Modal */}
      {isModalVisible && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedCandidate(null);
          }}
          onUpdate={handleUpdateSuccess}
        />
      )}
      {isAddModalVisible && (
        <AddCandidateModal
          positions={positions}
          onClose={handleCloseAddModal}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
};

export default CandidateList;
