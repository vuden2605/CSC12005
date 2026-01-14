import React, { useState, useEffect } from "react";
import "./style.scss";
import InfoCard from "../../components/InfoCard";
import { ManagerService } from "../../services/ManagerService";
import { EmployeeService } from "../../services/EmployeeService";
import { useSelector } from "react-redux";
import { useAlert } from "../../context/AlertContext";
import EmployeeDetailModal from "../../components/modals/EmployeeDetailModal";
import { Pagination } from "../../components/Pagination";

export const Manager = () => {
  const [employeesPage, setEmployeesPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // ⭐ SEARCH STATE
  const [availablePoints, setAvailablePoints] = useState(0);
  const [rewardInputs, setRewardInputs] = useState({});
  const [rewardLoadingId, setRewardLoadingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [bulkPoints, setBulkPoints] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const currentUser = useSelector((state) => state.user.currentUser);
  const { showAlert } = useAlert();

  const employee = {
    name: currentUser?.fullName || "Nguyễn Văn Quản Lý",
    role: currentUser.position.positionName || "Quản lý",
    avatar: "👨‍💼",
  };

  const fetchEmployees = async (page = 1, size = pageSize) => {
    try {
      const res = await ManagerService.getEmployeesByManager(
        currentUser.id,
        page - 1,
        size,
        "id",
        "ASC"
      );
      setEmployeesPage(res);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.id) fetchEmployees(currentPage, pageSize);
  }, [currentUser, currentPage, pageSize]);

  useEffect(() => {
    const fetchAllocatePoints = async () => {
      if (!currentUser?.id) return;
      try {
        const data = await EmployeeService.getCurrentUser();
        if (data?.allocatePoints != null) {
          setAvailablePoints(data.allocatePoints);
        }
      } catch (error) {
        console.error("Lỗi khi lấy điểm phân bổ hiện có:", error);
      }
    };

    fetchAllocatePoints();
  }, [currentUser?.id]);

  if (!employeesPage) return <div>Đang tải...</div>;

  const employees = employeesPage.content;
  const totalPages = employeesPage.totalPages;
  const totalElements = employeesPage.totalElements;

  // ⭐ FILTER SEARCH
  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================
  // REWARD POINTS
  // ============================
  const handleChangeRewardInput = (employeeId, value) => {
    setRewardInputs((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const handleRewardPoints = async (employeeId, employeeName) => {
    const rawValue = rewardInputs[employeeId];
    const points = Number(rawValue);

    if (!points || isNaN(points) || points <= 0) {
      showAlert("warning", "Vui lòng nhập số điểm hợp lệ (> 0)");
      return;
    }

    if (points > availablePoints) {
      showAlert("warning", "Số điểm nhập vượt quá điểm phân bổ hiện có");
      return;
    }

    try {
      setRewardLoadingId(employeeId);
      await ManagerService.rewardPoints(employeeId, points);

      setAvailablePoints((prev) => prev - points);
      setRewardInputs((prev) => ({
        ...prev,
        [employeeId]: "",
      }));

      showAlert(
        "success",
        `Đã cộng ${points} điểm cho nhân viên ${employeeName}`
      );
    } catch (error) {
      console.error("Lỗi khi thưởng điểm:", error);
      showAlert("error", error.message || "Lỗi khi thưởng điểm cho nhân viên");
    } finally {
      setRewardLoadingId(null);
    }
  };

  const toggleSelectEmployee = (employeeId) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
  };

  const isAllSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((emp) => selectedEmployees.has(emp.id));

  const toggleSelectAll = () => {
    setSelectedEmployees((prev) => {
      if (isAllSelected) {
        return new Set();
      }
      const next = new Set(prev);
      filteredEmployees.forEach((emp) => {
        next.add(emp.id);
      });
      return next;
    });
  };

  const handleBulkReward = async () => {
    const points = Number(bulkPoints);
    const count = selectedEmployees.size;

    if (count === 0) {
      showAlert("warning", "Vui lòng chọn ít nhất một nhân viên");
      return;
    }

    if (!points || isNaN(points) || points <= 0) {
      showAlert("warning", "Vui lòng nhập số điểm hợp lệ (> 0)");
      return;
    }

    const totalNeed = points * count;
    if (totalNeed > availablePoints) {
      showAlert(
        "warning",
        `Số điểm cần (${totalNeed}) vượt quá điểm phân bổ hiện có (${availablePoints})`
      );
      return;
    }

    try {
      setBulkLoading(true);
      const ids = Array.from(selectedEmployees);
      await ManagerService.rewardPoints(ids, points);

      setAvailablePoints((prev) => prev - totalNeed);
      setBulkPoints("");
      setSelectedEmployees(new Set());

      showAlert(
        "success",
        `Đã cộng ${points} điểm cho ${count} nhân viên thành công`
      );
    } catch (error) {
      console.error("Lỗi khi thưởng điểm hàng loạt:", error);
      showAlert("error", error.message || "Lỗi khi thưởng điểm hàng loạt");
    } finally {
      setBulkLoading(false);
    }
  };

  const openEmployeeDetail = (emp) => {
    setSelectedEmployee(emp);
    setShowDetailModal(true);
  };

  const closeEmployeeDetail = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
  };

  // ============================
  // EXPORT CSV
  // ============================
  const exportToCSV = () => {
    const headers = ["Mã NV", "Tên nhân viên", "Phòng ban", "Vị trí"];

    const rows = filteredEmployees.map((emp) => [
      emp.employeeCode,
      emp.fullName,
      emp.department?.departmentName,
      emp.position?.positionName,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      "danh_sach_nhan_vien_" + new Date().toISOString().split("T")[0] + ".csv";
    link.click();
  };

  // ============================
  // EXPORT EXCEL
  // ============================
  const exportToExcel = () => {
    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Tên nhân viên</th>
              <th>Phòng ban</th>
              <th>Vị trí</th>
            </tr>
          </thead>
          <tbody>
            ${filteredEmployees
              .map(
                (emp) => `
              <tr>
                <td>${emp.employeeCode}</td>
                <td>${emp.fullName}</td>
                <td>${emp.department?.departmentName}</td>
                <td>${emp.position?.positionName}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\uFEFF", tableHTML], {
      type: "application/vnd.ms-excel",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      "danh_sach_nhan_vien_" + new Date().toISOString().split("T")[0] + ".xls";
    link.click();
  };

  return (
    <div className="employee-container">
      <InfoCard employee={employee} />

      <h1 className="page-title">Nhân viên phòng ban</h1>

      <div className="employee-list-card">
        <div className="card-header">
          <h2 className="card-title">Danh sách nhân viên phòng ban</h2>
          <div className="employee-count">
            Tổng cộng: {employeesPage.totalElements} nhân viên
          </div>
          <div className="allocate-points-box">
            <span>Điểm phân bổ hiện có:</span>
            <strong>{availablePoints}</strong>
          </div>
        </div>

      
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  title="Chọn tất cả"
                />
              </th>
              <th>Mã NV</th>
              <th>Tên nhân viên</th>
              <th>Phòng ban</th>
              <th>Vị trí</th>
              <th>Thưởng điểm</th>
              <th>Xem</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.has(emp.id)}
                      onChange={() => toggleSelectEmployee(emp.id)}
                    />
                  </td>
                  <td>{emp.employeeCode}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.department?.departmentName}</td>
                  <td>{emp.position?.positionName}</td>
                  <td>
                    <div className="reward-points-cell">
                      <input
                        type="number"
                        min="1"
                        placeholder="Số điểm"
                        value={rewardInputs[emp.id] ?? ""}
                        onChange={(e) =>
                          handleChangeRewardInput(emp.id, e.target.value)
                        }
                        disabled={selectedEmployees.size > 0}
                      />
                      <button
                        className="btn-reward"
                        onClick={() =>
                          handleRewardPoints(emp.id, emp.fullName)
                        }
                        disabled={rewardLoadingId === emp.id || selectedEmployees.size > 0}
                      >
                        {rewardLoadingId === emp.id
                          ? "Đang gửi..."
                          : "Thưởng điểm"}
                      </button>
                    </div>
                  </td>
                  <td>
                    <a
                      href="#"
                      className="link-view"
                      onClick={(e) => {
                        e.preventDefault();
                        openEmployeeDetail(emp);
                      }}
                    >
                      Xem
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Không tìm thấy nhân viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedEmployees.size > 0 && (
          <div className="bulk-reward-bar">
            <div className="bulk-info">
              Đã chọn: <strong>{selectedEmployees.size}</strong> nhân viên
            </div>
            <div className="bulk-actions">
              <input
                type="number"
                min="1"
                placeholder="Số điểm cho mỗi người"
                  value={bulkPoints}
                  onChange={(e) => {
                    const value = e.target.value;
                    setBulkPoints(value);
                    setRewardInputs((prev) => {
                      const next = { ...prev };
                      selectedEmployees.forEach((id) => {
                        next[id] = value;
                      });
                      return next;
                    });
                  }}
              />
              <button
                className="btn-reward bulk-btn"
                onClick={handleBulkReward}
                disabled={bulkLoading}
              >
                {bulkLoading ? "Đang thưởng điểm..." : "Thưởng điểm"}
              </button>
            </div>
          </div>
        )}

        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage - 1}
            totalPages={totalPages}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={(page) => setCurrentPage(page + 1)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      <div className="export-section">
        <button className="btn-export" onClick={exportToExcel}>
          📊 Xuất Excel
        </button>
        <button className="btn-export btn-export-csv" onClick={exportToCSV}>
          📄 Xuất CSV
        </button>
      </div>

      <EmployeeDetailModal
        employee={selectedEmployee}
        open={showDetailModal}
        onClose={closeEmployeeDetail}
      />
    </div>
  );
};
